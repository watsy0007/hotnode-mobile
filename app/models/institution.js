import { getIndustries, getReportsByIndustry } from '../services/api';
import { paginate } from '../utils/pagination';

export default {
  namespace: 'institution',
  state: {
    list: null,
    report: null,
  },
  effects: {
    *fetch(_, { call, put }) {
      try {
        const { data } = yield call(getIndustries);
        yield put({
          type: 'list',
          payload: data,
        });
      } catch (e) {
        console.log(e);
      }
    },
    *fetchReports({ payload }, { call, put }) {
      try {
        const { data } = yield call(getReportsByIndustry, payload);
        yield put({
          type: 'report',
          payload: data,
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
  reducers: {
    list(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    report(state, action) {
      return {
        ...state,
        report: paginate(state.report, action.payload),
      };
    },
    clearReport(state) {
      return {
        ...state,
        report: null,
      };
    },
  },
};
