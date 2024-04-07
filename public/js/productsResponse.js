let products = []
fetch(window.location.href)
    .then(response => {
        const productsDTO = response.headers.get("ProductsDTO");
        return productsDTO ? JSON.parse(productsDTO) : [];
    })
    .then(data => {
        products = data
        renderProducts()
    })
    .catch(error => {
        console.error("Error:", error);
    });

const renderProducts = () => {
    if (products) {
        console.log(products)
        const table = document.querySelector(".products .products-table")
        const tbody = table.querySelector("tbody")
        let htmlTbody = ``
        products.forEach(p => {
            htmlTbody += `<tr>
            <th scope="row">${p.id}</th>
            <td>${p.productName}</td>
            <td>${p.category}</td>
            <td>${p.quantity}</td>
            <td>${p.price} $</td>
            <td><img style="width: 100px;height: 100px" src="\\${p.image}" /></td>
          </tr>`
        })
        tbody.innerHTML = htmlTbody
    }
}
const searchProducts = () => {
    const filterBlock = document.querySelector(".search-products")
    const searchText = String(filterBlock.querySelector(".text-search").value) || null
    const min = Number(filterBlock.querySelector(".text-search").value) || 0
    const max = Number(filterBlock.querySelector(".text-search").value) || 0
    const isSearch = 1

    fetch(`/products?searchText=${searchText}&min=${min}&max=${max}&isSearch=${isSearch}`)
  .then(res => res.json())
  .then(data => {
    
    if(data.message == "Search successfull"){
        
        products = JSON.parse(data.ProductsDTO)
        renderProducts()
    }
  })
  .catch(e => {
    console.log(e);
  });
}
