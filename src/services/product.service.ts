import { prisma } from '../lib/prisma.js';

interface ProductInput {
  name: string;
  price: number;
}

function isNotFound(err: unknown) {
  return (err as { code?: string })?.code === 'P2025';
}

export function findAll() {
  return prisma.product.findMany({ orderBy: { id: 'asc' } });
}

export function findById(id: number) {
  return prisma.product.findUnique({ where: { id } });
}

export function create(data: ProductInput) {
  return prisma.product.create({ data });
}

export async function update(id: number, data: ProductInput) {
  try {
    return await prisma.product.update({ where: { id }, data });
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

export async function remove(id: number) {
  try {
    return await prisma.product.delete({ where: { id } });
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}