import express from "express";
import ProductManager from "./components/ProductManager.js";

const app = express()
app.use(express.urlencoded({extended : true}));

const productos = new ProductManager();
const readProduct = productos.readProduct();


//----------------> Ruta para todos los productos que puede recibir limites
app.get("/products", async (req,res) => {
    let limit = parseInt(req.query.limit);
    if(!limit) return res.send(await readProduct);
    let allProducts = await readProduct;
    let productLimit = allProducts.slice(0, limit);
    res.send(productLimit);
});


//----------------> Ruta para los productos especificando por ID
app.get("/products/:id", async (req,res) => {
    let id = parseInt(req.params.id);
    let allProducts = await readProduct;
    let productById = allProducts.find(product => product.id === id);
    res.send(productById);
})


//----------------> Puerto, Servidor e Inicio del mismo
const PORT = 8080;
const server = app.listen(PORT, () =>{
    console.log(`Express por Local Host ${server.address().port}`)
})

server.on("error", (error) => console.log (`Error del servidor ${error}`))