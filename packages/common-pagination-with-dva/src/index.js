let prevPath = null
const defaults = {
  pageSize: 10,
  pageNumber: 1,
  total: 0,
}
const defaultState = {
  list: [],
  pagination: { ...defaults },
}
export const getCommonPagination = (namespace = 'CommonPagination') => {
  const model = {
    namespace,
    state: {
      list: [],
      pagination: {
        ...defaults,
      },
    },
    effects: {
      *fetchList({ payload = {}, fetchListApi }, { call, put, select }) {
        const api = fetchListApi || payload.fetchListApi
        if (!api)
          throw new Error(`[Common Pagination]: missing api to fetch list`)

        Reflect.deleteProperty(payload, 'fetchListApi')
        const pagination = yield select(state => {
          return state[namespace].pagination
        })
        const data = yield call(api, {
          pageSize: pagination.pageSize,
          pageNumber: pagination.pageNumber,
          ...payload,
        })

        if (!data) return

        const { items: list, pageSize, pageNumber, total } = data
        yield put({
          type: 'setState',
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
      setPagination(state, { payload, key }) {
        return model.reducers.setState(state, {
          payload: {
            pagination: { ...state.pagination, ...payload },
          },
          key,
        })
      },
      setState(state, { payload = defaultState, reset }) {
        if (reset) return { ...payload }
        return { ...state, ...payload }
      },
    },
    subscriptions: {
      listenRouterChange({ history, dispatch }) {
        history.listen(() => {
          const { pathname } = history.location
          if (prevPath == null || prevPath != pathname) {
            prevPath = pathname
            dispatch({
              type: 'setState',
              reset: true,
            })
          }
        })
      },
    },
  }
  return model
}

export default getCommonPagination()
