import EventForm from "../ui/EventForm";
import { saveEventAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  return (
    <EventForm
      title="Створити подію"
      action={saveEventAction.bind(null, null)}
    />
  );
}
