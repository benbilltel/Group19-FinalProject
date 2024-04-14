let products = []
let items = 5
fetch(window.location.href + `/?page=${1}&items=${items}`)
  .then(response => {
    const products = response.headers.get("Products");
    const totalPages = Number(response.headers.get("TotalPages"))
    renderPagination(totalPages, 1, -1)
    return products ? JSON.parse(products) : [];
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
    const table = document.querySelector(".products .products-table")
    const tbody = table.querySelector("tbody")
    let htmlTbody = ``
    products.forEach(p => {
      htmlTbody += `<tr>
            <th scope="row">${p.productCode}</th>
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
  const min = Number(filterBlock.querySelector(".min-price").value) || 0
  const max = Number(filterBlock.querySelector(".max-price").value) || 0
  fetch(`/products/search?searchText=${searchText}&min=${min}&max=${max}&page=${1}&items=${items}`)
    .then(res => res.json())
    .then(data => {
      if (data.message == "Search successfull") {
        totalPages = Number(data.TotalPages)
        products = JSON.parse(data.Products)
        if (products.length <= 0) {
          showToast("Product not found")
        } else {
          renderPagination(totalPages, 1, 1)
          renderProducts()
        }
      }
    })
    .catch(e => {
      console.log(e);
    });
}
const resetProducts = () => {
  const searchInput = document.querySelectorAll(".search-products input")
  searchInput.forEach(input => {
    input.value = ""
  })
  renderProductByPage(1)
}
const renderPagination = (totalPages, pageCrr, isSearch,) => {
  if (totalPages <= 1) {
    return
  }
  const pagination = document.querySelector(".pagination")
  let htmlResponse = ``
  for (let i = 1; i <= totalPages; i++) {
    if (i == Number(pageCrr)) {
      htmlResponse += `<button class="active" type="button" onclick="renderProductByPage(${i},${isSearch})">${i}</button>`
    } else {
      htmlResponse += `<button type="button" onclick="renderProductByPage(${i},${isSearch})">${i}</button>`
    }

  }
  pagination.innerHTML = htmlResponse
}
const renderProductByPage = (page, isSearch) => {
  if (Number(isSearch) == -1) {
    fetch(window.location.href + `/?page=${page}&items=${items}`)
      .then(response => {
        const products = response.headers.get("Products");
        const totalPages = response.headers.get("TotalPages")
        renderPagination(totalPages, page, -1)
        return products ? JSON.parse(products) : [];
      })
      .then(data => {
        products = data
        renderProducts()
      })
      .catch(error => {
        console.error("Error:", error);
      });
  } else {
    const filterBlock = document.querySelector(".search-products")
    const searchText = String(filterBlock.querySelector(".text-search").value) || null
    const min = Number(filterBlock.querySelector(".min-price").value) || 0
    const max = Number(filterBlock.querySelector(".max-price").value) || 0
    fetch(`/products/search?searchText=${searchText}&min=${min}&max=${max}&page=${page}&items=${items}`)
      .then(res => res.json())
      .then(data => {
        if (data.message == "Search successfull") {
          totalPages = Number(data.TotalPages)
          products = JSON.parse(data.Products)
          if (products.length <= 0) {
            showToast("Product not found")
          } else {
            renderPagination(totalPages, page, 1)
            renderProducts()
          }

        }
      })
      .catch(e => {
        console.log(e);
      });
  }

}