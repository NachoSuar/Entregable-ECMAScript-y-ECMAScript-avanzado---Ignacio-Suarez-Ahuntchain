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


    //Actualizar un producto por ID
        
    updateProcuts = async ({id, ...producto}) => {
        await this.deleteProductById(id);
        let productold = await this.readProduct()
        let productsModifi = [{ ...producto, id }, ...productold];
        await fs.writeFile(this.patch, JSON.stringify(productsModifi));
    };

};

const productos = new ProductManager();

//-------->Llama a todos los productos<----------
//productos.getProducts()
//-------->Producto por Id<--------------
//productos.getProductsById(2);
//-------->Elimina el producto designado<--------------
//productos.deleteProductById(2);

productos.updateProcuts({
    title: 'titulo3',
    description: 'Description3',
    price: 8500,
    imagen: 'imagen3',
    code: 'adc12345',
    stock: 11,
    id: 3
});