import { promises as fs } from "fs";
import { v4 as uuidv4 } from 'uuid';

export default class CartManager {
  constructor() {
    this.cartPath = "./carritos.txt";
    this.carts = [];
  }

  //---------> Añade un carrito
  addCart = async (newCart) => {
    newCart.id = uuidv4();
    newCart.products = [];  
    this.carts.push(newCart);
    await this.saveCarts();
    return newCart;
  };

  //---------> Lee todos los carritos
  readCarts = async () => {
    let response = await fs.readFile(this.cartPath, "utf-8").catch(() => "[]");

    //---------> Parsea la respuesta y resuelve en caso de que el archivo está vacío
    try {
      this.carts = JSON.parse(response) || [];
    } catch (error) {
      this.carts = [];
    }

    return this.carts;
  };

  //---------> Obtiene un carrito por ID
  getCartById = async (id) => {
    let carts = await this.readCarts();
    return carts.find((cart) => cart.id === id);
  };

  //---------> Guarda los carritos en el archivo
  saveCarts = async () => {
    await fs.writeFile(this.cartPath, JSON.stringify(this.carts));
  };

  //---------> Obtiene el próximo ID disponible
  static getNextId = () => {
    return uuidv4(); // Utilizamos UUID para IDs únicos
  };

  //---------> Actualiza productos en un carrito por ID
  updateProducts = async (cartId, updatedFields) => {
    let carts = await this.readCarts();
    const cartIndex = carts.findIndex((cart) => cart.id === cartId);

    if (cartIndex !== -1) {
      carts[cartIndex] = {
        ...carts[cartIndex],
        ...updatedFields,
      };

      await this.saveCarts();
    }
  };
}



