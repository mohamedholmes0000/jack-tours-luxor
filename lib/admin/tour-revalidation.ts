import { revalidatePath } from "next/cache";

export function revalidateTourPublicPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath("/tours/[slug]", "page");

  if (slug) {
    revalidatePath(`/tours/${slug}`);
  }
}
