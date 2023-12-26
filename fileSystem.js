import {promises as fs, readFile} from "fs"

class ProductManager{
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


const productos = new ProductManager();

//-------->Llama a todos los productos<----------
//productos.getProducts()
//-------->Producto por Id<--------------
//productos.getProductsById(2);
//-------->Elimina el producto designado<--------------
//productos.deleteProductById(2);


//-------->Aquí se implementa los cambios en este ejemplo el stock, modificando solo el stock<-----------------
productos.updateProcuts(3, {
    stock: 200
});