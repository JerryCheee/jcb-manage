//微信菜单官方文档  https://developers.weixin.qq.com/doc/offiaccount/Custom_Menus/Creating_Custom-Defined_Menu.html
import React, { useEffect, useState } from 'react'
import bg from '../../../assest/imgs/iphonex.png'
import styled from 'styled-components'
import {  MinusCircleOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import api from '../../../api/wxMenu'
import { message, Popover, Form, Radio, Button, Slider, Input, Tooltip } from "antd";
import '../../../assest/css/overlayAntd.css'
import IconFont from '../../../components/iconFont'
const Wrapper = styled.div`
  display: flex;
  min-width:1200px;
  .rule{
    padding: 0 30px;
    width: 22%;
    height:600px;
    text-align: center;
    display:flex;
    flex-direction:column;
    justify-content:space-around;
  }
  .phone{
    font-size:${props => (props.size / 100 * 14 * 100 | 0) / 100}px;
    transition: .5s;
    background-image:url(${bg});
    width: 29.85em;
    height: 60.78em;
    background-size: contain;
    background-repeat: no-repeat;
    position:relative;
    
  }
`
const MainBox = styled.div`
      position:absolute;
      width: 26.78em;
      left: 1.35em;
      top: 12.6%;
      height: 84.9%;
      background:#eaebed;
      border-bottom-left-radius: 2.28em;
      border-bottom-right-radius: 2.28em;

      &>.title {
        text-align: center;
        font-size: 1.28em;
        color: #333;
        font-weight: 500;
        transform: translateY(-124%);
      }
      &>.help{
        position: absolute;
        top: 25%;
        left: 56%;;
        transform: translateX(-50%);
        width: 16em;
        line-height: 24px;
        &>div{
          text-indent:30px;
        }
      }
      &>.level-1{
        display:flex;
        background: #f5f5f5;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding-top: 0.71em;
        padding-bottom: 2em;
        border-radius: inherit;
        color: #4a4a4a;

        &>div:nth-child(1){
          width:3.57em;
          display: flex;
          align-items: center;
          justify-content: center;
          /* font-size 定义在span内，否则影响其他元素 em 计算 */
          &>span{
            font-size: 1.85em;
          }
        }

        &>div{
          height: 2.85em;
          line-height: 2.85em;
          text-align:center;
        }

        &>div+div{
          flex:1;
          box-shadow: -1px 0 #e4e4e4;
        }
        .sub{
          font-size: .57em;
          transform: translate(-40%,-20%);
        }
      }
`
const SbCol = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  margin-left:30px;
  flex-grow:1;
  max-width: 45%;
`

const Stack = styled.div`
  position: relative;
  margin-bottom: 10px;
  border-bottom: 1px solid #eaeaea;
  &>.dele-btn{
    position: absolute;
    top: 50%;
    left: 0;
    color: #ff4d4f;
    transform: translate(0%, -50%);
  }
  &>.ant-row.ant-form-item {
    margin-bottom: 10px;
  }
`
const StackItem = styled(Form.Item)`
  position: relative;
  .anticon{
    position: absolute;
    right:0;
    top:50%;
    transform:translate(150%,-50%);
    color:#d9d9d9;
    font-size: 18px;
  }
`

let seed = 1;
let accessToken = null;
const assignId = v => {
  seed++; v.id = seed;
  return v;
}
//后台接口返回数据并非官方格式，自己做转换
const tryFormat = btns => {
  btns.forEach(assignId)
  const index = btns.findIndex(v => v.type === null)
  if (index === -1) return btns;
  btns[index].type = "null"
  btns[index].sub_button = btns[index].sub_button.list.slice().reverse()
  return btns;
}
const getMenus = async (token, next) => {
  accessToken = token;
  let res = await api.getList({ token })
  if (res.code) return message.error(res.msg)
  let btns = res.data.selfmenu_info.button || []
  next(tryFormat(btns))
}

const getToken = async (next) => {
  const before = sessionStorage.getItem('wxMenuAccessToken')
  if (before) {
    const { token, addTime } = JSON.parse(before)
    const now = new Date() * 1;
    const twoHour = 60 * 60 * 2 * 1000;
    const passed = addTime + twoHour
    if (passed > now) {
      getMenus(token, next)
      return;
    }
  }
  let res = await api.getAccessToken()
  if (res.code) return message.error(res.msg || 'token获取失败')
  const token = res.data.access_token
  if (token === null) return message.error('token为空')
  const twoHourCahce = { addTime: new Date() * 1, token }
  sessionStorage.setItem('wxMenuAccessToken', JSON.stringify(twoHourCahce))
  getMenus(token, next)
}

//菜单类型 对应的字段
const keyMapper = new Map([
  ["miniprogram", ['appid', 'pagepath', 'url']],
  ["view", ['url']],
  ["null", ['sub_button']],//表单取值是“null”
  ["click", ['key']]
]);

const rules = {
  name: [{ required: true, message: '请输入菜单名称' }],
  appid: [{ required: true, message: '请输入小程序appid' }],
  url: [{ required: true, message: '请输入链接' }],
  pagepath: [{ required: true, message: '请输入小程序页面路径' }],
}
const buildMiniProgramFields =(field)=> (<>
  <Form.Item label="AppId" name={field ? [field.name, 'appid'] : 'appid'}  rules={rules.appid}>
    <Input />
  </Form.Item>
  <StackItem label="备用网页" >
    <Form.Item name={field ? [field.name, 'url'] : 'url'}  rules={rules.url} noStyle>
      <Input />
    </Form.Item>
    <Tooltip placement="top" title="不支持小程序的老版本客户端将打开本链接">
      <QuestionCircleOutlined />
    </Tooltip>
  </StackItem>
  <Form.Item label="页面路径" name={field ? [field.name, 'pagepath'] : 'pagepath'}  rules={rules.pagepath}>
    <Input />
  </Form.Item>
</>)

const buildViewFields = field => (
  <Form.Item label="链接" name={field ? [field.name, 'url'] : 'url'} rules={rules.url}>
    <Input />
  </Form.Item>
)

/**
* Form.List 内 Item 变化的时候
* 不知道具体哪个变化，所以用柯里化函数存储 自动生成的 field 对象
* 下次变化时 就知道是哪个item 变化
*/
const specifyKey = field => (args) => buildFieldByType(args, field);

const buildFieldByType = ({ getFieldValue, prefixName }, field) => {
  let type = ''
  if (prefixName) {
    let subName = prefixName[0]
    type = getFieldValue([subName, field.key, 'type'])
  } else {
    type = getFieldValue('type')
  }
  switch (type) {
    case 'miniprogram':
      return buildMiniProgramFields(field)
    case 'view':
      return buildViewFields(field)
    default:
      return null;
  }
}

const buildDynamicFields = remove => (field, index) => (
  <Stack key={field.key}>
    <Form.Item label="名称" name={[field.name, "name"]} rules={rules.name}>
      <Input />
    </Form.Item>
    <Form.Item
      noStyle
      shouldUpdate={(pre, cur) => pre.sub_button[field.key]?.type !== cur.sub_button[field.key]?.type}>
      {specifyKey(field)}
    </Form.Item>
    <Form.Item label="类型" name={[field.name, "type"]} initialValue="view" rules={rules.view}>
      <Radio.Group >
        <Radio.Button value="view"> 网页</Radio.Button>
        <Radio.Button value="miniprogram"> 小程序</Radio.Button>
        {/* <Radio.Button value="click"></Radio.Button> */}
      </Radio.Group>
    </Form.Item>
    <MinusCircleOutlined
      className="dele-btn"
      onClick={() => {
        remove(field.name);
      }}
    />
  </Stack>
)

const buildSubMenuFields = (fields, { add, remove }) => (
  <>
    {fields.length < 5 ? <Form.Item wrapperCol={{ offset: 4 }} >
      <Button
        type="dashed"
        onClick={() => { add() }}
        style={{ width: '100%' }}
      >
        <PlusOutlined />添加二级菜单
        </Button>
    </Form.Item> : null}
    {fields.reverse().map(buildDynamicFields(remove))}
  </>
)

const buildField4Sub = ({ getFieldValue }) => {
  return getFieldValue('type') === "null"
    ? (<Form.List name="sub_button">
      {buildSubMenuFields}
    </Form.List>)
    : null
}

export default function WxMenu() {

  const [menus, setMenus] = useState([])
  const [phoneSize, setPhoneSize] = useState(70)
  const [form] = Form.useForm()
  const [curId, setCurId] = useState(-1)

  useEffect(() => {
    // setMenus(tryFormat(fake.selfmenu_info.button))
    getToken(setMenus)
  }, [])

  const showForm = menu => () => {
    const { type, name } = menu
    const keys = keyMapper.get(type)
    // eslint-disable-next-line
    const values = keys.reduce((pre, cur) => (pre[cur] = menu[cur], pre), { name, type })
    //缓存当前修改
    form.setFieldsValue(values)
    setCurId(menu.id)
  }

  const onSubmit = async () => {
    let hasErr = false
    await form.validateFields().catch(e => hasErr = true)
    if (hasErr) return;
    if (curId > -1) {
      let cur = form.getFieldsValue()
      let i = menus.findIndex(v => v.id === curId)
      menus[i] = cur;
    }
    //id 是自己加的，提交前去掉
    // eslint-disable-next-line
    const button = menus.slice().map(v => (v.id = undefined, v))
    const params = { fullJson: JSON.stringify({ menu: { button } }), accessToken }
    let res = await api.update(params)
    let fn = res.code ? 'error' : 'success'
    message[fn](res.msg)
  }

  const addOne = () => {
    if (menus.some(v => v.name === '正在编辑')) return;
    seed++
    const newOne = {
      name: '正在编辑',
      url: '',
      type: 'view',
      id: seed
    }
    setMenus([...menus, newOne])
    setCurId(seed)
  }
  const saveChange = async () => {
    let hasErr = false
    await form.validateFields().catch(e => hasErr = true)
    if (hasErr) return;
    const i = menus.findIndex(v => v.id === curId)
    menus[i] = form.getFieldsValue()
    // return console.log(menus)
    setMenus([...menus])
    form.resetFields()
  }
  const remove = () => {
    if (curId <= -1) return;
    const i = menus.findIndex(v => v.id === curId)
    menus.splice(i, 1)
    form.resetFields()
    setMenus([...menus])
  }
  //这里用index作为key 当有删除操作后 记得重新渲染
  const buildMeusItems = (menu, i) => {
    if (menu.type !== "null") return <div key={i} onClick={showForm(menu)}>{menu.name}</div>
    const content = menu.sub_button.map((v, i) => <div key={i}>{v.name}</div>)
    return (
      <Popover content={content} trigger="hover" key={i} overlayClassName="cus-popover">
        <div onClick={showForm(menu)}><IconFont type="icon-caidan" className="sub" />{menu.name}</div>
      </Popover>
    )
  }
  const tryBuildAddButton = () => {
    if (menus.length >= 3) return null;
    return new Array(3 - menus.length)
      .fill(0)
      .map((v, i) => <div onClick={addOne} key={i}><PlusOutlined /></div>)
  }

  return (<Wrapper size={phoneSize}>

    <div className="rule">
      <div>
        <p>微信规则</p>
        <p>一级菜单最多3个。<br />二级菜单最多5个。</p>
        <p>一级菜单最多4个汉字，<br />
        二级菜单最多7个汉字，<br />
        多出来的部分将会以“...”代替。</p>
      </div>
      <div>
        <div>模型尺寸比例</div>
        <Slider defaultValue={phoneSize} min={70} step={5} marks={{ 70: '70%', 85: '85%', 100: '100%' }} onChange={setPhoneSize} />
      </div>
    </div>
    <div className="phone">
      <MainBox >
        <div className="title">金财宝</div>
        <div className="help">
          <div>操作说明</div>
          <p>
            1 点击一个菜单按钮<br />
          2 在右侧编辑<br />
          3 保存或删除当前按钮(本地)<br />
          4 确认提交(线上)<br />
          </p>
        </div>
        <div className="level-1">
          <div><IconFont type="icon-jianpan" /></div>
          {menus.map(buildMeusItems)}
          {tryBuildAddButton()}
        </div>
      </MainBox>
    </div>
    <SbCol>
      <div></div>
      <Form
        form={form}
        name="wxmenu"
        labelCol={{ span: 4 }}>
        <Form.Item
          noStyle
          shouldUpdate={(pre, cur) => pre.type !== cur.type}>
          {buildField4Sub}

        </Form.Item>
        <Form.Item label="名称" name="name" rules={rules.name}>
          <Input />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(pre, cur) => pre.type !== cur.type}
        >
          {buildFieldByType}
        </Form.Item>
        <Form.Item label="类型" name="type" initialValue="view" rules={rules.type}>
          <Radio.Group >
            <Radio.Button value="view"> 网页</Radio.Button>
            <Radio.Button value="miniprogram"> 小程序</Radio.Button>
            <Radio.Button value="null"> 二级菜单</Radio.Button>
            {/* <Radio.Button value="click"></Radio.Button> */}
          </Radio.Group>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 16 }} style={{ display: 'flex' }}>
          <Form.Item noStyle>
            <Button style={{ width: '35%' }} onClick={saveChange}>保存修改</Button>
          </Form.Item>
          <Form.Item noStyle>
            <Button type="danger" htmlType="reset"
              style={{ width: '35%', marginLeft: '15%' }} onClick={remove}>
              删除当前
           </Button>
          </Form.Item>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 6 }}>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }} onClick={onSubmit}>
            确认提交
        </Button>
        </Form.Item>
      </Form>
    </SbCol>
  </Wrapper>)
}
