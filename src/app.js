import express from "express";
import { promises as fs } from "fs";
import ProductManager from "./components/ProductManager.js";
import CartManager from "./components/CartManager.js";
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const productos = new ProductManager();
const carts = new CartManager();

//---------> Rutas para productos
const productsRouter = express.Router();

//---------> Ruta raíz GET /api/products/
productsRouter.get("/", async (req, res) => {
  console.log("Recibida solicitud GET en /api/products/");
  let limit = parseInt(req.query.limit);
  if (!limit) return res.send(await productos.readProduct());
  let allProducts = await productos.readProduct();
  let productLimit = allProducts.slice(0, limit);
  res.send(productLimit);
});

//---------> Ruta GET /api/products/:pid (Algo importante a tener en cuenta
//---------> que las ID de los productos estan generados automaticamente por
//---------> lo cual se necesita usar el ID generado en el listado de)
//---------> "http://localhost:8080/api/products/" - esta hecho asi ya que me
//---------> parecio más realista que un numero normal creciente.
productsRouter.get("/:pid", async (req, res) => {
    try {
      console.log("Recibida solicitud GET en /api/products/:pid");
      let id = req.params.pid.toString();  //---------> Lo convertir a cadena
      console.log("ID del producto (parámetro):", id);
      let allProducts = await productos.readProduct();
      console.log("Todos los productos:", allProducts);
  
      let productById = allProducts.find((product) => product.id === id);  //---------> Comparar sin convertir product.id a cadena
      console.log("Comparando:", productById?.id, typeof productById?.id, id, typeof id);
  
      if (!productById) {
        console.log("Producto no encontrado");
        return res.status(404).send("Producto no encontrado");
      }
  
      res.send(productById);
    } catch (error) {
      console.error("Error en la solicitud GET por ID:", error);
      res.status(500).send("Error interno del servidor");
    }
  });

//---------> Ruta raíz POST /api/products/
productsRouter.post("/", async (req, res) => {
  console.log("Recibida solicitud POST en /api/products/");
  const { title, description, price, imagen, code, stock } = req.body;

  if (!title || !description || !code || !price || !stock) {
    return res.status(400).send("Todos los campos son obligatorios");
  }

  const newProduct = {
    id: ++ProductManager.id,
    title,
    description,
    price: parseFloat(price),
    imagen,
    code,
    stock,
  };

  await productos.addProduct(newProduct);
  res.send(await productos.readProduct());
});

//---------> Ruta PUT /api/products/:pid
productsRouter.put("/:pid", async (req, res) => {
    try {
      console.log("Recibida solicitud PUT en /api/products/:pid");
      const productId = req.params.pid;  //---------> Lo cambiada a cadena
  
      if (!productId) {
        return res.status(400).send("ID de producto no proporcionado");
      }
  
      const updatedFields = req.body;
  
      if (Object.keys(updatedFields).length === 0) {
        return res
          .status(400)
          .send("Se esperan campos actualizados en el cuerpo de la solicitud");
      }
  
      await productos.updateProductById(productId, updatedFields);  //---------> Cambiado a updateProductById
      res.send("Producto actualizado exitosamente");
    } catch (error) {
      console.error("Error en la solicitud PUT:", error);
      res.status(500).send("Error interno del servidor");
    }
  });
  

//---------> Ruta DELETE /api/products/:pid
productsRouter.delete("/:pid", async (req, res) => {
  console.log("Recibida solicitud DELETE en /api/products/:pid");
  const productId = parseInt(req.params.pid);

  if (!productId) {
    return res.status(400).send("ID de producto no proporcionado");
  }

  await productos.deleteProductById(productId);
  res.send("Producto eliminado exitosamente");
});

//---------> Suma el router de productos en la ruta /api/products/
app.use("/api/products", productsRouter);

//---------> Rutas para carritos
const cartsRouter = express.Router();

//---------> Ruta raíz POST /api/carts/
cartsRouter.post("/", async (req, res) => {
  console.log("Recibida solicitud POST en /api/carts/");

  const newProducts = req.body; //---------> Se espera un array de productos

  if (!newProducts || !Array.isArray(newProducts)) {
    return res
      .status(400)
      .send("Se espera un array de productos en el cuerpo de la solicitud");
  }

  const newCart = {
    id: ++CartManager.id,
    products: newProducts,
  };

  await carts.addCart(newCart);
  res.send(newCart);
});

//---------> Ruta GET /api/carts/:cid
cartsRouter.get("/:cid", async (req, res) => {
    console.log("Recibida solicitud GET en /api/carts/:cid");
    const cartId = req.params.cid;  //---------> Por el tema del ID generado en UUID
    const cart = await carts.getCartById(cartId);
  
    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }
  
    res.send(cart);  //---------> Se envia todo el carrito
  });
  
  
  

//---------> Ruta POST /api/carts/:cid/product/:pid
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    console.log("Recibida solicitud POST en /api/carts/:cid/product/:pid");
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = parseInt(req.body.quantity || 1);
  
    const cart = await carts.getCartById(cartId);
    const product = await productos.getProductsById(productId);
  
    if (!cart || !product) {
      return res.status(404).send("Carrito o producto no encontrado");
    }
  
    const existingProductIndex = cart.products.findIndex(
      (item) => item.product === productId
    );
  
    if (existingProductIndex !== -1) {
      //---------> Si el producto ya existe en el carrito, aumenta la cantidad
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      //---------> Si el producto no existe en el carrito, se agrega
      cart.products.push({ product: productId, quantity });
    }
  
    await carts.updateProducts(cartId, { products: cart.products });
  
    res.send(cart.products);
  });
  
  
  
  

//---------> Monta el router de carritos en la ruta /api/carts/
app.use("/api/carts", cartsRouter);

//---------> Lo que resta del código (puerto, servidor, inicio, etc.)
const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Express por Local Host ${server.address().port}`);
});

server.on("error", (error) => console.log(`Error del servidor ${error}`));


//-------> para testear algunas opciones recomiendo usar el formato y modificar los parametros
// ej   agregar prod. POST   "http://localhost:8080/api/products/"
//{
//     "title": "Nuevo Producto",
//     "description": "Descripción del nuevo producto",
//     "code": "ABC125",
//     "price": 19.99,
//     "status": true,
//     "stock": 50,
//     "category": "Electrónicos",
//     "thumbnails": ["url1", "url2"]
//   }