import { notFound } from "next/navigation";
import { DestinationForm } from "@/components/admin/simple-cms-forms";
import { getAdminDestination } from "@/lib/data/admin";

type EditDestinationPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = { title: "Edit Destination" };

export default async function EditDestinationPage({ params }: EditDestinationPageProps) {
  const { id } = await params;
  const destination = await getAdminDestination(id);

  if (!destination) {
    notFound();
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">
        Destinations
      </p>
      <h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">
        Edit destination
      </h1>
      <div className="mt-8">
        <DestinationForm id={destination.id} initialValues={destination} />
      </div>
    </div>
  );
}
