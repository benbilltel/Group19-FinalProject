let products = []
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
                    <button type="button" class="btn btn-success" onclick="updateOne('${detail["productCode"]}')">Upload</button>
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
const updateOne = (code) => {
    const details = document.querySelectorAll(".product-info-item");
    details.forEach((d) => {
        if (d.dataset.code == code) {
            let productName = d.querySelector("#productName").value;
            let quantity = d.querySelector("#quantity").value;
            let price = d.querySelector("#price").value;
            let image = d.querySelector("#image")?.files[0] || false;
            let product = {
                productName,
                quantity,
                price,
            };

            const formData = new FormData();
            formData.append("image", image);
            formData.append("product", JSON.stringify(product));

            fetch(`/products/updateOne/${code}`, {
                method: "PUT",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    
                    if (data.message == "Update product successful") {
                        showToast(data.message,"success",()=>{
                            window.location.href = "/products/update"
                        })
                    }else{
                        showToast(data.message)
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    });
};

const updateSelected = async () => {
    const details = document.querySelectorAll(".product-info-item");

    if (details.length === 0) {
        return;
    }

    for (const d of details) {
        let productName = d.querySelector("#productName").value;
        let quantity = d.querySelector("#quantity").value;
        let price = d.querySelector("#price").value;
        let image = d.querySelector("#image")?.files[0] || false;
        let product = {
            productCode: d.dataset.code,
            productName,
            quantity,
            price,
        };
        const formdata = new FormData();
        formdata.append(`image`, image);
        formdata.append(`product`, JSON.stringify(product));

        try {
            const response = await fetch(`/products/loadDataToUpdate/${1}`, {
                method: "PUT",
                body: formdata,
            });
            const data = await response.json();
            if (!data.message === "Load successful") {
                console.log(data.message)
            }
        } catch (error) {
            console.error(error);
        }
    }

    try {
        const response = await fetch("/products/updateSelected", {
            method: "PUT",
        });
        const data = await response.json();
        if (data.message === "Update products successful") {
        }else{
            showToast(data.message)
        }
        const response2 = await fetch(`/products/loadDataToUpdate/${2}`, {
            method: "PUT",
        });
        const data2 = await response2.json();
        if (data2.message === "Clear successful") {
            showToast(data.message,"success",()=>{
                window.location.href = "/products/update"
            })
        }
        
    } catch (error) {
        console.error(error);
    }
};
const resetPrice = ()=>{
    const details = document.querySelectorAll(".product-info-item");
    if (details.length === 0) {
        return;
    }
    let codes = []
    for (const d of details) {
            codes.push(d.dataset.code)
    }
    if(codes.length>0){
        fetch("/products/resetPrice",{
            method:"PUT",
            body: JSON.stringify(codes),
            headers: {
                "Content-Type":"application/json"
            }
        }).then(res=>res.json()).then(data=>{
            if(data.message == "Reset price products successful"){
                showToast(data.message,"success",()=>{
                    window.location.href = "/products/update"
                })
                
            }else{
                showToast(data.message)
            }
        })
    }
}