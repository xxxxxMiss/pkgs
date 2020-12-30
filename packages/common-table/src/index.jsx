import { useEffect, useCallback } from 'react'
import { Table } from 'antd'
import { connect } from 'umi'

const CommonTable = ({
  columns = [],
  children = null,
  dispatch,
  fetchListApi,
  payload,
  pagination,
  list,
  pageSize,
  pageNumber,
  total,
  deps = [],
  ...props
}) => {
  const api = useCallback(() => fetchListApi, [payload])

  useEffect(() => {
    dispatch({
      type: 'CommonPagination/fetchList',
      payload,
      fetchListApi: api,
    })
  }, [pageSize, pageNumber, ...deps])

  return (
    <Table
      dataSource={list}
      columns={columns}
      {...props}
      pagination={{
        showTotal: () => `共 ${total} 条`,
        showSizeChanger: false,
        total: total,
        showQuickJumper: true,
        defaultPageSize: pageSize,
        defaultCurrent: 1,
        current: pageNumber,
        onChange: page => {
          dispatch({
            type: 'CommonPagination/setPagination',
            payload: {
              pageNumber: page,
            },
          })
        },
        ...pagination,
      }}
    >
      {children || null}
    </Table>
  )
}

export default connect(({ CommonPagination }) => {
  return { list: CommonPagination.list, ...CommonPagination.pagination }
})(CommonTable)
