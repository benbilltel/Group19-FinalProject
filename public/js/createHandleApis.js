function uploadProducts() {
  const fileInput = document.getElementById('jsonFileInput');
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target.result;

      fetch('/products/createMany/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: content
      })
        .then(response => response.json()).then(data => {
          if (data.message == "Insert products successfull") {
            showToast(data.message,"success",()=>{
              window.location.href = "/products"
          })
          }else{
            showToast(data.message)
          }
        })
        .catch(error => {
          console.log('Error:', error);
        });
    };

    reader.readAsText(file);
  }else{
    showToast('File is null')
  }
}
let codeTemp = 0
const addProduct = () => {
  const form = document.querySelector("#new_product")
  var productName = form.querySelector("#productName").value;
  var category = form.querySelector("#category").value;
  var quantity = form.querySelector("#quantity").value;
  var price = form.querySelector("#price").value;
  var image = form.querySelector("#image").files[0];
  if(quantity<=0){
    showToast('Quantity is invalid!')
    return;
  }
  if(price<0){
    showToast('Price is invalid!')
    return;
  }
  if(!image){
    showToast('Image is not empty!')
    return;
  }
  if (productName && category && quantity && price && image) {
    codeTemp++;
    var formData = new FormData();
    formData.append("productName", productName);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("image", image);
    formData.append("codeTemp", codeTemp);
    form.querySelector("#productName").value = ""
    form.querySelector("#category").value = "Table"
    form.querySelector("#quantity").value = ""
    form.querySelector("#price").value = ""
    form.querySelector("#image").value = ""
    fetch("/products/addProductTemp", {
      method: "POST",
      body: formData,
    }).then(res => res.json()).then(data => {
      if (data.message == "Add temp product successfull") {
        const insertTyped = document.querySelector(".insert-typed")
        let detail = JSON.parse(data.Product)
        insertTyped.innerHTML = `<div class="insert-typed-item" data-code ="${detail["codeTemp"]}" data-detail='${JSON.stringify(detail)}'>
        <div>
            <div class="btn-remove" onclick="removeProductTemp(${detail["codeTemp"]})"><i class="fa-solid fa-x"></i></div>
            <div class="mb-3">
                <label for="productName" class="form-label">Product Name</label>
                <input type="text" class="form-control" id="productName" name="productName" value="${detail["productName"]}" disabled>
            </div>
            <div class="mb-3">
                <label for="category" class="form-label">Category</label>
                <input type="text" class="form-control" id="category" value="${detail["category"]}" name="quantity" disabled>
            </div>
            <div class="mb-3">
                <label for="quantity" class="form-label">Quantity</label>
                <input type="number" class="form-control" id="quantity" value="${Number(detail["quantity"])}" name="quantity" disabled>
            </div>
            <div class="mb-3">
                <label for="price" class="form-label">Price</label>
                <input type="number" class="form-control" id="price" value="${Number(detail["price"])}" name="price" disabled>
            </div>
        </div>
        <div class="info-item-right">
            <img src="\\${detail["image"]}" alt="Image">
        </div>
        
        </div>`+ insertTyped.innerHTML
      }
    })

  }
}
const createAll=()=>{
  fetch("/products/createManyTemp",{
    method:"POST"
  }).then(res=>res.json()).then(data=>{
    if(data.message == "Insert products successfull"){
      showToast(data.message,"success",()=>{
        window.location.href = "/products"
    })
      
    }else{
      showToast(data.message)
    }
  })
}
const removeProductTemp = (code) => {
  fetch("/products/removeProductTemp/" + code, {
    method: "POST"
  }).then(res => res.json()).then(data => { 
    if(data.message ==  "Remove temp product successfull"){
      let items = document.querySelectorAll(".insert-typed-item")
      items.forEach(item=>{
        if(Number(item.dataset.code)== Number(code) ){
          item.remove()
        } 
      })
    }
  })
}
document.getElementById("new_product").addEventListener("submit", (e) => {
  e.preventDefault()
  var productName = document.getElementById("productName").value;
  var category = document.getElementById("category").value;
  var quantity = document.getElementById("quantity").value;
  var price = document.getElementById("price").value;
  var image = document.getElementById("image").files[0];
  if(quantity<=0){
    showToast('Quantity is invalid!')
    return;
  }
  if(price<0){
    showToast('Price is invalid!')
    return;
  }
  if(!image){
    showToast('Image is not empty!')
    return;
  }
  if(productName && category && quantity && price && image){
  var formData = new FormData();
  formData.append("productName", productName);
  formData.append("category", category);
  formData.append("quantity", quantity);
  formData.append("price", price);
  formData.append("image", image);

  fetch("/products/createOne", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message == "Insert product successfull") {
        showToast(data.message,"success",()=>{
          window.location.href = "/products"
      })
      }else{
        showToast(data.message)
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
})
const btnInsetOne = document.querySelector(".btn-insert-one")
const btnInsetMany = document.querySelector(".btn-insert-many")
btnInsetOne.addEventListener("click", () => {
  const blockInsertOne = document.querySelector(".insert-product")
  const blockInsertMany = document.querySelector(".insert-products")
  blockInsertMany.style.display = "none"
  blockInsertOne.style.display = "block"
  btnInsetMany.classList.remove("active")
  btnInsetOne.classList.remove("active")
  btnInsetOne.classList.add("active")
})

btnInsetMany.addEventListener("click", () => {
  const blockInsertMany = document.querySelector(".insert-products")
  const blockInsertOne = document.querySelector(".insert-product")
  blockInsertMany.style.display = "block"
  blockInsertOne.style.display = "none"
  btnInsetOne.classList.remove("active")
  btnInsetMany.classList.remove("active")
  btnInsetMany.classList.add("active")
})
