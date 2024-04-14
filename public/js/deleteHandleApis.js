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
const renderProductList = () => {
    const table = document.querySelector(".table-product-codes")
    let htmlTbody = ``
    products.forEach(p => {
        htmlTbody += `<tr data-code ="${p["productCode"]}" data-product='${JSON.stringify(p)}'>
        <td>${p["productCode"]}</td>
        <td><button type="button" onclick="deleteOne('${String(p["productCode"])}')"><i class="fa-solid fa-x"></i></button></td>
    </tr>`
    })
    table.querySelector("tbody").innerHTML = htmlTbody
}
const deleteOne = (productCode)=>{
    if(productCode){
        fetch("/products/deleteOne/"+productCode,{
            method:"DELETE"
        }).then(res=>res.json()).then(data=>{
            if(data.message ==  "Delete one successful"){
                showToast(data.message,"success",()=>{
                    fetchListID();
                })
                
            }else{
                showToast(data.message)
            }
        })
    }
}
const deleteByCategory = ()=>{
    const category = document.querySelector(".product-list-bot #category").value
    if(category){
        fetch("/products/deleteMany/"+category,{
            method:"DELETE"
        }).then(res=>res.json()).then(data=>{
            if(data.message ==  "Delete products successful"){
                showToast(data.message,"success",()=>{
                    fetchListID();
                })
            }else{
                showToast(data.message)
            }
        })
    }
}