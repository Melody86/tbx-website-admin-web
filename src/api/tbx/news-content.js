import request from "@/utils/request";
// 查询新闻资讯-文章列表
export function listcontent(query) {
  return request({
    url: "/tbx/content/list",
    method: "get",
    params: query,
  });
}
// 查询新闻资讯-文章详细
export function getcontent(id) {
  return request({
    url: "/tbx/content/" + id,
    method: "get",
  });
}

// 新增新闻资讯-文章
export function addcontent(data) {
  return request({
    url: "/tbx/content/create",
    method: "post",
    data: data,
  });
}

// 修改新闻资讯-文章
export function updatecontent(data) {
  return request({
    url: "/tbx/content",
    method: "put",
    data: data,
  });
}

// 删除新闻资讯-文章
export function delcontent(id) {
  return request({
    url: "/tbx/content/" + id,
    method: "delete",
  });
}
