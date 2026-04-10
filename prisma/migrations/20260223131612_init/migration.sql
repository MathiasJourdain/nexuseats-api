-- CreateEnum
CREATE TYPE "CuisineType" AS ENUM ('ITALIAN', 'JAPANESE', 'FRENCH', 'BURGER', 'STREET_FOOD');

-- CreateTable
CREATE TABLE "restaurants" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cuisine" "CuisineType" NOT NULL,
    "address" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "restaurantId" INTEGER NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_items" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "menuId" INTEGER NOT NULL,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToMenuItem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoryToMenuItem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "restaurants_cuisine_idx" ON "restaurants"("cuisine");

-- CreateIndex
CREATE INDEX "restaurants_rating_idx" ON "restaurants"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE INDEX "_CategoryToMenuItem_B_index" ON "_CategoryToMenuItem"("B");

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToMenuItem" ADD CONSTRAINT "_CategoryToMenuItem_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToMenuItem" ADD CONSTRAINT "_CategoryToMenuItem_B_fkey" FOREIGN KEY ("B") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
