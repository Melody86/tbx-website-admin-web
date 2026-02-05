import request from '@/utils/request';

// 查询首页热门产品列表
export function listhomeHotProduct(query) {
  return request({
    url: '/tbx/home-hot-product/list',
    method: 'get',
    params: query,
  });
}

// 查询首页热门产品详细
export function gethomeHotProduct(id) {
  return request({
    url: '/tbx/home-hot-product/' + id,
    method: 'get',
  });
}

// 新增首页热门产品
export function addhomeHotProduct(data) {
  return request({
    url: '/tbx/home-hot-product',
    method: 'post',
    data: data,
  });
}

// 修改首页热门产品
export function updatehomeHotProduct(data) {
  return request({
    url: '/tbx/home-hot-product',
    method: 'put',
    data: data,
  });
}

// 删除首页热门产品
export function delhomeHotProduct(id) {
  return request({
    url: '/tbx/home-hot-product/' + id,
    method: 'delete',
  });
}

