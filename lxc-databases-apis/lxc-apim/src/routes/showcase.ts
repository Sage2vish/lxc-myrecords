import {Router} from 'express';
import {pool} from '../config/db.js';

export const showcaseRouter = Router();

type ProductRow = {
  slug: string;
  name: string;
  description: string | null;
  base_url: string | null;
  openapi_url: string | null;
};

showcaseRouter.get('/', async (_req, res) => {
  let products: ProductRow[] = [];
  let dbError: string | null = null;

  try {
    const [rows] = await pool.query(
      'SELECT slug, name, description, base_url, openapi_url FROM apim_products WHERE is_active = 1 ORDER BY name',
    );
    products = rows as ProductRow[];
  } catch (error) {
    dbError = error instanceof Error ? error.message : 'Unknown database error';
  }

  res.render('catalog', {products, dbError});
});
