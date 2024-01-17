import fs from "fs/promises";
import { v4 as uuidv4 } from 'uuid';

export default class ProductManager {
  constructor() {
    //---------> Se ajusta la ruta y el nombre del archivo (Se puede cambiar)
    this.path = "./productos.txt";
    this.products = [];
  }

  //---------> Agrega un producto
  addProduct = async (newProduct) => {
    newProduct.id = uuidv4(); // Utilizamos UUID para IDs únicos
    this.products.push(newProduct);

    await fs.writeFile(this.path, JSON.stringify(this.products));
  };

  //---------> Lee productos del archivo
  readProduct = async () => {
    try {
      let response = await fs.readFile(this.path, "utf-8");
      return JSON.parse(response) || [];
    } catch (error) {
      console.error("Error al leer el archivo de productos:", error);
      return [];
    }
  };

  //---------> Muestra todos los productos
  getProducts = async () => {
    let response = await this.readProduct();
    return console.log(response);
  };

  //---------> Muestra un producto por ID
  getProductsById = async (id) => {
    let response = await this.readProduct();
    console.log("Todos los productos en getProductsById:", response);
  
    let product = response.find((product) => product.id === id);
  
    if (!product) {
      console.log("Producto no encontrado en getProductsById");
    } else {
      console.log("Producto encontrado en getProductsById:", product);
    }
  
    return product;
  };
  
  

  //---------> Elimina un producto por ID
  deleteProductById = async (id) => {
    let response = await this.readProduct();
    let productFilter = response.filter((product) => product.id !== id);
    await fs.writeFile(this.path, JSON.stringify(productFilter));
    console.log("Producto Eliminado");
  };

  //---------> Actualiza un producto por ID en campos específicos
  updateProductById = async (id, updatedFields) => {
    let response = await this.readProduct();
    const productIndex = response.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      console.log("Producto no encontrado");
      return;
    }

    response[productIndex] = {
      ...response[productIndex],
      ...updatedFields,
    };

    await fs.writeFile(this.path, JSON.stringify(response));
    console.log("Producto actualizado exitosamente");
  };
}



//---------> Ejemplos viejos

// const productos = new ProductManager();


// productos.addProduct("Titulo1", "Descripction1", 1000, "Imagen1", "abc121", 1);
// productos.addProduct("Titulo2", "Descripction2", 2000, "Imagen2", "abc122", 2);
// productos.addProduct("Titulo3", "Descripction3", 3000, "Imagen3", "abc123", 3);
// productos.addProduct("Titulo4", "Descripction4", 3500, "Imagen4", "abc124", 4);
// productos.addProduct("Titulo5", "Descripction5", 4000, "Imagen5", "abc125", 5);
// productos.addProduct("Titulo6", "Descripction6", 5000, "Imagen6", "abc126", 5);
// productos.addProduct("Titulo7", "Descripction7", 6000, "Imagen7", "abc127", 3);
// productos.addProduct("Titulo8", "Descripction8", 7000, "Imagen8", "abc128", 4);
// productos.addProduct("Titulo9", "Descripction9", 8000, "Imagen9", "abc129", 2);
// productos.addProduct("Titulo10", "Descripction10", 10000, "Imagen10", "abc130", 2);

//-------->Llama a todos los productos<----------
//productos.getProducts()
//-------->Producto por Id<--------------
//productos.getProductsById(2);
//-------->Elimina el producto designado<--------------
//productos.deleteProductById(2);


//-------->Aquí se implementa los cambios en este ejemplo el stock, modificando solo el stock<-----------------
// productos.updateProcuts(3, {
//     stock: 200
// });