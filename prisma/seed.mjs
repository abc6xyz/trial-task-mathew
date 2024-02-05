// insert seed data

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'michael.edy623@gmail.com',
      password: 'ML123!@#',
      address: 'Tigaon, Camarines sur, PH'
    },
  });

  await prisma.$disconnect();
}

main()
.catch((e) => {
    throw e;
})
.finally(async () => {
    await prisma.$disconnect();
});