var previous = '/'
const isModifyPage = url => /\/modify$/.test(url)

export default function (location, menus, links) {

  const { pathname } = location;
  let first = links[0], result = [first];

  if (previous === pathname) return result
  if (pathname === '/') {
    previous = first.url
    return result;
  }

  const before = links.findIndex(v => v.url === pathname)
  if (before > -1) {
    if(before===0) return links
    return links.splice(0, before)
  }


  let link = menus.find(v => v.url === pathname)
  if (!link) return result

  const { state } = location
  let { id, url, name } = link;
  if (isModifyPage(link.url)) {
    if (!state || !state.editData) {
      name = name.replace('编辑', '添加')
    }
  }
  if (state) {
    const { withTitle } = state
    if (withTitle) {
      name = withTitle
    }
  }
  link = { id, url, name }

  const cur = link.url.split('/')[1]
  const last = previous.split('/')[1]
  if (last !== cur && links.length > 0) {
    let pure = links.filter(v => v.url.split('/')[1] !== last)
    result = [ ...pure, link]
  } else {
    result = [ ...links, link]
  }

  previous = link.url

  return result;
}
