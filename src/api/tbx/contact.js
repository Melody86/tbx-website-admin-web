import request from '@/utils/request'

// 查询留言列表
export function listContact(query) {
  return request({
    url: '/tbx/contact/list',
    method: 'get',
    params: query,
  })
}

// 查询留言详情
export function getContact(id) {
  return request({
    url: '/tbx/contact/' + id,
    method: 'get',
  })
}

// 删除留言
export function delContact(id) {
  return request({
    url: '/tbx/contact/' + id,
    method: 'delete',
  })
}
