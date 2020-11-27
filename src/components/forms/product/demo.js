let specs = [
  [{
    "isUsed": true,
    "value": "694*365*776mm",
    "id": "1328557779872043010",
    "propertyId": "1328304909910216706"
  }],
  [
    {
      "isUsed": true,
      "value": "H后排250mm",
      "id": "1328557780039815169",
      "propertyId": "1328304910476447746"
    },
    {
      "isUsed": true,
      "value": "L400mm",
      "id": "1328557780769624066",
      "propertyId": "1328304910476447746"
    },

    {
      "isUsed": true,
      "value": "M305mm",
      "id": "1328557781335855106",
      "propertyId": "1328304910476447746"
    }
  ]
]

specs = [
  [
    {
      "isUsed": true,
      "value": "305mm",
      "id": "1328555795177721858",
      "propertyId": "1328304910476447746"
    },
    {
      "isUsed": true,
      "value": "400mm",
      "id": "1328555795915919362",
      "propertyId": "1328304910476447746"
    },
    {
      "isUsed": true,
      "value": "500mm",
      "id": "1328555795915919372",
      "propertyId": "1328304910476447746"
    }
  ],
  [
    {
      "isUsed": true,
      "value": "695*420*610mm",
      "id": "1328555795358076929",
      "propertyId": "1328304909910216706"
    },
    {
      "isUsed": true,
      "value": "100*600",
      "id": "1328555795358076930",
      "propertyId": "1328304909910216706"
    }
  ],
  [
    {
      "isUsed": true,
      "value": "HTZ1025M/L",
      "id": "1328555795496488961"
    }
  ]
]
let [first, ...rest] = specs;
rest.reduce((pre, cur, i) => {
  return pre.map(p => cur.map(c => i > 0 ? p.concat(c) : [p, c])).flat()

}, first)
// let lens = rest.map(v => v.length)
// let n = lens[0];
// let len = lens.length;
// let rows = first.map((v, lv) => {
//     let td1 = `<td key=${lv} rowspan=${n}>${v.value}</td>`
//     let others = rest.map((rs, j) => {
//         let n = lens[j]
//         return rs.map(v => `<td key=${lv} rowspan=${n}>${v.value}</td>`)
//     }).flat();
//     let sameRow = others.splice(0, len);
//     let oneRow = sameRow.reduce((pre, cur) => pre + cur, td1)
//     return [oneRow, ...others]
// })
// return rows.flat()








