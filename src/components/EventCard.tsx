import { useNavigate } from "react-router-dom";
import { Event } from "../interface";
interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <img
          src={event.image}
          alt={event.name}
          className="h-56 w-full object-cover"
        />

        <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-sm font-semibold text-violet-600 shadow">
          Live Event
        </div>
      </div>

      <div className="p-5">
        <h2 className="mb-2 text-xl font-bold text-slate-900">{event.name}</h2>

        <div className="space-y-2 text-sm text-slate-600">
          <p>📍 {event.venue}</p>
          <p>
            📅{" "}
            {event?.dateTime &&
              new Date(event?.dateTime).toLocaleString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
          </p>
        </div>

        <button
          onClick={() => navigate(`/event/${event._id}`)}
          className="cursor-pointer mt-5 w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-700"
        >
          View Seats
        </button>
      </div>
    </div>
  );
};

export default EventCard;
