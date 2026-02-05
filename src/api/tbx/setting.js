import request from '@/utils/request';

// 查询配置项列表
export function listsetting(query) {
  return request({
    url: '/tbx/setting/list',
    method: 'get',
    params: query,
  });
}

// 按 key 查询配置项
export function getsetting(key) {
  return request({
    url: '/tbx/setting/' + key,
    method: 'get',
  });
}

// 修改配置项
export function updatesetting(data) {
  return request({
    url: '/tbx/setting',
    method: 'put',
    data: data,
  });
}

