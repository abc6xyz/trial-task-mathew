// insert seed data

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.widget.deleteMany()
  await prisma.widget.createMany({
    data: [
      {
        widget_id: 0,
        widget_name: 'Embedded Widget',
        widget_description: 'Embedded Widget',
      },
      {
        widget_id: 1,
        widget_name: 'RSS Reader',
        widget_description: 'RSS Reader',
      },
    ],
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