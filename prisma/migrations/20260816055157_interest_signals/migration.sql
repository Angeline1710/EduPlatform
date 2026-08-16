-- CreateTable
CREATE TABLE "Signal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "anonId" TEXT,
    "kind" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "courseId" TEXT,
    "category" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Signal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Signal_userId_createdAt_idx" ON "Signal"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Signal_anonId_createdAt_idx" ON "Signal"("anonId", "createdAt");

-- CreateIndex
CREATE INDEX "Signal_kind_createdAt_idx" ON "Signal"("kind", "createdAt");
