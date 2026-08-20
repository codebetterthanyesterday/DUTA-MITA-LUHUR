import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const products = await prisma.product.findMany({ include: { images: true } })
  console.log(JSON.stringify(products.map(p => p.images), null, 2))
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect())
