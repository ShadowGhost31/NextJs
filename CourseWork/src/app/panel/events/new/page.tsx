import EventForm from "../ui/EventForm";
import { saveEventAction } from "../../actions";
import { decodeFieldErrors } from "@/lib/validation";

export const dynamic = "force-dynamic";

export default async function NewEventPage({ searchParams }: { searchParams: any }) {
  const fieldErrors = decodeFieldErrors(searchParams?.fe);
  const formError = searchParams?.error ? String(searchParams.error) : null;

  return (
    <EventForm
      title="Створити подію"
      action={saveEventAction.bind(null, null)}
      fieldErrors={fieldErrors}
      formError={formError}
    />
  );
}
