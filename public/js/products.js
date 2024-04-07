const { getProducts, searchProducts } = require("./db");
const convertProductsToDTO = (products) => {
    return products.map(p => ({
        productCode: p.productCode,
        productName: p.productName,
        category: p.category,
        quantity: p.quantity,
        price: p.price,
        image: p.image
    }));
}
const generateID = (category) => {
    const list = products.filter((item) => item.category === category);
    let maxId = 0;
    list.forEach((item) => {
        const itemId = parseInt(item.id.substring(category.length));
        if (itemId > maxId) {
            maxId = itemId;
        }
    });
    const newId = category + (maxId + 1).toString().padStart(4, "0");
    return newId;
};
const getProductsDTO = async () => {
    try {
        return getProducts()
            .then(products => {
                const productsDTO = convertProductsToDTO(products)
                if (productsDTO.length === 0) {
                    throw new Error("ProductsDTO is empty");
                }
                return productsDTO;
            })
            .catch(e => {
                console.log("Get productsDTO error: ", e);
                throw e;
            });
    } catch (e) {
        console.log("Get productsDTO error: ", e);
        throw e;
    }
};
const searchProductsDTO = async (query) => {
    try {
        return searchProducts(query)
            .then(products => {
                const productsDTO = convertProductsToDTO(products)
                return productsDTO;
            })
            .catch(e => {
                console.log("Search productsDTO error: ", e);
                throw e;
            });
    } catch (e) {
        console.log("Search productsDTO error: ", e);
        throw e;
    }
};
module.exports = { getProductsDTO, searchProductsDTO };