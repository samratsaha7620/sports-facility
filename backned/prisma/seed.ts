import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create an admin user
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      phno: '1234567890',
      password: 'securepassword', // Ensure to hash passwords in production
      isEmailVerified: true,
      type: 'ADMIN',
    },
  });

  console.log('Admin User Created:', adminUser);

  // Create a club
  const club1 = await prisma.club.create({
    data: {
      name: 'Swimming & water sports Club',
      description: 'Swimming & Water Sports club of the Tezpur University campus which take cares of the water borne activities in the campus. Swimming pool was come up in the campus in January 2018 and the club has organized events throughout the season and conducts at various levels. The club is to encourages love for Swimming and kids to take up Swimming as a part of a healthy lifestyle and a positive environment. The primary goal of the club is representing the Inter University, National and International level Tournaments in the future.',
      isApplicationPublished:false,
    },
  });

  console.log('Club Created:', club1);

  const club2 = await prisma.club.create({
    data: {
      name: 'Gymnasium Club',
      description: 'Gymnasium, large room used and equipped for the performance of various sports. Tezpur University Gymnasium club exists for both ladies and gents. The Gymnasium club in Tezpur University is one of the sincerest clubs in the campus. The club is equipped with international standard equipment like treadmill, cross-trainer, multigym, barbells, plate weight etc. The club is Responsible for Conducting Fitness events like Body Building, powerlifting, weightlifting, tug-of-war and arm-wrestling Competition.',
      isApplicationPublished:false,
    },
  });

  console.log('Club Created:', club2);

}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });