import type { Request, Response } from 'express';
import * as productService from '../services/product.service.js';

function parseId(raw: unknown): number | null {
  if (typeof raw !== 'string' || !/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function parseBody(body: unknown) {
  const { name, price } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== 'string' || name.trim() === '') {
    return { error: 'name wajib diisi dan tidak boleh kosong' };
  }
  if (typeof price !== 'number' || !Number.isInteger(price) || price < 0) {
    return { error: 'price harus berupa bilangan bulat tidak negatif' };
  }
  return { data: { name: name.trim(), price } };
}

function serverError(res: Response, err: unknown) {
  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
}

export async function getProducts(req: Request, res: Response) {
  try {
    const products = await productService.findAll();
    res.status(200).json(products);
  } catch (err) {
    serverError(res, err);
  }
}

export async function getProductById(req: Request, res: Response) {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: 'ID harus berupa bilangan bulat positif' });
    return;
  }

  try {
    const product = await productService.findById(id);
    if (!product) {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    serverError(res, err);
  }
}

export async function createProduct(req: Request, res: Response) {
  const parsed = parseBody(req.body);
  if (parsed.error) {
    res.status(400).json({ message: parsed.error });
    return;
  }

  try {
    const product = await productService.create(parsed.data!);
    res.status(201).json(product);
  } catch (err) {
    serverError(res, err);
  }
}

export async function updateProduct(req: Request, res: Response) {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: 'ID harus berupa bilangan bulat positif' });
    return;
  }

  const parsed = parseBody(req.body);
  if (parsed.error) {
    res.status(400).json({ message: parsed.error });
    return;
  }

  try {
    const product = await productService.update(id, parsed.data!);
    if (!product) {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    serverError(res, err);
  }
}

export async function deleteProduct(req: Request, res: Response) {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: 'ID harus berupa bilangan bulat positif' });
    return;
  }

  try {
    const product = await productService.remove(id);
    if (!product) {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
      return;
    }
    res.status(200).json({ message: 'Produk berhasil dihapus', product });
  } catch (err) {
    serverError(res, err);
  }
}