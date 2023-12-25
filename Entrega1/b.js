class ProductManager{
    constructor(){
        this.products = []
    }

    static id = 0

    addProduct(title, description, price, thumbnail, code, stock){
        for(let i = 0; i < this.products.length; i++){
            if(this.products[i].code === code) {
            console.log(`El codigo ${code} esta repetida`);
            break;
            }
        }

        const newProduct = {title, description, price, thumbnail, code, stock,}

        if(!Object.values(newProduct).includes(undefined)){
            ProductManager.id++
            this.products.push({
                ...newProduct,
                id: ProductManager.id, 
            });
        }else{
            console.log("Faltan campos por agregar y son requeridos")
        }
    }

    getProduct(){
        return this.products;
    }

    trueProduct(id){
        return this.products.find((producto) => producto.id === id);
    }

    getProductById(id){
        !this.trueProduct(id) ? console.log("Not Found") : console.log (this.trueProduct(id)); 
    }
}


const productos = new ProductManager

//Llamada de comprobación para el funcionamiento del arreglo vacio
console.log(productos.getProduct());

productos.addProduct('titulo', 3000, "imagen1", "abcd1234", 5);

productos.addProduct('titulo2', 'description2', 5000, "imagen2", "abcd1235", 5);

//Llamada para comprobar un arreglo con producto
console.log(productos.getProduct());


// En caso de querer comprobar la validacion por ID utilizar esta linea que repite el ID

productos.addProduct('titulo3', 'description3', 15000, "imagen3", "abcd1235", 5);


productos.getProductById(1);