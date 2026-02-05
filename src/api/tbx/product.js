import request from "@/utils/request";
// 查询产品信息列表
export function listproduct(query) {
  return request({
    url: "/tbx/product/list",
    method: "get",
    params: query,
  });
}
// 查询产品信息详细
export function getproduct(id) {
  return request({
    url: "/tbx/product/" + id,
    method: "get",
  });
}

// 新增产品信息
export function addproduct(data) {
  return request({
    url: "/tbx/product",
    method: "post",
    data: data,
  });
}

// 修改产品信息
export function updateproduct(data) {
  return request({
    url: "/tbx/product",
    method: "put",
    data: data,
  });
}

// 删除产品信息
export function delproduct(id) {
  return request({
    url: "/tbx/product/" + id,
    method: "delete",
  });
}
