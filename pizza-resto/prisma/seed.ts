import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.size.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categories = [
    { slug: "signatures", name: "Nos Signatures", position: 0 },
    { slug: "classiques", name: "Les Classiques", position: 1 },
    { slug: "vegetariennes", name: "Végétariennes", position: 2 },
    { slug: "entrees", name: "Entrées", position: 3 },
    { slug: "boissons", name: "Boissons", position: 4 },
    { slug: "desserts", name: "Desserts", position: 5 }
  ];

  const catRecords: Record<string, string> = {};
  for (const c of categories) {
    const rec = await prisma.category.create({ data: c });
    catRecords[c.slug] = rec.id;
  }

  const sizesFor = (base: number) => ({
    create: [
      { label: "Junior 25cm", extraPrice: 0 },
      { label: "Sénior 33cm", extraPrice: 400 },
      { label: "Méga 45cm", extraPrice: 900 }
    ]
  });

  const pizzas = [
    {
      slug: "tartufo-nera",
      name: "Tartufo Nera",
      description: "Crème de truffe noire, mozzarella di bufala, champignons de Paris, roquette, copeaux de parmesan",
      imageUrl: "/images/pizza-truffle.jpg",
      basePrice: 1590,
      categorySlug: "signatures"
    },
    {
      slug: "nduja-piccante",
      name: "'Nduja Piccante",
      description: "Sauce tomate San Marzano, nduja calabraise, mozzarella, miel piquant, basilic frais",
      imageUrl: "/images/pizza-nduja.jpg",
      basePrice: 1490,
      categorySlug: "signatures"
    },
    {
      slug: "margherita",
      name: "Margherita",
      description: "Sauce tomate San Marzano, mozzarella fior di latte, basilic frais, huile d'olive",
      imageUrl: "/images/pizza-margherita.jpg",
      basePrice: 990,
      categorySlug: "classiques"
    },
    {
      slug: "regina",
      name: "Regina",
      description: "Sauce tomate, mozzarella, jambon blanc, champignons frais",
      imageUrl: "/images/pizza-regina.jpg",
      basePrice: 1190,
      categorySlug: "classiques"
    },
    {
      slug: "quattro-formaggi",
      name: "Quattro Formaggi",
      description: "Mozzarella, gorgonzola, parmesan, chèvre, crème fraîche",
      imageUrl: "/images/pizza-4formaggi.jpg",
      basePrice: 1290,
      categorySlug: "vegetariennes"
    },
    {
      slug: "orto",
      name: "Dell'Orto",
      description: "Sauce tomate, mozzarella, courgettes grillées, poivrons, aubergines, oignons rouges",
      imageUrl: "/images/pizza-orto.jpg",
      basePrice: 1250,
      categorySlug: "vegetariennes"
    }
  ];

  for (const p of pizzas) {
    await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        imageUrl: p.imageUrl,
        basePrice: p.basePrice,
        categoryId: catRecords[p.categorySlug],
        sizes: sizesFor(p.basePrice)
      }
    });
  }

  const entrees = [
    { slug: "arancini", name: "Arancini (6 pièces)", description: "Boulettes de risotto panées, cœur mozzarella", imageUrl: "/images/arancini.jpg", basePrice: 690 },
    { slug: "burrata", name: "Burrata & tomates confites", description: "Burrata crémeuse, tomates confites, pesto maison", imageUrl: "/images/burrata.jpg", basePrice: 890 }
  ];
  for (const p of entrees) {
    await prisma.product.create({
      data: { ...p, categoryId: catRecords["entrees"] }
    });
  }

  const boissons = [
    { slug: "coca-33", name: "Coca-Cola 33cl", description: "Canette fraîche", imageUrl: "/images/coca.jpg", basePrice: 250 },
    { slug: "eau-50", name: "Eau minérale 50cl", description: "", imageUrl: "/images/eau.jpg", basePrice: 200 }
  ];
  for (const p of boissons) {
    await prisma.product.create({
      data: { ...p, categoryId: catRecords["boissons"] }
    });
  }

  const desserts = [
    { slug: "tiramisu", name: "Tiramisu maison", description: "Recette traditionnelle au mascarpone", imageUrl: "/images/tiramisu.jpg", basePrice: 590 },
    { slug: "panna-cotta", name: "Panna Cotta", description: "Coulis de fruits rouges", imageUrl: "/images/pannacotta.jpg", basePrice: 550 }
  ];
  for (const p of desserts) {
    await prisma.product.create({
      data: { ...p, categoryId: catRecords["desserts"] }
    });
  }

  console.log("Seed terminé ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
