import express from 'express';
import handlebars from 'express-handlebars';
import  __dirname  from './utils.js';
import { Server } from 'socket.io';

import productsRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js';

import ProductManager from './manager/ProductManager.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public`));

app.engine('handlebars' , handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');


app.use('/api/products' , productsRouter );
app.use('/realtimeproducts', viewsRouter );


const server = app.listen(8080, ()=> console.log("Server on 8080, Desafio 4 Websocket y Handlebars"));

const io = new Server(server)

const productmanager = new ProductManager();


io.on('connection', socket =>{
    console.log("Conexion establecida");
    
    socket.on('product', async (data) =>{
        console.log("Soy data:",data);
        await productmanager.addProduct( data.title, data.description, data.price, data.thumbnails, data.status, data.code, data.stock );

        const products = await productmanager.getProducts();
        io.emit('allProds', products);
    })
});