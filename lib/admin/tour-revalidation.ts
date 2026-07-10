import { revalidatePath } from "next/cache";

export function revalidateTourPublicPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath("/activities");
  revalidatePath("/hotels");
  revalidatePath("/tours/[slug]", "page");
  revalidatePath("/activities/[slug]", "page");
  revalidatePath("/hotels/[slug]", "page");

  if (slug) {
    revalidatePath(`/tours/${slug}`);
    revalidatePath(`/activities/${slug}`);
    revalidatePath(`/hotels/${slug}`);
  }
}
