import { Router } from 'express';
import ProductManager from '../manager/ProductManager.js';

const productmanager = new ProductManager();
const router = Router();

router.get('/', async (req,res)=> {
    const products = await productmanager.getProducts();
    const limit = Number(req.query.limit);

    if (!limit){
        res.render('index', {style: 'index.css', products});
    }else {
        const limitedProducts = products.slice(0, limit);
        res.render('index', {style: 'index.css', limitedProducts});
    };
});

export default router;