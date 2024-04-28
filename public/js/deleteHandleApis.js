let products = []
const fetchListID = ()=>{
    fetch("/products/update/listID")
    .then(response => {
        const products = response.headers.get("Products");
        return products ? JSON.parse(products) : [];
    })
    .then(data => {
        products = data
        renderProductList()
    })
    .catch(error => {
        console.error("Error:", error);
    });
}
fetchListID();
const popup = document.querySelector(".popup-delete")
const searchProducts = () => {
    const filterBlock = document.querySelector(".search-products");
    const searchText =
      String(filterBlock.querySelector(".text-search").value) || null;
    fetch(`/products/update/search?searchText=${searchText}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message == "Search successfull") {
          products = JSON.parse(data.Products);
          if (products.length <= 0) {
            showToast("Product not found");
          }
          renderProductList();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const searchInput = document.querySelectorAll(".search-products input");
  const firstInput = searchInput[0];
  if (firstInput) {
    firstInput.focus();
  }
  const resetProducts = () => {
      searchInput.forEach((input) => {
        input.value = "";
      });
      if (firstInput) {
        firstInput.focus();
      }
      fetchListID()
    };
const renderProductList = () => {
    const table = document.querySelector(".table-product-codes")
    let htmlTbody = ``
    products.forEach(p => {
        htmlTbody += `<tr data-code ="${p["productCode"]}" data-product='${JSON.stringify(p)}'>
        <td>${p["productCode"]}</td>
        <td>${p["productName"]}</td>
        <td><button type="button" onclick="deleteOne('${String(p["productCode"])}')"><i class="fa-solid fa-x"></i></button></td>
    </tr>`
    })
    table.querySelector("tbody").innerHTML = htmlTbody
}
const deleteOne = (productCode)=>{
    if(productCode){
        const body = popup.querySelector(".body")
        const btnConfirm = popup.querySelector(".confirm")
        body.innerHTML = `Are you sure to delete ${productCode}?`
        popup.style.display = "block"
        
        btnConfirm.addEventListener("click",()=>{
            fetch("/products/delete/"+productCode,{
                method:"DELETE"
            }).then(res=>res.json()).then(data=>{
                if(data.message ==  "Delete one successful"){
                    popup.style.display = "none"
                    showToast(data.message,"success",()=>{
                        resetProducts()
                    })
                    
                }else{
                    showToast(data.message)
                }
            })
        })
       
    }
}
const deleteAll = ()=>{
    const body = popup.querySelector(".body")
    const btnConfirm = popup.querySelector(".confirm")
    body.innerHTML = `Are you sure to delete all?`
    popup.style.display = "block"
    
    btnConfirm.addEventListener("click",()=>{
        fetch("/products/deleteAll",{
            method:"DELETE"
        }).then(res=>res.json()).then(data=>{
            if(data.message ==  "Delete products successful"){
                popup.style.display = "none"
                showToast(data.message,"success",()=>{
                    resetProducts()
                })
                
            }else{
                showToast(data.message)
            }
        })
    })
}
const closePopupDelete = ()=>{
    popup.style.display = "none"
}