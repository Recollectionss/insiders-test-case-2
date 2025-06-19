import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.users.findFirst({ where: { admin: true } });

  if (!adminExists) {
    const hashedAdminPass = await bcrypt.hash('adminpassword', 10);
    const hashedUserPass = await bcrypt.hash('userpassword', 10);

    const admin = await prisma.users.create({
      data: {
        username: 'admin',
        password: hashedAdminPass,
        admin: true,
      },
    });

    const user = await prisma.users.create({
      data: {
        username: 'user1',
        password: hashedUserPass,
        admin: false,
      },
    });

    const room1 = await prisma.rooms.create({
      data: {
        name: 'Conference Room A',
        capacity: 10,
      },
    });

    const room2 = await prisma.rooms.create({
      data: {
        name: 'Meeting Room B',
        capacity: 5,
      },
    });

    await prisma.bookings.createMany({
      data: [
        {
          start_time: new Date('2025-06-21T10:00:00Z'),
          end_time: new Date('2025-06-21T12:00:00Z'),
          user_id: user.id,
          room_id: room1.id,
        },
        {
          start_time: new Date('2025-06-22T09:00:00Z'),
          end_time: new Date('2025-06-22T10:30:00Z'),
          user_id: user.id,
          room_id: room2.id,
        },
      ],
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
