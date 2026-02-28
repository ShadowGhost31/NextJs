import { PrismaClient, Role, EventStatus, ReviewStatus, OrderStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash("admin123", 10);
  const orgPass = await bcrypt.hash("organizer123", 10);
  const userPass = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: { email: "admin@demo.com", name: "Адміністратор", passwordHash: adminPass, role: Role.ADMIN },
  });

  const organizer = await prisma.user.upsert({
    where: { email: "organizer@demo.com" },
    update: {},
    create: { email: "organizer@demo.com", name: "Організатор", passwordHash: orgPass, role: Role.ORGANIZER },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@demo.com" },
    update: {},
    create: { email: "user@demo.com", name: "Користувач", passwordHash: userPass, role: Role.USER },
  });

  const categories = [
    { title: "Концерти", slug: "concerts" },
    { title: "Театр", slug: "theatre" },
    { title: "Освіта", slug: "education" },
    { title: "Спорт", slug: "sport" },
    { title: "Дітям", slug: "kids" },
    { title: "Виставки", slug: "exhibitions" },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { title: c.title },
      create: c,
    });
  }

  const venues = [
    {
      title: "Житомирська обласна філармонія",
      address: "м. Житомир, вул. Пушкінська, 26",
      city: "Житомир",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=%D0%96%D0%B8%D1%82%D0%BE%D0%BC%D0%B8%D1%80%D1%81%D1%8C%D0%BA%D0%B0+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D0%BD%D0%B0+%D1%84%D1%96%D0%BB%D0%B0%D1%80%D0%BC%D0%BE%D0%BD%D1%96%D1%8F",
    },
    {
      title: "Житомирський драмтеатр",
      address: "м. Житомир, майдан Соборний, 6",
      city: "Житомир",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=%D0%96%D0%B8%D1%82%D0%BE%D0%BC%D0%B8%D1%80%D1%81%D1%8C%D0%BA%D0%B8%D0%B9+%D0%B4%D1%80%D0%B0%D0%BC%D1%82%D0%B5%D0%B0%D1%82%D1%80",
    },
    {
      title: "Міський парк культури",
      address: "м. Житомир, вул. Старий бульвар",
      city: "Житомир",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=%D0%9C%D1%96%D1%81%D1%8C%D0%BA%D0%B8%D0%B9+%D0%BF%D0%B0%D1%80%D0%BA+%D0%BA%D1%83%D0%BB%D1%8C%D1%82%D1%83%D1%80%D0%B8+%D0%96%D0%B8%D1%82%D0%BE%D0%BC%D0%B8%D1%80",
    },
    {
      title: "Міська галерея",
      address: "м. Житомир, вул. Михайлівська",
      city: "Житомир",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=%D0%9C%D0%B8%D1%85%D0%B0%D0%B9%D0%BB%D1%96%D0%B2%D1%81%D1%8C%D0%BA%D0%B0+%D0%B2%D1%83%D0%BB%D0%B8%D1%86%D1%8F+%D0%96%D0%B8%D1%82%D0%BE%D0%BC%D0%B8%D1%80",
    },
  ];
  for (const v of venues) {
    const existing = await prisma.venue.findFirst({ where: { title: v.title, city: v.city } });
    if (existing) {
      await prisma.venue.update({ where: { id: existing.id }, data: { address: v.address, mapUrl: v.mapUrl } });
    } else {
      await prisma.venue.create({ data: v });
    }
  }

  const catConcerts = await prisma.category.findUniqueOrThrow({ where: { slug: "concerts" } });
  const catEx = await prisma.category.findUniqueOrThrow({ where: { slug: "exhibitions" } });
  const catEdu = await prisma.category.findUniqueOrThrow({ where: { slug: "education" } });
  const catTheatre = await prisma.category.findUniqueOrThrow({ where: { slug: "theatre" } });
  const catSport = await prisma.category.findUniqueOrThrow({ where: { slug: "sport" } });
  const catKids = await prisma.category.findUniqueOrThrow({ where: { slug: "kids" } });

  const vPark = await prisma.venue.findFirstOrThrow({ where: { title: "Міський парк культури" } });
  const vGallery = await prisma.venue.findFirstOrThrow({ where: { title: "Міська галерея" } });
  const vPhil = await prisma.venue.findFirstOrThrow({ where: { title: "Житомирська обласна філармонія" } });
  const vDrama = await prisma.venue.findFirstOrThrow({ where: { title: "Житомирський драмтеатр" } });

  const now = new Date();

  const e1 = await prisma.event.create({
    data: {
      title: "Open-air концерт у центрі",
      description: "Музичний вечір із живим виконанням. Формат open-air, фудкорт та сімейна атмосфера.",
      city: "Житомир",
      venueId: vPark.id,
      categoryId: catConcerts.id,
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 19, 0),
      endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 22, 0),
      imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80",
      organizerId: organizer.id,
      status: EventStatus.PUBLISHED,
      publishedAt: new Date(),
      ticketTypes: {
        create: [
          { name: "Стандарт", price: 20000, quantityTotal: 200 },
          { name: "VIP", price: 50000, quantityTotal: 50 },
        ],
      },
    },
  });

  const e2 = await prisma.event.create({
    data: {
      title: "Виставка сучасного мистецтва",
      description: "Експозиція робіт місцевих митців. Вхід вільний для студентів за наявності студентського.",
      city: "Житомир",
      venueId: vGallery.id,
      categoryId: catEx.id,
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 12, 0),
      endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 18, 0),
      imageUrl: "https://images.unsplash.com/photo-1520697222865-7b2488da2e09?auto=format&fit=crop&w=1600&q=80",
      organizerId: organizer.id,
      status: EventStatus.PUBLISHED,
      publishedAt: new Date(),
      ticketTypes: { create: [{ name: "Вхідний квиток", price: 8000, quantityTotal: 300 }] },
    },
  });

  const e3 = await prisma.event.create({
    data: {
      title: "Лекція: як планувати карʼєру в ІТ",
      description: "Практичні поради щодо резюме, співбесіди та навчальної траєкторії. Кількість місць обмежена.",
      city: "Житомир",
      venueId: vPhil.id,
      categoryId: catEdu.id,
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10, 17, 30),
      endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10, 19, 0),
      organizerId: organizer.id,
      status: EventStatus.DRAFT,
      ticketTypes: { create: [{ name: "Реєстрація", price: 0, quantityTotal: 120 }] },
    },
  });

  const e4 = await prisma.event.create({
    data: {
      title: "Театральна вистава: Ревізор",
      description: "Класична комедія на сцені драмтеатру. Рекомендуємо приходити за 15 хв до початку.",
      city: "Житомир",
      venueId: vDrama.id,
      categoryId: catTheatre.id,
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 18, 30),
      endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 21, 0),
      imageUrl: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1600&q=80",
      organizerId: organizer.id,
      status: EventStatus.PUBLISHED,
      publishedAt: new Date(),
      ticketTypes: {
        create: [
          { name: "Партер", price: 25000, quantityTotal: 120 },
          { name: "Балкон", price: 15000, quantityTotal: 80 },
        ],
      },
    },
  });

  const e5 = await prisma.event.create({
    data: {
      title: "Забіг у парку: 5 км для всіх",
      description: "Дружній забіг для новачків і досвідчених. Розминка, вода та медпункт на локації.",
      city: "Житомир",
      venueId: vPark.id,
      categoryId: catSport.id,
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8, 10, 0),
      endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8, 12, 0),
      imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266634?auto=format&fit=crop&w=1600&q=80",
      organizerId: organizer.id,
      status: EventStatus.PUBLISHED,
      publishedAt: new Date(),
      ticketTypes: { create: [{ name: "Реєстрація", price: 0, quantityTotal: 500 }] },
    },
  });

  const e6 = await prisma.event.create({
    data: {
      title: "Дитячий майстер-клас: малюємо аквареллю",
      description: "Творчий майстер-клас для дітей 6–12 років. Матеріали надаються.",
      city: "Житомир",
      venueId: vGallery.id,
      categoryId: catKids.id,
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 9, 14, 0),
      endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 9, 15, 30),
      imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80",
      organizerId: organizer.id,
      status: EventStatus.PUBLISHED,
      publishedAt: new Date(),
      ticketTypes: { create: [{ name: "Квиток", price: 12000, quantityTotal: 40 }] },
    },
  });

  const e7 = await prisma.event.create({
    data: {
      title: "Кінопоказ під відкритим небом",
      description: "Вечірній кінопоказ просто неба. Пледи, попкорн та локація біля центральної алеї.",
      city: "Житомир",
      venueId: vPark.id,
      categoryId: catConcerts.id,
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 12, 20, 0),
      endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 12, 22, 30),
      imageUrl: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1600&q=80",
      organizerId: organizer.id,
      status: EventStatus.PUBLISHED,
      publishedAt: new Date(),
      ticketTypes: { create: [{ name: "Вхід", price: 10000, quantityTotal: 300 }] },
    },
  });

  const e8 = await prisma.event.create({
    data: {
      title: "Воркшоп: UX для початківців",
      description: "Практика прототипування, дизайн-системи та підхід до користувацьких сценаріїв.",
      city: "Житомир",
      venueId: vPhil.id,
      categoryId: catEdu.id,
      startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 15, 16, 0),
      endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 15, 18, 30),
      imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=80",
      organizerId: organizer.id,
      status: EventStatus.PUBLISHED,
      publishedAt: new Date(),
      ticketTypes: { create: [{ name: "Місце", price: 18000, quantityTotal: 80 }] },
    },
  });

  await prisma.review.create({
    data: {
      eventId: e1.id,
      userId: user.id,
      rating: 5,
      text: "Дуже класна атмосфера й звук. Рекомендую!",
      status: ReviewStatus.APPROVED,
      moderatedAt: new Date(),
      moderatedById: admin.id,
    },
  });

  await prisma.review.create({
    data: {
      eventId: e2.id,
      userId: admin.id,
      rating: 4,
      text: "Цікава експозиція, було що подивитись.",
      status: ReviewStatus.APPROVED,
      moderatedAt: new Date(),
      moderatedById: admin.id,
    },
  });

  await prisma.favorite.create({ data: { userId: user.id, eventId: e1.id } });
  await prisma.favorite.create({ data: { userId: user.id, eventId: e2.id } });

  await prisma.order.create({
    data: {
      userId: user.id,
      status: OrderStatus.PAID,
      total: 20000,
      items: {
        create: [
          {
            ticketTypeId: (await prisma.ticketType.findFirstOrThrow({ where: { eventId: e1.id, name: "Стандарт" } })).id,
            quantity: 1,
            unitPrice: 20000,
          },
        ],
      },
    },
  });

  await prisma.event.update({
    where: { id: e1.id },
    data: {
      ticketTypes: {
        updateMany: {
          where: { name: "Стандарт" },
          data: { quantitySold: 1 },
        },
      },
    },
  });

  console.log("Seed complete.");
  console.log("Demo accounts:");
  console.log("admin@demo.com / admin123 (ADMIN)");
  console.log("organizer@demo.com / organizer123 (ORGANIZER)");
  console.log("user@demo.com / user123 (USER)");
  console.log("Draft event created:", e3.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
