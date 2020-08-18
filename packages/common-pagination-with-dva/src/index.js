let fetchListApi = null
const defaults = {
  pageSize: 10,
  pageNumber: 1,
  total: 0,
}
export function setFetchListApi(api) {
  fetchListApi = api
}

const model = {
  namespace: 'CommonPagination',
  state: {
    list: [],
    pagination: {
      ...defaults,
    },
  },
  effects: {
    *fetchList({ payload }, { call, put, select }) {
      let api = null
      if (payload.fetchListApi) {
        api = payload.fetchListApi
        Reflect.deleteProperty(payload, 'fetchListApi')
      } else {
        api = fetchListApi
      }

      if (!api)
        throw new Error(`[Common Pagination]: missing api to fetch list`)

      const pagination = yield select(state => {
        return state[model.namespace].pagination
      })

      const data = yield call(api, {
        pageSize: pagination.pageSize,
        pageNumber: pagination.pageNumber,
        ...payload,
      })

      if (!data) return

      const list = data.items
      const pageSize = data.pageSize
      const pageNumber = data.pageNumber
      const total = data.total
      yield put({
        type: 'setList',
        payload: {
          list,
          pagination: {
            pageSize,
            pageNumber,
            total,
          },
        },
      })
    },
  },
  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    setPagination(state, { payload }) {
      const pagination = { ...state.pagination, ...payload }
      return {
        ...state,
        pagination,
      }
    },
  },
  subscriptions: {
    listenRouterChange({ history, dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(() => {
        dispatch({
          type: 'setList',
          payload: {
            list: [],
            pagination: { ...defaults },
          },
        })
      })
    },
  },
}

export default model
