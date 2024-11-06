import { random } from '@pkg/utils'

const list = Array.from({ length: 100 }, (v, k) => {
  const age = random(16, 66)
  const birthday = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * age).toISOString().split('T')[0]
  return {
    id: k + 1,
    name: Math.random().toString(36).substring(2),
    age,
    gender: random(1, 2) === 1 ? '男' : '女',
    address: '江苏省苏州市工业园区新平街388号24幢2层01',
    img: 'https://img.yzcdn.cn/vant/cat.jpeg',
    channel: random(1, 3),
    is_hot: random(0, 1),
    sort: random(1, 100),
    status: random(1, 3),
    progress: random(1, 100),
    birthday,
    created_at: new Date().toISOString().split('T')[0],
    updated_at: new Date().toISOString().split('T')[0],
  }
})

const createList = (params) => {
  const { page, pageSize } = params
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return list.slice(start, end)
}

export const demoApi = {
  list: async (params) => {
    console.log('🚀 ~ list: ~ params:', params)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 0,
          msg: 'success',
          data: {
            total: 100,
            list: createList(params),
          },
        })
      }, 500)
    })
    // return {
    //   code: 0,
    //   msg: 'success',
    //   data: {
    //     total: 100,
    //     list,
    //   },
    // }
  },
}
