const express = require("express")
const app = express()
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer")
const PORT = 3000

const { getProductsDTO, searchProductsDTO } = require("./public/js/products")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public/pages/home.html"))
})
app.get("/products", (req, res) => {
    const { searchText, min, max, isSearch } = req.query;
    if (Number(isSearch) === 1) {
        let query = {
        };
        let $and = []
        if (Number(max) >= 0) {
            if (Number(max) > Number(min)) {
                $and.push({ price: { $gte: Number(min), $lte: Number(max) } })
            } else if (Number(max) == Number(min) && Number(max) != 0) {
                $and.push({ price: Number(min) })
            }
        }
        if (String(searchText) !== "null") {
            $and.push({ $or: [{ _id: { $regex: searchText, $options: 'i' } }, { productName: { $regex: searchText, $options: 'i' } }] })
        }
        if ($and.length > 0) {
            query = {
                $and
            }
        }
        searchProductsDTO(query).then(productsDTO => {
            const data = JSON.stringify(productsDTO);
            res.json({ message: "Search successfull", ProductsDTO: data })
        }).catch(e => {
            res.json({ message: e.message })
            console.log(e)
        })
    } else {
        getProductsDTO().then(productsDTO => {
            const data = JSON.stringify(productsDTO);
            res.sendFile(path.resolve(__dirname, "public/pages/products.html"), {
                headers: {
                    "Content-Type": "text/html",
                    "ProductsDTO": data
                }
            });
        }).catch(e => {
            res.sendFile(path.resolve(__dirname, "public/pages/products.html"), {
                headers: {
                    "Content-Type": "text/html",
                }
            });
            console.log(e)
        })
    }

})
app.get("/products/create", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public/pages/create.html"))
})
app.get("/products/update", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public/pages/update.html"))
})
app.get("/products/delete", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public/pages/delete.html"))
})


app.listen(PORT, () => {
    console.log(`App is listening at port http://127.0.0.1:3000`)
})

