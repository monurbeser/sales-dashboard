-- CreateTable
CREATE TABLE "SalesManager" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fullName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesManager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesTarget" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "managerId" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "amount" NUMERIC(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesActual" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "managerId" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "amount" NUMERIC(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesActual_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SalesTarget_managerId_year_month_key" ON "SalesTarget"("managerId", "year", "month");

-- CreateIndex
CREATE INDEX "SalesTarget_year_month_idx" ON "SalesTarget"("year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "SalesActual_managerId_year_month_key" ON "SalesActual"("managerId", "year", "month");

-- CreateIndex
CREATE INDEX "SalesActual_year_month_idx" ON "SalesActual"("year", "month");

-- AddForeignKey
ALTER TABLE "SalesTarget" ADD CONSTRAINT "SalesTarget_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "SalesManager"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesActual" ADD CONSTRAINT "SalesActual_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "SalesManager"("id") ON DELETE CASCADE ON UPDATE CASCADE;
