import React from "react";
import { Provider } from "react-redux";
import CalendarPage from "./modules/Calendar/CalendarPage";

function App({ store, basename }) {
  return (
    <Provider store={store}>
      <CalendarPage />
    </Provider>
  );
}

export default App;
