-- CreateTable
CREATE TABLE "recipes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "ingredients" TEXT[],
    "preparation" TEXT NOT NULL,
    "portions" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" TEXT,
    "description" TEXT,
    "photoUrl" TEXT,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
