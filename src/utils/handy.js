
/**纯请求参数 */
export const defoPage = { current: 1, pageSize: 10 }

/**页信息包括总数 可以直接放进 pagenation组件内*/
export const defoPageInfo = { current: 1, pageSize: 10, total: 0 }
/**
 * 去掉total,把current改成pageNo
 * @param {object} params
 * @returns {object}
*/
export function simplify(params) {
    let { current: pageNo, total, ...rest } = params
    return { ...rest, pageNo }
}



