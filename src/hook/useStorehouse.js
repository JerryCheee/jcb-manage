import { useState, useEffect } from "react"
import api from "../api/storehouse"

export default function useStorehouse() {
  const [datas, setDatas] = useState([])
  useEffect(() => {
    const getDatas = async () => {
      let res = await api.getOptions()
      if (res.code) return
      setDatas(res.data)
    }
    getDatas()
  }, [])
  return datas
}