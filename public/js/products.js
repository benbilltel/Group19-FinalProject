const { getProducts } = require("./db");
const generateCode = async (category) => {
    try {
        const products = await getProducts();
        let maxId = 0;

        const list = products.filter((item) => item.category === category);
        list.forEach((item) => {
            const itemId = parseInt(item.productCode.substring(category.length + 1));

            if (itemId > maxId) {
                maxId = itemId;
            }
        });

        const newCode = category + "-" + (maxId + 1).toString().padStart(4, "0");
        return newCode;
    } catch (error) {
        console.log("Error generating code:", error);
    }
};
const generateCodes = async (products) => {
    try {
        let productList = await getProducts()
        let productsCoded = []
        let index = 0;
        products.forEach(p => {
            const list = productList.filter((item) => item.category === p.category);
            index++
            let maxId = 0;
            if (list.length > 0) {
                list.forEach((item) => {
                    if (item["productCode"]) {
                        const productCode = item["productCode"].toString()
                        let itemId = parseInt(productCode.substring(item["category"].length + 1));

                        if (itemId > maxId) {
                            maxId = itemId;
                        }
                    }
                });
            }
            p["productCode"] = p.category + "-" + (maxId + 1).toString().padStart(4, "0");

            productList.push(p)
            productsCoded.push(p)
        })
        return productsCoded
    } catch (e) {

        console.log("Error generating codes:", error);
    }
}

module.exports = { generateCode,generateCodes};