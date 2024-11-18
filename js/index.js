/**
 * 目标1：渲染图书列表
 *  1.1 获取数据
 *  1.2 渲染数据
 */
const creator = '我很专业'
const doms = {
  bookList: document.querySelector('.list'),
  addForm: document.querySelector('.add-form'),
  addSave: document.querySelector('.add-btn'),
  addModal: document.querySelector('.add-modal'),
  editForm: document.querySelector('.edit-form'),
  editSave: document.querySelector('.edit-btn'),
  editModal: document.querySelector('.edit-modal'),
}

function getBooksList () {
  axios({
    method: 'get',
    url: 'http://hmajax.itheima.net/api/books',
    params: {
      creator//同名简写
    }
  }).then(result => {
    // console.log(result)
    // console.log(result.data.data)

    doms.bookList.innerHTML = result.data.data.map((item, index) => {    //注意，形参：先item后index
      const { id, bookname, author, publisher } = item //解构
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${bookname}</td>
          <td>${author}</td>
          <td>${publisher}</td>
          <td  data-id=${id}>
            <span class="del">删除</span>
            <span class="edit">编辑</span>
          </td>
        </tr>
      `         //如果直接赋值给innerHTML的话，只会渲染最后一个tr
    }).join('')
  })
}

getBooksList()

// 添加图书
const addModalObj = new bootstrap.Modal(doms.addModal)
doms.addSave.addEventListener('click', () => {
  const infor = serialize(doms.addForm, {
    hash: true,
    empty: true
  })
  // console.log(infor)
  
  axios({
    url: 'http://hmajax.itheima.net/api/books',  //添加接口
    method: 'post',
    data: {
      ...infor, //展开运算符...
      creator
    }
  }).then(result => {
    console.log(result)
    getBooksList()
    doms.addForm.reset()
    addModalObj.hide()
  })

})

// 删除图书&编辑图书
const editModalObj = new bootstrap.Modal(doms.editModal)
doms.bookList.addEventListener('click', e => { //事件委托
  // console.log(e.target)
  // 删除图书
  if (e.target.classList.contains('del')) {
    // console.log(e.target.parentNode.dataset.id)//parentNode
    const delId = e.target.parentNode.dataset.id
    axios({
      url: `http://hmajax.itheima.net/api/books/${delId}`,
      method: 'delete'   //delete后面无属性
    }).then(result => {
      // console.log(result)
      getBooksList()
    })
  }
})

doms.bookList.addEventListener('click', e => {

  // 编辑图书:1点击弹框，2显现，3修改后获取表单并渲染函数，4修改隐藏弹框
  if (e.target.classList.contains('edit')) {
    const editId = e.target.parentNode.dataset.id
    // console.log(editId)
    axios({//回显
      url: `http://hmajax.itheima.net/api/books/${editId}`,
      method: 'get'//默认不写
    }).then(result => {
      // console.log(result)
      const bookObj = result.data.data
      const keys = Object.keys(bookObj) //[id,bookname,author,publisher]
      keys.forEach(item => {//同时把id也遍历给了隐藏表单域
        document.querySelector(`.edit-form .${item}`).value = bookObj[item]
      })        //2
      editModalObj.show() //1
    })
  }
})

//修改并保存
doms.editSave.addEventListener('click', () => {
  const { id, bookname, author, publisher } = serialize(doms.editForm, {
    hash: true,
    empty: true
  })
  axios({
    url: `http://hmajax.itheima.net/api/books/${id}`,
    method: 'put',//put
    data: {
      bookname,
      author,
      publisher,
      creator
    }
  }).then(result => {
    // console.log(result)
    getBooksList()     //3
    editModalObj.hide() //4
  })
})
