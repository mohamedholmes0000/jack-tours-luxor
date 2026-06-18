import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const orphanedImages = await prisma.galleryImage.findMany({
    where: { albumId: null },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: { id: true, url: true },
  });

  if (!orphanedImages.length) {
    console.log("No gallery images need album migration.");
    return;
  }

  const category = await prisma.galleryCategory.upsert({
    where: { slug: "experiences" },
    update: {},
    create: {
      active: true,
      name: "Experiences",
      order: 99,
      slug: "experiences",
    },
    select: { id: true },
  });

  const album = await prisma.galleryAlbum.upsert({
    where: { slug: "egypt-highlights" },
    update: {
      coverImage: orphanedImages[0]?.url || "/photos/karnak.jpg",
    },
    create: {
      active: true,
      categoryId: category.id,
      coverImage: orphanedImages[0]?.url || "/photos/karnak.jpg",
      description: "Private moments, ancient places, and Nile light captured across Egypt.",
      displayOrder: 0,
      slug: "egypt-highlights",
      title: "Egypt Highlights",
    },
    select: { id: true },
  });

  const result = await prisma.galleryImage.updateMany({
    where: { albumId: null },
    data: { albumId: album.id },
  });

  console.log(`Migrated ${result.count} gallery images into Egypt Highlights.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
