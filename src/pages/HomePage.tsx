import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { Event } from "../interface";
import { api } from "../api/Api";
import Loader from "../components/Loader";

const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getEvents = async () => {
    try {
      const response = await api({
        path: "events",
      });

      setEvents(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);
  return (
    <>
      {isLoading ? (
       <Loader/>
      ) : (
        <div className="min-h-screen bg-slate-50">
          <section className="mx-auto max-w-7xl px-6 py-12">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-900">
                Upcoming Events
              </h2>

              <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700">
                {events.length} Events
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default HomePage;
