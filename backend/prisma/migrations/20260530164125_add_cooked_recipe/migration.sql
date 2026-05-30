-- CreateTable
CREATE TABLE "cooked_recipes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "cookedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cooked_recipes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cooked_recipes" ADD CONSTRAINT "cooked_recipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cooked_recipes" ADD CONSTRAINT "cooked_recipes_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
