import { prisma } from "@/lib/prisma";
import { ageFrom, completeness, parseInterests } from "@/lib/profile-fields";

/**
 * Database-backed profile reads.
 *
 * The vocabulary and pure helpers live in lib/profile-fields.ts and are
 * re-exported here for convenience, so server code has one import while the
 * client form can pull only the pure half.
 */
export * from "@/lib/profile-fields";

/** The profile plus everything derived from it. */
export async function getProfile(userId: string) {
  const [user, profile] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.profile.findUnique({
      where: { userId },
      include: {
        accolades: { orderBy: [{ year: "desc" }, { createdAt: "desc" }] },
      },
    }),
  ]);

  if (!user) return null;

  return {
    user,
    profile,
    age: ageFrom(profile?.dateOfBirth),
    interests: parseInterests(profile?.interests),
    completeness: completeness(profile),
  };
}
