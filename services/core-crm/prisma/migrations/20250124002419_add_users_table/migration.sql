-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "oryIdentityId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_oryIdentityId_key" ON "User"("oryIdentityId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
