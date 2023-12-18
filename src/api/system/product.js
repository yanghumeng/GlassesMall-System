import request from "@/utils/request";

// 查询产品列表
export function listProduct(query) {
  return request({
    url: "/system/product/list",
    method: "get",
    params: query,
  });
}

// 查询产品详细
export function getProduct(id) {
  return request({
    url: "/system/product/" + id,
    method: "get",
  });
}

// 新增产品
export function addProduct(data) {
  return request({
    url: "/system/product",
    method: "post",
    data: data,
  });
}

// 修改产品
export function updateProduct(data) {
  return request({
    url: "/system/product",
    method: "put",
    data: data,
  });
}

// 删除产品
export function delProduct(id) {
  return request({
    url: "/system/product/" + id,
    method: "delete",
  });
}

// 查询所有品牌
export function allBrand(query) {
  return request({
    url: "/system/brand/queryList",
    method: "get",
    params: query,
  });
}
// 查询所有系列
export function allSeries(query) {
  return request({
    url: "/system/series/queryList",
    method: "get",
    params: query,
  });
}
// 查询尺寸大小
export function allSizeList(query) {
  return request({
    url: "/system/dict/data/list",
    method: "get",
    params: query,
  });
}
