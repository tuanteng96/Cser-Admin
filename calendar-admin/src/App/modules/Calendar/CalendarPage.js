import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import ModalCalendar from "../../../components/ModalCalendar/ModalCalendar";
import SidebarCalendar from "../../../components/SidebarCalendar/SidebarCalendar";
import Cookies from "js-cookie";
import moment from "moment";
import "../../../_assets/sass/pages/_calendar.scss";
import CalendarCrud from "./_redux/CalendarCrud";

var todayDate = moment().startOf("day");
// var YM = todayDate.format("YYYY-MM");
// var YESTERDAY = todayDate
//   .clone()
//   .subtract(1, "day")
//   .format("YYYY-MM-DD");
var TODAY = todayDate.format("YYYY-MM-DD");
// var TOMORROW = todayDate
//   .clone()
//   .add(1, "day")
//   .format("YYYY-MM-DD");

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
  moreLinkText: "Xem thêm",
  noEventsText: "Không có dịch vụ",
};

const getStatusClss = (Status) => {
  if (Status === "XAC_NHAN") {
    return "primary";
  }
  if (Status === "CHUA_XAC_NHAN") {
    return "warning";
  }
  return "danger";
};

function CalendarPage(props) {
  const [isModal, setIsModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState({
    isBtnBooking: false,
  });
  const [filters, setFilters] = useState(null);
  const [initialValue, setInitialValue] = useState({});
  const [Events, setEvents] = useState([]);

  useEffect(() => {
    if (filters) {
      getBooking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  //Open Modal Booking
  const onOpenModal = () => {
    setIsModal(true);
  };

  //Edit Modal Booking
  const onHideModal = () => {
    setInitialValue({});
    setIsModal(false);
  };

  const onSubmitBooking = async (values) => {
    setBtnLoading((prevState) => ({ ...prevState, isBtnBooking: true }));
    const CurrentStockID = Cookies.get("StockID");
    const u_id_z4aDf2 = Cookies.get("u_id_z4aDf2");
    const dataPost = {
      booking: [
        {
          ...values,
          MemberID: values.MemberID.value,
          RootIdS: values.RootIdS.map((item) => item.value).toString(),
          UserServiceIDs: values.UserServiceIDs.map(
            (item) => item.value
          ).toString(),
          BookDate: moment(values.BookDate).format("YYYY-MM-DD HH:mm"),
        },
      ],
    };
    try {
      await CalendarCrud.postBooking(dataPost, {
        CurrentStockID,
        u_id_z4aDf2,
      });
      getBooking(() => {
        setBtnLoading((prevState) => ({ ...prevState, isBtnBooking: false }));
        onHideModal();
      });
    } catch (error) {
      setBtnLoading((prevState) => ({ ...prevState, isBtnBooking: true }));
    }
  };

  const getFiltersBooking = (values) => {
    setFilters(values);
  };

  const getBooking = (fn) => {
    const newFilters = {
      ...filters,
      From: filters.From ? moment(filters.From).format("YYYY-MM-DD") : "",
      To: filters.To ? moment(filters.To).format("YYYY-MM-DD") : "",
      Status: filters.Status ? filters.Status.value : "",
      UserServiceIDs:
        filters.UserServiceIDs && Array.isArray(filters.UserServiceIDs)
          ? filters.UserServiceIDs.map((item) => item.value).toString()
          : "",
    };
    CalendarCrud.getBooking(newFilters)
      .then(({ data }) => {
        const dataBooks = data.books.map((item) => ({
          ...item,
          start: item.BookDate,
          title: item.RootTitles,
          className: `fc-event-solid-${getStatusClss(item.Status)}`,
        }));
        setEvents(dataBooks);
        fn && fn();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="ezs-calendar">
      <div className="container-fluid h-100">
        <div className="d-flex h-100">
          <SidebarCalendar
            filters={filters}
            onOpenModal={onOpenModal}
            onSubmit={getFiltersBooking}
          />
          <div className="ezs-calendar__content">
            <FullCalendar
              themeSystem="unthemed"
              locale={viLocales}
              initialDate={TODAY}
              initialView="dayGridMonth"
              aspectRatio="3"
              editable={false}
              navLinks={true}
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin,
                listPlugin,
              ]}
              events={Events}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}
              selectable={true}
              selectMirror={true}
              eventClick={({ event, el }) => {
                const { _def } = event;
                setInitialValue(_def.extendedProps);
                onOpenModal();
              }}
              eventContent={(arg) => {
                const { event, view } = arg;
                const { title, extendedProps } = event._def;
                let italicEl = document.createElement("div");
                italicEl.classList.add("fc-content");
                if (view.type === "listWeek") {
                  italicEl.innerHTML = `<span class="fc-title font-weight-boldest">${title}</span><div class="fc-description">${extendedProps.description}</div>`;
                } else {
                  italicEl.innerHTML = `<div class="fc-title">
                    <div>${extendedProps.Member.FullName} - ${
                    extendedProps.Member.MobilePhone
                  }</div>
                    <div class="d-flex">
                      <div class="w-55px">${moment(
                        extendedProps.BookDate
                      ).format("HH:mm")} - </div>
                      <div class="w-100 text-truncate">${
                        extendedProps.RootTitles
                      }</div>
                    </div>
                  </div>`;
                }

                let arrayOfDomNodes = [italicEl];
                return {
                  domNodes: arrayOfDomNodes,
                };
              }}
              eventDidMount={(info) => {
                return "ABC";
              }}
            />
          </div>
        </div>
      </div>
      <ModalCalendar
        show={isModal}
        onHide={onHideModal}
        onSubmit={onSubmitBooking}
        btnLoading={btnLoading}
        initialValue={initialValue}
      />
    </div>
  );
}

export default CalendarPage;
