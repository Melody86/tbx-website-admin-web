import request from '@/utils/request';

// 查询导航菜单列表
export function listnavigation(query) {
  return request({
    url: '/tbx/navigation/list',
    method: 'get',
    params: query,
  });
}

// 查询导航菜单详细
export function getnavigation(id) {
  return request({
    url: '/tbx/navigation/' + id,
    method: 'get',
  });
}

// 新增导航菜单
export function addnavigation(data) {
  return request({
    url: '/tbx/navigation',
    method: 'post',
    data: data,
  });
}

// 修改导航菜单
export function updatenavigation(data) {
  return request({
    url: '/tbx/navigation',
    method: 'put',
    data: data,
  });
}

// 删除导航菜单
export function delnavigation(id) {
  return request({
    url: '/tbx/navigation/' + id,
    method: 'delete',
  });
}

