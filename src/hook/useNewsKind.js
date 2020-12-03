import { useState, useEffect, useCallback } from "react";
import api from "../api/newsKind"

export default function useNewsKind() {
  const [options, setOptions] = useState([])
  const [kinds, setKinds] = useState([])

  const getKinds = useCallback(async () => {
    const res = await api.getAll()
    if (res.code) return console.error(res.msg);
    const conver2option = v => ({ value: v.cat_id, label: v.cat_name, children: v.children.map(conver2option) })
    setKinds(res.data)
    setOptions(res.data.map(conver2option))
  }, [])

  useEffect(() => { getKinds() }, [getKinds])

  return [options, kinds]
}
