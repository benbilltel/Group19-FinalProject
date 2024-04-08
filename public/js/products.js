const { getProducts, searchProducts, insertProduct, insertProducts } = require("./db");
const convertProductsToDTO = (products) => {
    if (Array.isArray(products)) {
        return products.map(p => ({
            productCode: p.productCode,
            productName: p.productName,
            category: p.category,
            quantity: p.quantity,
            price: p.price,
            image: p.image
        }));
    } else {
        const { productCode, productName, category, quantity, price, image } = products;
        return {
            productCode,
            productName,
            category,
            quantity,
            price,
            image
        };
    }
};
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
        throw error;
    }
};
const getProductsDTO = async () => {
    try {
        return getProducts()
            .then(products => {
                const productsDTO = convertProductsToDTO(products)
               
                return productsDTO;
            })

    } catch (e) {
        console.log("Get productsDTO error: ", e);

    }
};
const searchProductsDTO = async (query) => {
    try {
        return searchProducts(query)
            .then(products => {
                const productsDTO = convertProductsToDTO(products)
                return productsDTO;
            })

    } catch (e) {
        console.log("Search productsDTO error: ", e);
    }
};
const insertProductDTO = async (product) => {

    try {
        const newCode = await generateCode(product["category"])
        product["productCode"] = newCode
        return insertProduct(product)
            .then(product => {
                const productDTO = convertProductsToDTO(product)
                return productDTO;
            })
    } catch (e) {
        console.log("Insert productDTO error: ", e);
    }
};
const insertProductsDTO = async (products) => {
    try {
      products = await Promise.all(products.map(async (product) => {
        const newCode = await generateCode(product["category"]);
        product["productCode"] = newCode;
        return product;
      }));
  
      const productInserted = await insertProducts(products);
      const productsDTO = convertProductsToDTO(productInserted);
      return productsDTO;
    } catch (e) {
      console.log("Insert productsDTO error: ", e);
    }
  };
module.exports = { getProductsDTO, searchProductsDTO, insertProductDTO ,insertProductsDTO};