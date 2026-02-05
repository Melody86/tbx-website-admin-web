import request from '@/utils/request';

// 查询店铺链接列表
export function liststoreLink(query) {
  return request({
    url: '/tbx/store-link/list',
    method: 'get',
    params: query,
  });
}

// 查询店铺链接详细
export function getstoreLink(id) {
  return request({
    url: '/tbx/store-link/' + id,
    method: 'get',
  });
}

// 新增店铺链接
export function addstoreLink(data) {
  return request({
    url: '/tbx/store-link',
    method: 'post',
    data: data,
  });
}

// 修改店铺链接
export function updatestoreLink(data) {
  return request({
    url: '/tbx/store-link',
    method: 'put',
    data: data,
  });
}

// 删除店铺链接
export function delstoreLink(id) {
  return request({
    url: '/tbx/store-link/' + id,
    method: 'delete',
  });
}

