import {promises as fs, readFile} from "fs"

export default class ProductManager{
    constructor(){
        this.patch = "./productos.txt"
        this.products = []
    };

    static id = 0

    //Agrega un producto

    addProduct = async (title, description, price, imagen, code, stock) =>{

        ProductManager.id++
        let newProduct = {
            title,
            description,
            price,
            imagen,
            code,
            stock,
            id: ProductManager.id

        };


        this.products.push(newProduct);

        await fs.writeFile(this.patch, JSON.stringify(this.products));
    };

    readProduct = async () => {
        let respuesta = await fs.readFile(this.patch, "utf-8")
        return JSON.parse(respuesta);
    };

    getProducts = async () => {
        let respuesta2 = await this.readProduct()
        return console.log(respuesta2);
    };

    getProductsById = async (id) => {

        let respuesta3 = await this.readProduct() 
        if(!respuesta3.find(product => product.id === id)){
            console.log("Producto no encontrado");
        }else{
            console.log (respuesta3.find(product => product.id === id));
        }
    };

    //Elimina un producto

    deleteProductById = async (id) =>{
        let respuesta3 = await this.readProduct();
        let productFilter = respuesta3.filter(products => products.id != id);
        await fs.writeFile(this.patch, JSON.stringify(productFilter));
        console.log("Producto Eliminado");
    };


    //Actualizar un producto por ID en campos especificos
        
    updateProductById = async (id, updatedFields) => {
        let products = await this.readProduct();
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            console.log("Producto no encontrado");
            return;
        }

        products[productIndex] = {
            ...products[productIndex],
            ...updatedFields
        };

        await fs.writeFile(this.patch, JSON.stringify(products));
        console.log("Producto actualizado exitosamente");


        //Comprobación de que el producto en este caso "3" se modifica
        if (id === 3) {
            console.log(`Producto actualizado con ID 3:`);
            console.log(products[productIndex]);
        }
    };
    
    

    updateProcuts = async (id, updatedFields) => {
        await this.updateProductById(id, updatedFields);
    };
    

};


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