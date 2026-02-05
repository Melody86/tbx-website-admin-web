import request from '@/utils/request';

// 查询首页核心数据列表
export function listhomeStat(query) {
  return request({
    url: '/tbx/home-stat/list',
    method: 'get',
    params: query,
  });
}

// 查询首页核心数据详细
export function gethomeStat(id) {
  return request({
    url: '/tbx/home-stat/' + id,
    method: 'get',
  });
}

// 新增首页核心数据
export function addhomeStat(data) {
  return request({
    url: '/tbx/home-stat',
    method: 'post',
    data: data,
  });
}

// 修改首页核心数据
export function updatehomeStat(data) {
  return request({
    url: '/tbx/home-stat',
    method: 'put',
    data: data,
  });
}

// 删除首页核心数据
export function delhomeStat(id) {
  return request({
    url: '/tbx/home-stat/' + id,
    method: 'delete',
  });
}

