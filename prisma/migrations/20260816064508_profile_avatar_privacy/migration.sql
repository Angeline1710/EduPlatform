-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "headline" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "dateOfBirth" DATETIME,
    "phone" TEXT,
    "country" TEXT,
    "city" TEXT,
    "timezone" TEXT,
    "pronouns" TEXT,
    "languages" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "educationLevel" TEXT,
    "fieldOfStudy" TEXT,
    "institution" TEXT,
    "graduationYear" INTEGER,
    "occupation" TEXT,
    "experienceLevel" TEXT,
    "interests" TEXT,
    "goals" TEXT,
    "weeklyHours" INTEGER,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "websiteUrl" TEXT,
    "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Profile" ("avatarUrl", "bio", "city", "country", "createdAt", "dateOfBirth", "educationLevel", "experienceLevel", "fieldOfStudy", "githubUrl", "goals", "graduationYear", "headline", "id", "institution", "interests", "linkedinUrl", "marketingOptIn", "occupation", "phone", "updatedAt", "userId", "websiteUrl", "weeklyHours") SELECT "avatarUrl", "bio", "city", "country", "createdAt", "dateOfBirth", "educationLevel", "experienceLevel", "fieldOfStudy", "githubUrl", "goals", "graduationYear", "headline", "id", "institution", "interests", "linkedinUrl", "marketingOptIn", "occupation", "phone", "updatedAt", "userId", "websiteUrl", "weeklyHours" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
