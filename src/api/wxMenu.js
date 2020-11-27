import req from "../utils/request";

export default {
  getList:(params)=>req.get('wxMenu',{params}),
  update:(data)=>req.post('wxMenu/createMenu',data),
  getAccessToken:()=>req.get('wxMenu/getToken')
}