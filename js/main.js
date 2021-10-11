class Order {
  jsonOrders = {
  portions: '',
  pastries: '',
  glaze: '',
  decoration: '',
  orderDate: ''
}

  constructor(formName, formFields) {
    this.formName = formName;
    this.jsonFields = formFields;
  }
  
  add = () => {
    let newProduct = this.getOrderDetails()
    let currentData = this.read() || [];
    let finalData = [...currentData, newProduct]
    localStorage.setItem(DB_NAME, JSON.stringify(finalData))

    this.refreshData()
  }
  
  read = () => JSON.parse(localStorage.getItem(DB_NAME))
  
  update = (productIndex, productEdited) => {
  productIndex = Number(productIndex.replace('btnConfirm', ''))

  productEdited = Object.keys(this.jsonProduct).map((item, i) => this.jsonProduct[item] = productEdited[i])

  console.log('this.jsonProduct', this.jsonProduct);

  let orderList = this.read();
  orderList[productIndex] = this.jsonProduct
  localStorage.setItem(DB_NAME, JSON.stringify(orderList))
  this.refreshData()
}


  delete = (productIndex) => {
    productIndex = Number(productIndex.replace('btnDelete', ''))
    let orderList = this.read();
    orderList.splice(productIndex, 1)

    localStorage.setItem(DB_NAME, JSON.stringify(orderList))
    this.refreshData()
}

  getOrderDetails () {
    return {
      portions: document[this.formName][this.jsonFields.portions].value,
      pastries: document[this.formName][this.jsonFields.pastries].value,
      glaze: document[this.formName][this.jsonFields.glaze].value,
      decoration: document[this.formName][this.jsonFields.decoration].value,
      orderDate: document[this.formName][this.jsonFields.orderDate].value
    }
  }

 
  refreshData = () => {
    let orderList = this.read();
    orderList = orderList.map((object, i) => `
        <tr>
            <td>${i+1}</td>
            <td>${object.portions}</td>
            <td>${object.pastries}</td>
            <td>${object.glaze}</td>
            <td>${object.decoration}</td>
            <td>${object.orderDate}</td>
            <td class="colActions">
            
            <button type="button" id="btnEdit${i}" name="btn-edit" class="btn btn-primary btn-sm"><i class="fa fa-edit text-ligth" aria-hidden="true"></i></button>
            <button type="button" id="btnDelete${i}" name="btn-delete" class="btn btn-danger btn-sm"><i class="fa fa-trash text-ligth" aria-hidden="true"></i></button>
            </td>
        </tr>`)

    document.getElementById('tableBody').innerHTML = orderList.join(' ')
  }

  
}

const DB_NAME = "orderList";
const formName = 'cakeOrders';
const formFields = {
  portions: "portions",
  pastries: "pastries",
  glaze: "glaze",
  decoration: "decoration",
  orderDate: "orderDate"
}

const newOrder = new Order(formName, formFields);
newOrder.refreshData();
console.log('newOrder.JsonProduct', newOrder.jsonProduct);

const processClick = (element) => {
  const listButtons = ['btn-delete','btn-edit']
  const min = 1
  if (element.target.name == listButtons[0])
  newOrder.delete(element.target.id)

  if (element.target.name == listButtons[1] || element.target.target.parentElement.name == listButtons[1]) {
    let parentElement = element.target.parentElement
      let tdColActions = (parentElement.name == listButtons[1]) ? parentElement.parentElement : parentElement
      hideButtons(tdColActions, listButtons, 'block')

      let productId = tdColActions.querySelector('button[name="btn-edit"]').id.replace('btnEdit', '')
      tdColActions.innerHTML += createEditButtons(productId)

      let children = (parentElement.name == listButtons[1]) ? parentElement.parentElement.parentElement.children : parentElement.parentElement.children // HTMLCollection[]
      let childrenArray = [...children]

      childrenArray // Array[]
          .filter((item, i) => i >= (min) && i <= (childrenArray.length - 2))
          .map((item) => item.innerHTML = `<input value="${item.textContent}">`)
  }

  if (element.target.name == 'btnConfirm') {
      let childrenArray = [...element.target.parentElement.parentElement.children]
      let productEdited = childrenArray
          .filter((item, i) => i >= (min) && i <= (childrenArray.length - 2))
          .map((item) => item.children[0].value)

      newOrder.update(element.target.id, productEdited)
      console.log('productEdited', productEdited);
  }
  if (['btnCancel'].includes(element.target.name)) {
      /* Le queda a usted la tarea */
  }

}
const toggleButtons = (parentElement, listBtns, display = 'none') => {
  listBtns.map((item) => parentElement.querySelector(`[name="${item}"]`).style.display = display || 'block')
}
const createEditButtons = (productId) => `
<button type="button" class="btn btn-primary" name="btnConfirm" id="btnConfirm${productId}">Confirmar</button>
<button type="button" class="btn btn-danger" name="btnCancel" id="btnCancel${productId}">Cancelar</button>`

document.formTable.addEventListener("click", processClick)
