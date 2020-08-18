# common-pagination-with-dva

> A common global model for pagination with dva

[![Build Status](https://img.shields.io/travis/chenxianlong/common-pagination-with-dva/master.svg)](https://travis-ci.org/chenxianlong/common-pagination-with-dva)
[![Codecov branch](https://img.shields.io/codecov/c/github/chenxianlong/common-pagination-with-dva/master.svg)](https://codecov.io/gh/chenxianlong/common-pagination-with-dva)
[![NPM](https://img.shields.io/npm/v/common-pagination-with-dva.svg)](https://www.npmjs.com/package/common-pagination-with-dva)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)

## Install

```bash
npm install --save common-pagination-with-dva
```

## Usage

```js
import PaginationModel, { setFetchListApi } from 'common-pagination-with-dva'

// /models/global.js

export default PaginationModel
```

## PaginationModel#state

```js
state: {
  namespace: 'CommonPagination',
  list: [],
  pagination: {
    pageSize: 10,
    pageNumber: 1,
    total: 0
  }
}
```

## PaginationModel#effects

```js
fetchList({ payload }, { call, put, select }) {

}
```

## PaginationModel#reducers

```js
setList(state, { payload }) {}
setPagination(state, { payload }) {}
```

## PaginationModel#subscriptions

```js
listenRouterChange({ history, dispatch }) {
  history.listen(() => {
    // 路由变化，重置分页state
    dispatch({
      type: 'CommonPagination/setList'
    })
  })
}
```

## setFetchListApi 或者作为`payload`的一个属性

> 考虑到每个页面请求列表的 api 肯定是不一样的，但是公用一个全局的分页 model，所以在每个页面需要自己手动通过这个函数来设置请求的 API

```js
// way 1
import { fetchListApi } from '@/path/xx/service'
setFetchListApi(fetchListApi)

// way 2
props.dispatch({
  type: 'CommonPagination/fetchList',
  payload: {
    fetchListApi,
  },
})
```

## 页面连接这个 model 里的数据

```js
import React, { useEffect } from 'react'
import { connect } from 'dva'

const ReactComponent = props => {
  useEffect(() => {
    props.dispath({
      type: 'CommonPagination/fetchList',
      payload: {}
    })
  }, [props.pageSize, props.pageNumber])

  return (
    <>
    {/** ... **/}
    </>
  )
}

export default connect(({ CommonPagination }) => {
  return {
    // 从CommonPagination中拿到需要注入到页面props上的数据
    ...
  }
})(ReactComponent)
```

## License

MIT © [chenxianlong](https://github.com/chenxianlong)
