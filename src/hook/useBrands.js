import { useState, useEffect } from "react"
import api from "../api/brand"
export default function useBrands() {
  const [brands, setBrands] = useState([])
  useEffect(() => {
    const getBrands = async () => {
      let res = await api.getAll()
      if (res.code) return
      setBrands(res.data)
    }
    getBrands()
  }, [])
  return brands
}