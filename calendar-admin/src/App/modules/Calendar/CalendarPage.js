import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import ModalCalendar from "../../../components/ModalCalendar/ModalCalendar";
import SidebarCalendar from "../../../components/SidebarCalendar/SidebarCalendar";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "../../../_assets/sass/pages/_calendar.scss";
import CalendarCrud from "./_redux/CalendarCrud";
import { useWindowSize } from "../../../hooks/useWindowSize";

import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

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

const getStatusClss = (Status, item) => {
  const isAuto = item?.Desc && item.Desc.toUpperCase().indexOf("TỰ ĐỘNG ĐẶT LỊCH");
  if (Status === "XAC_NHAN") {
    if (isAuto !== "" && isAuto > -1) return "primary1";
    return "primary";
  }
  if (Status === "CHUA_XAC_NHAN") {
    return "warning";
  }
  if (Status === "KHACH_KHONG_DEN") {
    return "danger";
  }
  if (Status === "KHACH_DEN") {
    return "success";
  }
  if (Status === "doing") {
    return "info";
  }
  if (Status === "done") {
    return "secondary";
  }
};

function CalendarPage(props) {
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState({
    isBtnBooking: false,
    isBtnDelete: false,
  });
  const [isFilter, setIsFilter] = useState(false);
  const [filters, setFilters] = useState({
    Status: ["XAC_NHAN","XAC_NHAN_TU_DONG","CHUA_XAC_NHAN", "DANG_THUC_HIEN", "THUC_HIEN_XONG"],
  });
  const [initialValue, setInitialValue] = useState({});
  const [Events, setEvents] = useState([]);
  const [StaffFull, setStaffFull] = useState([]);
  const [initialView, setInitialView] = useState("dayGridMonth");
  const { width } = useWindowSize();
  const { AuthCrStockID } = useSelector(({ Auth }) => ({
    AuthCrStockID: Auth.CrStockID,
  }));

  //Get Staff Full
  useEffect(() => {
    async function getStaffFull() {
      const { data } = await CalendarCrud.getStaffs({
        StockID: AuthCrStockID,
        All: true,
      });
      const newData =
        Array.isArray(data.data) && data.data.length > 0
          ? data.data.map((item) => ({ id: item.id, title: item.text }))
          : [];
      setStaffFull(newData);
    }

    getStaffFull();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filters) {
      getBooking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const onRefresh = (callback) => {
    getBooking(() => callback && callback());
  };

  //Open Modal Booking
  const onOpenModal = () => {
    setIsModal(true);
  };

  //Edit Modal Booking
  const onHideModal = () => {
    setInitialValue({});
    setIsModal(false);
  };

  //
  const onOpenFilter = () => {
    setIsFilter(true);
  };
  //
  const onHideFilter = () => {
    setIsFilter(false);
  };

  //Get Text Toast
  const getTextToast = (Status) => {
    if (!Status) {
      return "Thêm mới lịch thành công !";
    }
    return "Cập nhập lịch thành công !";
  };

  const onSubmitBooking = async (values) => {
    setBtnLoading((prevState) => ({
      ...prevState,
      isBtnBooking: true,
    }));
    const CurrentStockID = Cookies.get("StockID");
    const u_id_z4aDf2 = Cookies.get("u_id_z4aDf2");
    const dataPost = {
      booking: [
        {
          ...values,
          MemberID: values.MemberID.value,
          RootIdS: values.RootIdS.map((item) => item.value).toString(),
          UserServiceIDs:
            values.UserServiceIDs && values.UserServiceIDs.length > 0
              ? values.UserServiceIDs.map((item) => item.value).toString()
              : "",
          BookDate: moment(values.BookDate).format("YYYY-MM-DD HH:mm"),
          Status: values.Status ? values.Status : "XAC_NHAN",
        },
      ],
    };
    try {
      await CalendarCrud.postBooking(dataPost, {
        CurrentStockID,
        u_id_z4aDf2,
      });
      getBooking(() => {
        toast.success(getTextToast(values.Status), {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        });
        setBtnLoading((prevState) => ({
          ...prevState,
          isBtnBooking: false,
        }));
        onHideModal();
      });
    } catch (error) {
      setBtnLoading((prevState) => ({
        ...prevState,
        isBtnBooking: false,
      }));
    }
  };

  const onDeleteBooking = async (values) => {
    setBtnLoading((prevState) => ({
      ...prevState,
      isBtnDelete: true,
    }));
    const CurrentStockID = Cookies.get("StockID");
    const u_id_z4aDf2 = Cookies.get("u_id_z4aDf2");
    const dataPost = {
      booking: [
        {
          ...values,
          MemberID: values.MemberID.value,
          RootIdS: values.RootIdS.map((item) => item.value).toString(),
          UserServiceIDs:
            values.UserServiceIDs && values.UserServiceIDs.length > 0
              ? values.UserServiceIDs.map((item) => item.value).toString()
              : "",
          BookDate: moment(values.BookDate).format("YYYY-MM-DD HH:mm"),
          Status: "TU_CHOI",
        },
      ],
    };

    try {
      await CalendarCrud.postBooking(dataPost, {
        CurrentStockID,
        u_id_z4aDf2,
      });
      getBooking(() => {
        toast.success("Hủy lịch thành công !", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        });
        setBtnLoading((prevState) => ({
          ...prevState,
          isBtnDelete: false,
        }));
        onHideModal();
      });
    } catch (error) {
      setBtnLoading((prevState) => ({
        ...prevState,
        isBtnDelete: false,
      }));
    }
  };

  const getFiltersBooking = (values) => {
    setFilters(values);
  };

  const checkStar = (item) => {
    if (item?.Member?.MobilePhone !== "0000000000") return "";
    if (item?.Member?.MobilePhone === "0000000000" && item?.IsNew) return "**"
    else {
      return "*"
    }
  }

  const getBooking = (fn) => {
    !loading && setLoading(true);
    const newFilters = {
      ...filters,
      MemberID:
        filters.MemberID && Array.isArray(filters.MemberID)
          ? filters.MemberID.map((item) => item.value).toString()
          : "",
      From: filters.From ? moment(filters.From).format("YYYY-MM-DD") : "",
      To: filters.To ? moment(filters.To).format("YYYY-MM-DD") : "",
      Status:
        filters.Status && filters.Status.length > 0
          ? filters.Status.join(",")
          : "",
      UserServiceIDs:
        filters.UserServiceIDs && Array.isArray(filters.UserServiceIDs)
          ? filters.UserServiceIDs.map((item) => item.value).toString()
          : "",
    };
    CalendarCrud.getBooking(newFilters)
      .then(({ data }) => {
        const dataBooks =
          data.books && Array.isArray(data.books)
            ? data.books
                .map((item) => ({
                  ...item,
                  start: item.BookDate,
                  title: item.RootTitles,
                  className: `fc-event-solid-${getStatusClss(
                    item.Status,
                    item
                  )}`,
                  resourceIds:
                    item.UserServices &&
                    Array.isArray(item.UserServices) &&
                    item.UserServices.length > 0
                      ? item.UserServices.map((item) => item.ID)
                      : [],
                  MemberCurrent: {
                    FullName: item?.FullName || item?.Member?.FullName,
                    MobilePhone: item?.Phone || item?.Member?.MobilePhone,
                  },
                  Star: checkStar(item)
                }))
                .filter((item) => item.Status !== "TU_CHOI")
            : [];
        const dataBooksAuto =
          data.osList && Array.isArray(data.osList)
            ? data.osList.map((item) => ({
                ...item,
                AtHome: false,
                Member: item.member,
                MemberCurrent: {
                  FullName: item?.member?.FullName,
                  MobilePhone: item?.member?.MobilePhone,
                },
                start: item.os.BookDate,
                BookDate: item.os.BookDate,
                title: item.os.Title,
                RootTitles: item.os.ProdService2 || item.os.ProdService,
                className: `fc-event-solid-${getStatusClss(item.os.Status)}`,
                resourceIds:
                  item.staffs && Array.isArray(item.staffs)
                    ? item.staffs.map((staf) => staf.ID)
                    : [],
              }))
            : [];
        setEvents([...dataBooks, ...dataBooksAuto]);
        setLoading(false);
        fn && fn();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="ezs-calendar">
      <div className="container-fluid h-100 py-3">
        <div className="d-flex flex-column flex-lg-row h-100">
          <SidebarCalendar
            filters={filters}
            onOpenModal={onOpenModal}
            onSubmit={getFiltersBooking}
            initialView={initialView}
            loading={loading}
            onOpenFilter={onOpenFilter}
            onHideFilter={onHideFilter}
            isFilter={isFilter}
          />
          <div className="ezs-calendar__content">
            <FullCalendar
              themeSystem="unthemed"
              locale={viLocales}
              initialDate={TODAY}
              initialView={width > 991 ? initialView : "timeGridDay"}
              schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
              aspectRatio="3"
              editable={false}
              navLinks={true}
              allDaySlot={false}
              firstDay={1}
              views={{
                dayGridMonth: {
                  dayMaxEvents: 2,
                },
                timeGridWeek: {
                  eventMaxStack: 2,
                },
                timeGridDay: {
                  eventMaxStack: 8,
                  nowIndicator: true,
                  now: moment(new Date()).format("YYYY-MM-DD HH:mm"),
                  scrollTime: moment(new Date()).format("HH:mm"),
                  slotMinWidth: "50",
                },
                // resourceTimeGridDay: {
                //   type: "resourceTimeline",
                //   buttonText: "Nhân viên",
                //   resourceAreaHeaderContent: () => "Danh sách nhân viên",
                //   nowIndicator: true,
                //   now: moment(new Date()).format("YYYY-MM-DD HH:mm"),
                //   scrollTime: moment(new Date()).format("HH:mm"),
                //   //duration: { days: 4 },
                // },
                resourceTimelineDay: {
                  type: "resourceTimeline",
                  buttonText: "Nhân viên",
                  resourceAreaHeaderContent: () => "Nhân viên",
                  nowIndicator: true,
                  now: moment(new Date()).format("YYYY-MM-DD HH:mm"),
                  scrollTime: moment(new Date()).format("HH:mm"),
                  resourceAreaWidth: "160px",
                  slotMinWidth: "50",
                  //duration: { days: 4 },
                },
              }}
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin,
                listPlugin,
                resourceTimeGridPlugin,
                resourceTimelinePlugin,
              ]}
              resources={StaffFull}
              events={Events}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right:
                  "dayGridMonth,timeGridWeek,timeGridDay,listWeek,resourceTimelineDay", //resourceTimeGridDay
              }}
              selectable={true}
              selectMirror={true}
              moreLinkContent={({ num, view }) => {
                if (
                  view.type === "timeGridWeek" ||
                  view.type === "timeGridDay"
                ) {
                  return <>+ {num}</>;
                }
                return <>Xem thêm + {num}</>;
              }}
              eventClick={({ event, el }) => {
                const { _def } = event;
                if (_def.extendedProps.os) {
                  window?.top?.BANGLICH_BUOI &&
                    window?.top?.BANGLICH_BUOI(_def.extendedProps, onRefresh);
                  return;
                }
                setInitialValue(_def.extendedProps);
                onOpenModal();
              }}
              eventContent={(arg) => {
                const { event } = arg;
                const { extendedProps } = event._def;
                let italicEl = document.createElement("div");
                italicEl.classList.add("fc-content");

                if (
                  typeof extendedProps !== "object" ||
                  Object.keys(extendedProps).length > 0
                ) {
                  italicEl.innerHTML = `<div class="fc-title">
                    <div><span class="fullname">${
                      extendedProps.AtHome
                        ? `<i class="fas fa-home text-white font-size-xs"></i>`
                        : ""
                    } ${extendedProps.Star ? `(${extendedProps.Star})` : ""} ${
                    extendedProps.MemberCurrent.FullName
                  }</span><span class="d-none d-md-inline"> - ${
                    extendedProps.MemberCurrent?.MobilePhone
                  }</span></div>
                    <div class="d-flex">
                      <div class="w-45px">${moment(
                        extendedProps.BookDate
                      ).format("HH:mm")} - </div>
                      <div class="flex-1 text-truncate">${
                        extendedProps.RootTitles
                      }</div>
                    </div>
                  </div>`;
                } else {
                  italicEl.innerHTML = `<div class="fc-title">
                    Không có lịch
                  </div>`;
                }
                let arrayOfDomNodes = [italicEl];
                return {
                  domNodes: arrayOfDomNodes,
                };
              }}
              dayCellDidMount={(info) => {
                //info.el.innerHTML = "Test";
                //const elmParent = info.el;
              }}
              eventDidMount={(arg) => {
                const { view } = arg;
                //Set View Calendar
                setInitialView(view.type);
              }}
              datesSet={({ view, start, end, ...dgs }) => {
                const newFilters = {
                  ...filters,
                  StockID: AuthCrStockID,
                };
                if (view.type === "dayGridMonth") {
                  const monthCurrent = moment(end).subtract(1, "month");
                  const startOfMonth = moment(monthCurrent)
                    .startOf("month")
                    .format("YYYY-MM-DD");
                  const endOfMonth = moment(monthCurrent)
                    .endOf("month")
                    .format("YYYY-MM-DD");
                  newFilters.From = startOfMonth;
                  newFilters.To = endOfMonth;
                }
                if (view.type === "timeGridWeek" || view.type === "listWeek") {
                  newFilters.From = moment(start).format("YYYY-MM-DD");
                  newFilters.To = moment(end)
                    .subtract(1, "days")
                    .format("YYYY-MM-DD");
                }
                if (
                  view.type !== "dayGridMonth" &&
                  view.type !== "timeGridWeek" &&
                  view.type !== "listWeek"
                ) {
                  newFilters.From = moment(start).format("YYYY-MM-DD");
                  newFilters.To = moment(start).format("YYYY-MM-DD");
                }
                setFilters(newFilters);
              }}
            />
          </div>
        </div>
      </div>
      <ModalCalendar
        show={isModal}
        onHide={onHideModal}
        onSubmit={onSubmitBooking}
        onDelete={onDeleteBooking}
        btnLoading={btnLoading}
        initialValue={initialValue}
      />
    </div>
  );
}

export default CalendarPage;
