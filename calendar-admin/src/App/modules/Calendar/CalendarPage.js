import React, { useState } from "react";
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
import { useSelector } from "react-redux";
import CalendarCrud from "./_redux/CalendarCrud";

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

function CalendarPage(props) {
  const [isModal, setIsModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState({
    isBtnBooking: false,
  });
  const { AuthStocks, AuthUser, AuthCrStockID } = useSelector(({ Auth }) => ({
    AuthStocks: Auth.Stocks.filter((item) => item.ParentID !== 0).map(
      (item) => ({
        ...item,
        value: item.ID,
        label: item.Title,
      })
    ),
    AuthUser: Auth.User,
    AuthCrStockID: Auth.CrStockID,
  }));

  //Open Modal Booking
  const onOpenModal = () => {
    setIsModal(true);
  };

  //Edit Modal Booking
  const onHideModal = () => {
    setIsModal(false);
  };

  const onSubmitBooking = async (values) => {
    setBtnLoading((prevState) => ({ ...prevState, isBtnBooking: true }));
    const CurrentStockID = Cookies.get("StockID");
    const u_id_z4aDf2 = Cookies.get("u_id_z4aDf2");
    const dataPost = {
      booking: {
        ...values,
        MemberID: values.MemberID.value,
        RootIdS: values.RootIdS.map((item) => item.value).toString(),
        UserServiceIDs: values.UserServiceIDs.map(
          (item) => item.value
        ).toString(),
        BookDate: moment(values.BookDate).format("YYYY-MM-DD"),
      },
    };
    try {
      const data = await CalendarCrud.postBooking(dataPost, {
        CurrentStockID,
        u_id_z4aDf2,
      });
      console.log(data);
      setBtnLoading((prevState) => ({ ...prevState, isBtnBooking: false }));
      onHideModal();
    } catch (error) {
      setBtnLoading((prevState) => ({ ...prevState, isBtnBooking: true }));
      console.log(error);
    }
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
              events={[]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}
              selectable={true}
              selectMirror={true}
              eventClick={({ event, el }) => console.log(event)}
              eventContent={(arg) => {
                const { event, view } = arg;
                const { title, extendedProps } = event._def;
                let italicEl = document.createElement("div");
                italicEl.classList.add("fc-content");
                if (view.type === "listWeek") {
                  italicEl.innerHTML = `<span class="fc-title font-weight-boldest">${title}</span><div class="fc-description">${extendedProps.description}</div>`;
                } else {
                  italicEl.innerHTML = `<span class="fc-title">${title} - ${extendedProps.description}</span>`;
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
      />
    </div>
  );
}

export default CalendarPage;
