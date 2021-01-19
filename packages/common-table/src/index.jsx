import { useEffect } from 'react'
import { Table } from 'antd'

const CommonTable = ({
  columns = [],
  children = null,
  dispatch,
  fetchListApi,
  payload,
  pagination,
  dataSource,
  pageSize,
  pageNumber,
  total,
  deps = [],
  ...props
}) => {
  useEffect(() => {
    dispatch({
      type: 'CommonPagination/fetchList',
      payload,
      fetchListApi,
    })
  }, [pageSize, pageNumber, ...deps])

  return (
    <Table
      dataSource={dataSource}
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

export default CommonTable
