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
      .then(response => response.json()).then(data=>{
        if (data.message == "Insert products successfull") {
          alert(data.message)
          window.location.href = "/products"
        }
      })
      .catch(error => {
        console.log('Error:', error);
      });
    };

    reader.readAsText(file);
  }
}
document.getElementById("new_product").addEventListener("submit", (e) => {
  e.preventDefault()
  var productName = document.getElementById("productName").value;
  var category = document.getElementById("category").value;
  var quantity = document.getElementById("quantity").value;
  var price = document.getElementById("price").value;
  var image = document.getElementById("image").files[0];

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
      alert(data.message);
      if (data.message == "Insert product successfull") {
        alert(data.message)
        window.location.href = "/products"
      }
    })
    .catch((error) => {
      console.error(error);
    });
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
