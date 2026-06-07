import { prisma } from "@/lib/prisma";

export function hasConfiguredDatabase() {
  const url = process.env.DATABASE_URL;
  return Boolean(url && !url.includes("postgres:postgres@localhost:5432/jack_tours_luxor"));
}

export async function tryDatabase<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  if (!hasConfiguredDatabase()) {
    return fallback;
  }

  try {
    return await operation();
  } catch (error) {
    console.warn("Database unavailable; using static fallback.", error);
    return fallback;
  }
}

export { prisma };
