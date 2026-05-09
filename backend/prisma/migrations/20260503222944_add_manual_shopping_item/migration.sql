-- CreateTable
CREATE TABLE "manual_shopping_items" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Outros',
    "bought" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manual_shopping_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "manual_shopping_items_userId_idx" ON "manual_shopping_items"("userId");

-- AddForeignKey
ALTER TABLE "manual_shopping_items" ADD CONSTRAINT "manual_shopping_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
