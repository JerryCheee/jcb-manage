import { useState } from "react";

/** 首次加载 | 数据量大于 threshold 的时候才启用loading
 * @param {Boolean} initail -初始值
 * @param {Number} total -数据总条数
 * @param {number} [threshold] -阈值，默认300
 * @return {[Boolean,(state:Boolean)=>void]}
 */
export default function useLoading(initail, total = 0, threshold = 300) {
  const [loading, setLoading] = useState(initail)
  const setLoadingDepenTotal = (value) => {
    if (!value && loading) return setLoading(value)
    if (!total || total > threshold) setLoading(value)
  }
  return [loading, setLoadingDepenTotal]
}
