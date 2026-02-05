import request from "@/utils/request";
// 查询新闻资讯-文章浏览记录列表
export function listlog(query) {
  return request({
    url: "/tbx/log/list",
    method: "get",
    params: query,
  });
}
// 查询新闻资讯-文章浏览记录详细
export function getlog(id) {
  return request({
    url: "/tbx/log/" + id,
    method: "get",
  });
}

// 新增新闻资讯-文章浏览记录
export function addlog(data) {
  return request({
    url: "/tbx/log",
    method: "post",
    data: data,
  });
}

// 修改新闻资讯-文章浏览记录
export function updatelog(data) {
  return request({
    url: "/tbx/log",
    method: "put",
    data: data,
  });
}

// 删除新闻资讯-文章浏览记录
export function dellog(id) {
  return request({
    url: "/tbx/log/" + id,
    method: "delete",
  });
}
