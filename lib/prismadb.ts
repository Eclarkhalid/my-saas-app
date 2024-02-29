import {PrismaClient} from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prismadb;

export default prismadb;


// prisma.$on('query', (e) => {
//   console.log('Query: ' + e.query);
//   console.log('Params: ' + e.params);