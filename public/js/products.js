const { getProducts , searchProducts} = require("./db");
const convertProductsToDTO = (products) => {
    return products.map(p => ({
        id: p._id,
        productName: p.productName,
        category: p.category,
        quantity: p.quantity,
        price: p.price,
        image: p.image
    }));
}
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
module.exports = { getProductsDTO,searchProductsDTO };