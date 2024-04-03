export const demoApi = {
  list: async (params) => {
    console.log('🚀 ~ list: ~ params:', params)
    return {
      code: 0,
      msg: 'success',
      data: {
        total: 100,
        list: [
          {
            id: 1,
            name: '张三',
            age: 18,
            gender: '男',
            address: '江苏省苏州市工业园区新平街388号24幢2层01-03单元',
            img: 'https://img.yzcdn.cn/vant/cat.jpeg',
            channel: 2,
            is_hot: 1,
            sort: 12,
            status: 1,
            progress: 50,
            birthday: '2021-08-01',
            created_at: '2021-08-01 12:00:00',
            updated_at: '2021-08-01 12:00:00',
          },
        ],
      },
    }
  },
}
