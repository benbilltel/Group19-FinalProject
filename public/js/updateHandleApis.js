let products = []
fetch("/products")
    .then(response => {
        const productsDTO = response.headers.get("ProductsDTO");
        return productsDTO ? JSON.parse(productsDTO) : [];
    })
    .then(data => {
        products = data
        renderProductList()
    })
    .catch(error => {
        console.error("Error:", error);
    });
const renderProductList = () => {
    const table = document.querySelector(".table-product-codes")
    let htmlTbody = ``
    products.forEach(p => {
        htmlTbody += `<tr data-code ="${p["productCode"]}" data-product='${JSON.stringify(p)}'>
        <td>${p["productCode"]}</td>
        <td><button type="button" onclick="addToUpdate('${String(p["productCode"])}')"><i class="fa-solid fa-check"></i></button></td>
    </tr>`
    })
    table.querySelector("tbody").innerHTML = htmlTbody
}
const addToUpdate = (code) => {

    const table = document.querySelector(".table-product-codes");
    const trs = table.querySelectorAll("tbody tr")
    trs.forEach(tr => {
        if (tr.dataset.code == code) {
            const productDetail = document.querySelector(".product-info")
            const btn = tr.querySelector("button")
            if (btn.classList.contains("active")) {
                btn.classList.remove("active")
                const productItems = productDetail.querySelectorAll(
                    `[data-code="${code}"]`
                );
                productItems.forEach((item) => {
                    item.remove();
                });
            } else {
                btn.classList.add("active")
                let detail = JSON.parse(tr.dataset.product)
                productDetail.innerHTML = `<div class="product-info-item" data-code ="${detail["productCode"]}" data-detail='${JSON.stringify(detail)}'>
                <div class="info-item-left">
                    <h1>${detail["productCode"]}</h1>
                    <div class="mb-3">
                        <label for="productName" class="form-label">Product Name</label>
                        <input type="text" class="form-control" id="productName" name="productName" value="${detail["productName"]}" required>
                    </div>
                    <div class="mb-3">
                        <label for="quantity" class="form-label">Quantity</label>
                        <input type="number" class="form-control" id="quantity" value="${Number(detail["quantity"])}" name="quantity" required>
                    </div>
                    <div class="mb-3">
                        <label for="price" class="form-label">Price</label>
                        <input type="number" class="form-control" id="price" value="${Number(detail["price"])}" name="price" required>
                    </div>
                    <div class="mb-3 input-file"></div>
                    <button type="button" class="btn btn-primary">Upload</button>
                </div>
                <div class="info-item-right">
                    <img src="\\${detail["image"]}" alt="Image">
                    <i class="fa-solid fa-circle-xmark" onclick="closeImg('${detail["productCode"]}')"></i>
                </div>
                
                </div>`+ productDetail.innerHTML
            }
        }
    })
}
const closeImg = (code) => {
    const detail = document.querySelectorAll(".product-info-item")
    detail.forEach(d => {
        if (d.dataset.code == code) {
            const image = d.querySelector(".info-item-right")
            image.remove()
            const file = d.querySelector(".input-file")
            file.innerHTML = `<label for="image" class="form-label">Image</label>
            <input type="file" class="form-control" accept=".jpg" name="image" id="image" required>`
            d.querySelector(".info-item-left").style.width = "100%"
        }
    })
}
let s = `

</div>`