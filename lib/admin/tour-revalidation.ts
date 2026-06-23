import { revalidatePath } from "next/cache";

export function revalidateTourPublicPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath("/activities");
  revalidatePath("/hotels");
  revalidatePath("/tours/[slug]", "page");

  if (slug) {
    revalidatePath(`/tours/${slug}`);
  }
}
