import request from '@/utils/request';

// 查询首页轮播图列表
export function listhomeBanner(query) {
  return request({
    url: '/tbx/home-banner/list',
    method: 'get',
    params: query,
  });
}

// 查询首页轮播图详细
export function gethomeBanner(id) {
  return request({
    url: '/tbx/home-banner/' + id,
    method: 'get',
  });
}

// 新增首页轮播图
export function addhomeBanner(data) {
  return request({
    url: '/tbx/home-banner',
    method: 'post',
    data: data,
  });
}

// 修改首页轮播图
export function updatehomeBanner(data) {
  return request({
    url: '/tbx/home-banner',
    method: 'put',
    data: data,
  });
}

// 删除首页轮播图
export function delhomeBanner(id) {
  return request({
    url: '/tbx/home-banner/' + id,
    method: 'delete',
  });
}

