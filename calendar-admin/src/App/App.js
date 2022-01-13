import React from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import CalendarPage from "./modules/Calendar/CalendarPage";

function App({ store, basename }) {
  return (
    <Provider store={store}>
      <CalendarPage />
      <ToastContainer />
    </Provider>
  );
}

export default App;
