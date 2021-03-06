import * as R from 'ramda';
import { NavigationActions } from 'react-navigation';
import JPush from 'jpush-react-native';
// import Config from 'react-native-config';
import Config from '../runtime';

import { getConstants, getAllPermissions, getAllRoles } from '../services/api';
import { initKeychain } from '../utils/keychain';
import request from '../utils/request';
import { Storage } from '../utils';
import { initNIM } from 'utils/nim';

export default {
  namespace: 'global',

  state: {
    title: 'Hotnode',
    constants: null,
    projectTags: [],
    financeStage: [],
    permissions: [],
    roles: [],
  },

  effects: {
    *bootstrap({ callback, fromLogin = false }, { call, put, select }) {
      try {
        // put => non-blocking, put.resolve => blocking
        yield put.resolve({
          type: 'initial',
        });

        // cold started check
        // const result = yield call(Storage.get, 'cold_started');
        // if (R.isNil(result)) {
        //   yield put(
        //     NavigationActions.navigate({
        //       routeName: 'Recommendation',
        //       params: {
        //         fromLogin,
        //       },
        //     }),
        //   );
        //   return;
        // }

        if (fromLogin) {
          const user = yield select(state =>
            R.path(['user', 'currentUser'])(state),
          );

          if (
            R.pipe(
              R.path(['realname']),
              R.test(/用户/),
            )(user)
          ) {
            yield put(
              NavigationActions.navigate({
                routeName: 'RealnameInput',
              }),
            );
            return;
          }

          yield put(NavigationActions.back());
        } else {
          const in_individual = yield select(state =>
            R.path(['login', 'in_individual'])(state),
          );

          yield put(
            NavigationActions.navigate({
              routeName: in_individual ? 'Individual' : 'Main',
            }),
          );
        }

        if (callback) {
          yield call(callback);
        }
      } catch (e) {
        console.log(e);
      }
    },
    *startup({ callback }, { call, put, all }) {
      try {
        // sensor set profile
        global.setProfile({
          client_type: '个人版',
        });

        yield all([
          put.resolve({
            type: 'getConstant',
          }),
          put({
            type: 'filter/fetchInstitution',
          }),
          put({
            type: 'filter/fetchCoinTag',
          }),
        ]);

        yield put(
          NavigationActions.navigate({
            routeName: 'Individual',
          }),
        );

        if (callback) {
          yield call(callback);
        }
      } catch (error) {
        console.log(error);
      }
    },
    *initial(_, { select, put, all }) {
      const in_individual = yield select(state =>
        R.path(['login', 'in_individual'])(state),
      );

      if (R.isNil(request.defaults.headers.common.Authorization)) {
        const token = yield select(state => R.path(['login', 'token'])(state));
        request.defaults.headers.common.Authorization = `Bearer ${token}`;
      }

      // basic info init
      yield all([
        put({
          type: 'filter/fetchInstitution',
        }),
        put({
          type: 'filter/fetchCoinTag',
        }),
        put({
          type: 'coinSets/fetch',
        }),
      ]);

      try {
        yield put.resolve({
          type: in_individual ? 'initIndividualEnd' : 'initInstitutionEnd',
        });
      } catch (e) {
        console.log(e);
      }
    },
    *getPermission(_, { call, put }) {
      try {
        const res = yield call(getAllPermissions);

        yield put({
          type: 'getPermissions',
          payload: res.data,
        });
      } catch (error) {
        console.log(error);
      }
    },
    *getConstant(_, { call, put }) {
      try {
        const res = yield call(getConstants);

        yield put({
          type: 'getConstants',
          payload: res.data,
        });
      } catch (error) {
        console.log(error);
      }
    },
    *initRealm({ callback }, { call }) {
      try {
        yield call(initKeychain);
        if (callback) {
          callback();
        }
      } catch (error) {
        console.log(error);
      }
    },
    *initIndividualEnd({ callback }, { call, put, select, all }) {
      try {
        // http header config
        request.defaults.baseURL = Config.API_INDIVIDUAL_URL;
        request.defaults.headers.common['X-Company-ID'] = null;

        // constant
        yield all([
          put.resolve({
            type: 'getConstant',
          }),
          put.resolve({
            type: 'user/fetchCurrent',
          }),
          put({
            type: 'message_center/fetchNotification',
          }),
        ]);

        const companies = yield select(state =>
          R.path(['user', 'currentUser', 'companies'])(state),
        );
        const user = yield select(state =>
          R.path(['user', 'currentUser'])(state),
        );

        const realname = R.path(['realname'])(user);
        const user_id = R.path(['id'])(user);
        const im_account = R.path(['im_info', 'im_id'])(user);
        const im_token = R.path(['im_info', 'token'])(user);
        const companyName = R.pathOr('void', [0, 'name'])(companies);
        const companyID = R.pathOr(0, [0, 'id'])(companies);

        // NIM
        initNIM({
          account: im_account,
          token: im_token,
        });

        // sensor input
        const input = {
          realname,
          companyName,
          companyID,
        };
        global.s().login(`${user_id}`);
        global.setProfile({
          ...input,
          client_type: '个人版',
        });

        // JPush
        JPush.setAlias(`user_${user_id}`, () => null);
        JPush.cleanTags(() => null);

        if (callback) {
          yield call(callback);
        }
      } catch (error) {
        console.log(error);
      }
    },
    *initInstitutionEnd({ callback }, { call, put, all, select }) {
      try {
        // http headers
        request.defaults.baseURL = Config.API_URL;
        const company = yield select(state =>
          R.path(['user', 'currentUser', 'companies', 0])(state),
        );
        const companyID = R.pathOr(0, ['id'])(company);
        request.defaults.headers.common['X-Company-ID'] = companyID;

        yield all([
          put.resolve({
            type: 'getConstant',
          }),
          put.resolve({
            type: 'getPermission',
          }),
          put.resolve({
            type: 'fund/fetch',
          }),
          put.resolve({
            type: 'roles',
          }),
          put.resolve({
            type: 'user/fetchCurrent',
          }),
        ]);

        const user = yield select(state =>
          R.path(['user', 'currentUser'])(state),
        );

        // sensor input
        const realname = R.path(['realname'])(user);
        const user_id = R.path(['id'])(user);
        const companyName = R.pathOr('void', ['name'])(company);
        const input = {
          realname,
          companyName,
          companyID,
        };
        global.s().login(`${user_id}`);
        global.setProfile({
          ...input,
          client_type: '企业版',
        });

        // JPush
        JPush.setAlias(`user_${user_id}`, () => null);
        JPush.setTags([`company_${companyID}`], () => null);

        if (callback) {
          yield call(callback);
        }
      } catch (error) {
        console.log(error);
      }
    },
    *roles({ callback }, { call, put }) {
      try {
        const res = yield call(getAllRoles);
        yield put({
          type: 'getRoles',
          payload: res.data,
        });
        if (callback) {
          callback();
        }
      } catch (error) {
        console.log(error);
      }
    },
  },

  reducers: {
    getConstants(state, { payload }) {
      return {
        ...state,
        constants: payload,
      };
    },
    getPermissions(state, { payload }) {
      return {
        ...state,
        permissions: payload,
      };
    },
    getFinanceStage(state, { payload }) {
      return {
        ...state,
        financeStage: payload,
      };
    },
    getProjectTags(state, { payload }) {
      return {
        ...state,
        projectTags: payload,
      };
    },
    getRoles(state, { payload }) {
      return {
        ...state,
        constants: {
          ...state.constants,
          roles: payload,
        },
      };
    },
  },
};
