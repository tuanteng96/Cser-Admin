import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
//import viLocale from "@fullcalendar/core/locales/vi";
import "../_assets/sass/pages/_calendar.scss";
import SidebarCalendar from "../components/SidebarCalendar/SidebarCalendar";
import ModalCalendar from "../components/ModalCalendar/ModalCalendar";

var todayDate = moment().startOf("day");
var YM = todayDate.format("YYYY-MM");
var YESTERDAY = todayDate
  .clone()
  .subtract(1, "day")
  .format("YYYY-MM-DD");
var TODAY = todayDate.format("YYYY-MM-DD");
var TOMORROW = todayDate
  .clone()
  .add(1, "day")
  .format("YYYY-MM-DD");

const viLocales = {
  code: "vi",
  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 6, // The week that contains Jan 1st is the first week of the year.
  },
  buttonText: {
    prev: "Tháng trước",
    next: "Tháng sau",
    today: "Hôm nay",
    month: "Tháng",
    week: "Tuần",
    day: "Ngày",
    list: "Danh sách",
  },
  weekText: "Sm",
  allDayText: "Cả ngày",
  moreLinkText: "más",
  noEventsText: "No hay eventos para mostrar",
};

function App() {
  const [isModal, setIsModal] = useState(false);

  const onOpenModal = () => {
    setIsModal(true);
  };

  const onHideModal = () => {
    setIsModal(false);
  };

  return (
    <div className="ezs-calendar">
      <div className="container-fluid h-100">
        <div className="d-flex h-100">
          <SidebarCalendar onOpenModal={onOpenModal} />
          <div className="ezs-calendar__content">
            <FullCalendar
              themeSystem="unthemed"
              locale={viLocales}
              initialDate={TODAY}
              initialView="dayGridMonth"
              aspectRatio="3"
              editable={true}
              navLinks={true}
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin,
                listPlugin,
              ]}
              events={[
                {
                  title: "All Day Event",
                  start: YM + "-01",
                  description: "Toto lorem ipsum dolor sit incid idunt ut",
                  className: "fc-event-danger fc-event-solid-warning",
                },
                {
                  title: "Reporting",
                  start: YM + "-14T13:30:00",
                  description: "Lorem ipsum dolor incid idunt ut labore",
                  end: YM + "-14",
                  className: "fc-event-success",
                },
                {
                  title: "Company Trip",
                  start: YM + "-02",
                  description: "Lorem ipsum dolor sit tempor incid",
                  end: YM + "-03",
                  className: "fc-event-primary",
                },
                {
                  title: "ICT Expo 2017 - Product Release",
                  start: YM + "-03",
                  description: "Lorem ipsum dolor sit tempor inci",
                  end: YM + "-05",
                  className: "fc-event-light fc-event-solid-primary",
                },
                {
                  title: "Dinner",
                  start: YM + "-12",
                  description: "Lorem ipsum dolor sit amet, conse ctetur",
                  end: YM + "-10",
                },
                {
                  id: 999,
                  title: "Repeating Event",
                  start: YM + "-09T16:00:00",
                  description: "Lorem ipsum dolor sit ncididunt ut labore",
                  className: "fc-event-danger",
                },
                {
                  id: 1000,
                  title: "Repeating Event",
                  description: "Lorem ipsum dolor sit amet, labore",
                  start: YM + "-16T16:00:00",
                },
                {
                  title: "Conference",
                  start: YESTERDAY,
                  end: TOMORROW,
                  description: "Lorem ipsum dolor eius mod tempor labore",
                  className: "fc-event-primary",
                },
                {
                  title: "Meeting",
                  start: TODAY + "T10:30:00",
                  end: TODAY + "T12:30:00",
                  description: "Lorem ipsum dolor eiu idunt ut labore",
                },
                {
                  title: "Lunch",
                  start: TODAY + "T12:00:00",
                  className: "fc-event-info",
                  description: "Lorem ipsum dolor sit amet, ut labore",
                },
                {
                  title: "Meeting",
                  start: TODAY + "T14:30:00",
                  className: "fc-event-warning",
                  description: "Lorem ipsum conse ctetur adipi scing",
                },
                {
                  title: "Happy Hour",
                  start: TODAY + "T17:30:00",
                  className: "fc-event-info",
                  description: "Lorem ipsum dolor sit amet, conse ctetur",
                },
                {
                  title: "Dinner",
                  start: TOMORROW + "T05:00:00",
                  className: "fc-event-solid-danger fc-event-light",
                  description: "Lorem ipsum dolor sit ctetur adipi scing",
                },
                {
                  title: "Birthday Party",
                  start: TOMORROW + "T07:00:00",
                  className: "fc-event-primary",
                  description: "Lorem ipsum dolor sit amet, scing",
                },
                {
                  title: "Click for Google",
                  url: "http://google.com/",
                  start: YM + "-28",
                  className: "fc-event-solid-info fc-event-light",
                  description: "Lorem ipsum dolor sit amet, labore",
                },
              ]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}
              selectable={true}
              selectMirror={true}
              eventContent={(arg) => {
                const { event, view } = arg;
                const { title, extendedProps } = event._def;
                let italicEl = document.createElement("div");
                italicEl.classList.add("fc-content");
                if (view.type === "listWeek") {
                  italicEl.innerHTML = `<span class="fc-title font-weight-boldest">${title}</span><div class="fc-description">${extendedProps.description}</div>`;
                } else {
                  italicEl.innerHTML = `<span class="fc-title">${title}</span>`;
                }

                let arrayOfDomNodes = [italicEl];
                return { domNodes: arrayOfDomNodes };
              }}
              eventDidMount={(info) => {
                return "ABC";
              }}
            />
          </div>
        </div>
      </div>
      <ModalCalendar show={isModal} onHide={onHideModal} />
    </div>
  );
}

export default App;
