import {Router} from 'express';
import {pool} from '../config/db.js';
import {env} from '../config/env.js';
import {LOCAL_PRODUCT_URLS} from '../config/localUrls.js';
import {requireAuth} from '../middleware/auth.js';

export const catalogRouter = Router();

type ProductRow = {
  slug: string;
  name: string;
  description: string | null;
  base_url: string | null;
  openapi_url: string | null;
};

catalogRouter.get('/catalog', requireAuth, async (req, res) => {
  let products: ProductRow[] = [];
  let dbError: string | null = null;

  try {
    const [rows] = await pool.query(
      'SELECT slug, name, description, base_url, openapi_url FROM apim_products WHERE is_active = 1 ORDER BY name',
    );
    products = (rows as ProductRow[]).map((product) => {
      if (env.apimEnv === 'local' && LOCAL_PRODUCT_URLS[product.slug]) {
        const local = LOCAL_PRODUCT_URLS[product.slug];
        return {...product, base_url: local.baseUrl, openapi_url: local.openapiUrl};
      }
      return product;
    });
  } catch (error) {
    dbError = error instanceof Error ? error.message : 'Unknown database error';
  }

  res.render('catalog', {products, dbError, session: req.session, apimEnv: env.apimEnv});
});
