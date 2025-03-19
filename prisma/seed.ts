import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create the basic plan
  const basicPlan = await prisma.plan.upsert({
    where: { name: 'BASIC' },
    update: {},
    create: {
      name: 'BASIC',
      description: 'Basic plan with limited features',
      price: 0,
      stripePriceId: process.env.STRIPE_PRICE_ID_BASIC,
      features: [
        'Basic document analysis',
        'Limited chat assistance',
        'Access to basic resources',
        'Community support'
      ],
    },
  });
  
  // Create the pro plan
  const proPlan = await prisma.plan.upsert({
    where: { name: 'PRO' },
    update: {},
    create: {
      name: 'PRO',
      description: 'Professional plan with all features',
      price: 19.99,
      stripePriceId: process.env.STRIPE_PRICE_ID_PRO,
      features: [
        'Advanced document analysis',
        'Unlimited chat assistance',
        'Priority support',
        'Full resource access',
        'Custom templates',
        'Advanced analytics'
      ],
    },
  });
  
  console.log('Seeded plans:', { basicPlan, proPlan });
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 