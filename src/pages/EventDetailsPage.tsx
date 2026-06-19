import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { api } from "../api/Api";
import { Event } from "../interface";
import toast from "react-hot-toast";

const seats = Array.from({ length: 120 }, (_, index) => ({
  id: index + 1,
  seatNumber: `A${index + 1}`,
  status: "available",
}));

const EventDetailsPage = () => {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const { id } = useParams();
  const [event, setEvents] = useState<Event>();
  const [isLoading, setIsLoading] = useState(true);
  const [isReserveLoading, setIsReserveLoading] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [reservationId, setReservationId] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);

  const getEvent = async () => {
    try {
      const response = await api({
        path: `events/${id}`,
      });

      setEvents(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getReservationAndBookingStatus = async () => {
    try {
      const response = await api({
        path: `events/${id}/seats`,
      });

      setBookedSeats(response.bookedSeats || []);

      const reservation = response.reservation;

      if (!reservation) return;

      setReservationId(reservation._id);

      setReservedSeats(reservation.seatNumbers);

      const remainingTime = Math.floor(
        (new Date(reservation.expiresAt).getTime() - Date.now()) / 1000,
      );

      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
      }
    } catch (error: any) {
      //toast.error(error.message);
      console.log(error);
    }
  };
  const handleReserveSeats = async () => {
    if (!localStorage.getItem("isLogin") || false) {
      navigate("/login");
    }
    try {
      setIsReserveLoading(true);

      const response = await api({
        path: "reservations",
        method: "POST",
        body: {
          eventId: id,
          seatNumbers: selectedSeats,
        },
      });

      setReservationId(response.reservation._id);
      setReservedSeats((prev) => [...prev, ...selectedSeats]);

      setSelectedSeats([]);

      setTimeLeft(600);
      toast.success("Seats reserved successfully");
    } catch (error: any) {
      toast.error(error.message);

      console.log(error);
    } finally {
      setIsReserveLoading(false);
    }
  };

  const handleBooking = async () => {
    try {
      setIsBookingLoading(true);

      await api({
        path: "bookings",
        method: "POST",
        body: {
          reservationId,
        },
      });
      setBookedSeats((prev) => [...prev, ...reservedSeats]);

      setReservedSeats([]);

      setReservationId("");

      setTimeLeft(0);
      toast.success("Booking successful");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsBookingLoading(false);
    }
  };
  useEffect(() => {
    getEvent();
    getReservationAndBookingStatus();
  }, []);

  const handleSeatSelect = (seatNumber: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((seat) => seat !== seatNumber)
        : [...prev, seatNumber],
    );
  };

  useEffect(() => {
    if (!reservationId) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          setReservationId("");
          setReservedSeats([]);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [reservationId]);

  const getSeatColor = (
    isSelected: boolean,
    isReserved: boolean,
    isBooked: boolean,
  ) => {
    if (isBooked) {
      return "cursor-not-allowed bg-red-500 text-white border-red-500";
    }
    if (isReserved) {
      return "cursor-not-allowed bg-yellow-500 text-white border-yellow-500";
    }

    if (isSelected) {
      return "bg-blue-500 text-white border-blue-500";
    }

    return "border-green-500 text-green-600 hover:bg-green-50";
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-slate-50 p-3 sm:p-6">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr]">
            <div className="order-2 space-y-6 lg:order-1">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <img
                  src={event?.image}
                  alt="event"
                  className="h-40 w-full rounded-xl object-cover sm:h-52"
                />

                <h2 className="mt-4 text-xl font-bold">{event?.name}</h2>

                <p className="mt-2 text-slate-600">{event?.venue}</p>

                <p className="text-slate-600">
                  {" "}
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

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="mb-4 font-semibold">Seat Legend</h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded bg-green-500" />
                    <span>Available</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded bg-blue-500" />
                    <span>Selected</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded bg-yellow-500" />
                    <span>Reserved</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded bg-red-500" />
                    <span>Booked</span>
                  </div>
                </div>
              </div>

              <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="font-semibold">Selected Seats</h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedSeats.length ? (
                    selectedSeats.map((seat) => (
                      <span
                        key={seat}
                        className="rounded-lg bg-violet-100 px-3 py-1 text-sm text-violet-700"
                      >
                        {seat}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No seats selected</p>
                  )}
                </div>

                <button
                  onClick={handleReserveSeats}
                  disabled={!selectedSeats.length || isReserveLoading}
                  className="cursor-pointer mt-5 w-full rounded-xl bg-violet-600 py-3 font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isReserveLoading ? "Reserving..." : "Reserve Seats"}
                </button>

                {reservationId && (
                  <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-center">
                    <p className="text-sm font-medium text-yellow-700">
                      Reservation expires in
                    </p>

                    <p className="mt-2 text-3xl font-bold text-yellow-900">
                      {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                      {String(timeLeft % 60).padStart(2, "0")}
                    </p>

                    <button
                      onClick={handleBooking}
                      disabled={isBookingLoading}
                      className="cursor-pointer mt-4 w-full rounded-xl bg-green-600 py-3 font-medium text-white disabled:bg-slate-300"
                    >
                      {isBookingLoading ? "Booking..." : "Confirm Booking"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="order-1 rounded-2xl bg-white p-4 shadow-sm lg:order-2 lg:p-6 max-h-[50vh] md:max-h-screen overflow-y-auto">
              <div className="grid grid-cols-5 gap-3 md:grid-cols-10">
                {seats.map((seat) => {
                  const isSelected = selectedSeats.includes(seat.seatNumber);
                  const isReserved = reservedSeats.includes(seat.seatNumber);
                  const isBooked = bookedSeats.includes(seat.seatNumber);
                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatSelect(seat.seatNumber)}
                      className={`cursor-pointer h-10 rounded-lg border text-xs font-medium transition sm:h-12 sm:text-sm ${getSeatColor(
                        isSelected,
                        isReserved,
                        isBooked,
                      )}`}
                    >
                      {seat.seatNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetailsPage;
