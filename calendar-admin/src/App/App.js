import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import BookingPage from "./modules/Booking/BookingPage";
import CalendarPage from "./modules/Calendar/CalendarPage";

function App({ store, basename }) {
  const [isBooking, setIsBooking] = useState(false);
  useEffect(() => {
    const URL_STRING = window.location.href;
    var URL_NEW = new URL(URL_STRING);
    var IsPop = URL_NEW.searchParams.get("ispop");
    if (IsPop) {
      setIsBooking(true);
    }
  }, [])
  return (
    <Provider store={store}>
      {!isBooking && <CalendarPage />}
      {isBooking && <BookingPage />}
      <ToastContainer />
    </Provider>
  );
}

export default App;
