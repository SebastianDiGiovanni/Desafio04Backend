import fs from "fs";

export default class ProductManager {
    constructor(){
        this.products = [];
        this.path = './src/manager/Products.json' 
    }


    getProducts = async() =>{

        
        if(!fs.existsSync(this.path)) {
            await fs.promises.writeFile(this.path, JSON.stringify([]))
                .then((res)=> console.log(`< ${this.path} > fue creado.`))
                .catch((err) => console.log("Hubo un Problema al crear el archivo. No fue Posible."));
            }

        try {
            const rawdata = await fs.promises.readFile(this.path, 'utf-8')
            const data = JSON.parse(rawdata, null, "\n")
            return data;
             
        } catch (error) {
            console.log(error)
        }
    }


    addID = async(product) =>{
        const rawdata = await fs.promises.readFile(this.path, 'utf-8')
        const data = JSON.parse(rawdata, null, "\n")
        if (data.length === 0){
            product.id = 0;
        } else {
            product.id = data[data.length -1].id +1;
            return product
        }    
    }
// Agregado de productos
    addProduct = async (title, description, price, thumbnail, status = true,  code, stock, id) =>{
        const product = {
            title,
            description,
            price,
            thumbnail,
            status,
            code,
            stock,
            id
        }

        //Validacion
        if (!product.title || !product.description || !product.price || !product.status || !product.code || !product.stock) {
            console.error(`Complete todos los campos, por favor.`);
        };

        //id dinamico
        this.addID(product);
        let rawdata = await fs.promises.readFile(this.path, 'utf-8');
        let data = JSON.parse(rawdata, null, "\n")
        
        
        if (data.find(prod => prod.code === product.code)) {
            return console.error(`El producto con el code: ${product.code} ya existe:`);
        } else {
            data.push(product);
        }
        
        let prodtoArray = data;

        
        await fs.promises.writeFile(this.path, JSON.stringify(prodtoArray, null, '\t'))
            .then(()=> {return console.log(`Se agrego ${product.title} sin problemas`)})
            .catch(err => console.log(err))   
    }
// Buscamos el producto con un id especifico
    getProductsById = async(id) =>{
        try {
            const rawdata = await fs.promises.readFile(this.path, 'utf-8')
            let data = JSON.parse(rawdata).find(prod => prod.id === id)
            if (!data){
                throw new Error("Not found")
            }else {
                return data;
            }
        } catch (error) {
            return error.message
        }
    }
//Actualiza informacion
updateProduct = async(id, updateObj) => {
    try {
        if (!id) {
            throw new Error ("No esxiste el producto con ese id")
        }
            
            let rawdata = await fs.promises.readFile(this.path, 'utf-8');

            let oldProd = JSON.parse(rawdata);

            const productoIndex = oldProd.findIndex(prod=> prod.id === id);

            if (productoIndex === -1) {
                throw new Error(`No se encontró el producto con id ${id}`);
            }
            const newData= {
                ...oldProd[productoIndex],
                ...updateObj,
                id
            }

            oldProd[productoIndex] = newData;
            await fs.promises.writeFile(this.path ,JSON.stringify(oldProd, null, '\t'));

    } catch (error) {
       return error.message
    }
}
// Eliminacion producto
deleteProduct = async(id)=>{
    try { 
        const rawdata = await fs.promises.readFile(this.path, 'utf-8')
        let data = JSON.parse(rawdata);
        const newData = data.filter(prod => prod.id !== id);

        await fs.promises.writeFile(this.path, JSON.stringify(newData, null, "\t"));
        return console.log("Producto eliminado correctamente");    
    } catch (error) {
        return error.message
    }
}
}
