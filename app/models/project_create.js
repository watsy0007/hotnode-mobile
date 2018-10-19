import R from 'ramda';
import * as Individual from 'services/individual/api';
import { paginate } from 'utils/pagination';
import { convertToFormData, convertToPayloadData } from 'utils/utils';

const initialCurrent = {
  members: [{}],
  social_network: [{}],
  roadmap: [{}],
  purpose: [],
  tags: [],
};

export default {
  namespace: 'project_create',
  state: {
    route: [
      {
        name: 'CreateMyProjectBasicInfo',
        title: '基本信息',
      },
      {
        name: 'CreateMyProjectDescription',
        title: '项目介绍',
      },
      {
        name: 'CreateMyProjectTeam',
        title: '团队成员',
      },
      {
        name: 'CreateMyProjectSocial',
        title: '社群信息',
      },
      {
        name: 'CreateMyProjectRoadMap',
        title: '路线图',
      },
      {
        name: 'CreateMyProjectFunding',
        title: '募资信息',
      },
    ],
    list: null,
    query: null,
    current: null,
    owner: null,
  },
  effects: {
    *fetch({ payload }, { put, call }) {
      try {
        const { data } = yield call(Individual.myProjectList, payload);

        yield put({
          type: 'save',
          payload: data,
        });
      } catch (error) {
        console.log(error);
      }
    },
    *search({ payload }, { put, call }) {
      try {
        const { data } = yield call(Individual.searchProject, payload);

        yield put({
          type: 'query',
          payload: data,
        });
      } catch (error) {
        console.log(error);
      }
    },
    *claimProject({ id, payload, callback }, { put, call }) {
      try {
        const { status } = yield call(Individual.claimMyProject, {
          id,
          payload,
        });

        yield put({
          type: 'refresh',
        });

        if (callback) {
          yield callback(status === 200);
        }
      } catch (error) {
        console.log(error);
      }
    },
    *submitProject({ callback }, { select, put }) {
      try {
        const owner = yield select(state =>
          R.path(['project_create', 'owner'])(state),
        );
        const current = yield select(state =>
          R.path(['project_create', 'current'])(state),
        );

        const sanitized_data = convertToPayloadData({
          ...current,
          owner: [owner],
        });

        if (current.id) {
          yield put.resolve({
            type: 'editProject',
            id: current.id,
            payload: sanitized_data,
            callback,
          });
        } else {
          yield put.resolve({
            type: 'createProject',
            payload: sanitized_data,
            callback,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    *createProject({ payload, callback }, { put, call }) {
      try {
        const { status } = yield call(Individual.createMyProject, payload);

        yield put({
          type: 'refresh',
        });

        if (callback) {
          yield callback(status === 200);
        }
      } catch (error) {
        console.log(error);
      }
    },
    *editProject({ id, payload, callback }, { put, call }) {
      try {
        const { status } = yield call(Individual.editMyProject, {
          id,
          payload,
        });

        yield put({
          type: 'refresh',
        });

        if (callback) {
          yield callback(status === 200);
        }
      } catch (error) {
        console.log(error);
      }
    },
    *refresh(_, { put, all }) {
      try {
        yield all([
          // refresh list
          put({
            type: 'fetch',
            payload: {
              page: 1,
              'per-page': 20,
            },
          }),
          // reset current
          put({
            type: 'clearCurrent',
          }),
          // clear query
          put({
            type: 'clearQuery',
          }),
        ]);
      } catch (error) {
        console.log(error);
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        list: paginate(state.list, payload),
      };
    },
    query(state, { payload }) {
      return {
        ...state,
        query: paginate(state.query, payload),
      };
    },
    clearQuery(state) {
      return {
        ...state,
        query: null,
      };
    },
    saveCurrent(state, { payload }) {
      return {
        ...state,
        current: {
          ...state.current,
          ...payload,
        },
      };
    },
    setCurrent(state, { payload }) {
      return {
        ...state,
        current: convertToFormData({ ...initialCurrent, ...payload }),
      };
    },
    resetCurrent(state) {
      return {
        ...state,
        current: initialCurrent,
      };
    },
    clearCurrent(state) {
      return {
        ...state,
        current: null,
      };
    },
    saveOwner(state, { payload }) {
      return {
        ...state,
        owner: {
          ...state.owner,
          ...payload,
        },
      };
    },
  },
};
