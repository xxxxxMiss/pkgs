"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getCommonPagination = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let prevPath = null;
const defaults = {
  pageSize: 10,
  pageNumber: 1,
  total: 0
};
const defaultState = {
  list: [],
  pagination: _objectSpread({}, defaults)
};

const getCommonPagination = (namespace = 'CommonPagination') => {
  const model = {
    namespace,
    state: {
      list: [],
      pagination: _objectSpread({}, defaults)
    },
    effects: {
      *fetchList({
        payload = {},
        fetchListApi
      }, {
        call,
        put,
        select
      }) {
        const api = fetchListApi || payload.fetchListApi;
        if (!api) throw new Error(`[Common Pagination]: missing api to fetch list`);
        Reflect.deleteProperty(payload, 'fetchListApi');
        const pagination = yield select(state => {
          return state[namespace].pagination;
        });
        const data = yield call(api, _objectSpread({
          pageSize: pagination.pageSize,
          pageNumber: pagination.pageNumber
        }, payload));
        if (!data) return;
        const list = data.items,
              pageSize = data.pageSize,
              pageNumber = data.pageNumber,
              total = data.total;
        yield put({
          type: 'setState',
          payload: {
            list,
            pagination: {
              pageSize,
              pageNumber,
              total
            }
          }
        });
      }

    },
    reducers: {
      setPagination(state, {
        payload,
        key
      }) {
        return model.reducers.setState(state, {
          payload: {
            pagination: _objectSpread(_objectSpread({}, state.pagination), payload)
          },
          key
        });
      },

      setState(state, {
        payload = defaultState,
        reset
      }) {
        if (reset) return _objectSpread({}, payload);
        return _objectSpread(_objectSpread({}, state), payload);
      }

    },
    subscriptions: {
      listenRouterChange({
        history,
        dispatch
      }) {
        history.listen(() => {
          const pathname = history.location.pathname;

          if (prevPath == null || prevPath != pathname) {
            prevPath = pathname;
            dispatch({
              type: 'setState',
              reset: true
            });
          }
        });
      }

    }
  };
  return model;
};

exports.getCommonPagination = getCommonPagination;

var _default = getCommonPagination();

exports.default = _default;