-- CreateTable
CREATE TABLE "reset_password_codes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "reset_password_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reset_password_codes_userId_key" ON "reset_password_codes"("userId");

-- AddForeignKey
ALTER TABLE "reset_password_codes" ADD CONSTRAINT "reset_password_codes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
