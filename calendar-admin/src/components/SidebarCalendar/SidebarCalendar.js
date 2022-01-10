import React from "react";
import PropTypes from "prop-types";
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";

SidebarCalendar.propTypes = {
  onOpenModal: PropTypes.func,
};
SidebarCalendar.defaultProps = {
  onOpenModal: null,
};

const StatusArr = [
  {
    value: "",
    label: "Đã xác nhận",
    color: "#3699FF",
  },
  {
    value: "",
    label: "Chưa xác nhận",
    color: "#FFA800",
  },
  {
    value: "",
    label: "Đặt nhưng không đến",
    color: "#F64E60",
  },
  {
    value: "",
    label: "Đang thực hiện",
    color: "#1BC5BD",
  },
  {
    value: "",
    label: "Hoàn thành",
    color: "#B5B5C3",
  },
];

const StatusServiceArr = [
  {
    value: "",
    label: "Đang thực hiện",
    color: "#1BC5BD",
  },
  {
    value: "",
    label: "Đã hoàn thành",
    color: "#B5B5C3",
  },
];

const AdvancedArr = [
  {
    value: "",
    label: "Hiện thị các buổi đặt lịch",
  },
  {
    value: "",
    label: "Hiện thị các buổi làm dịch vụ",
  },
];

const StaffArr = [
  {
    label: "Nguyễn Tài Tuấn",
    value: "Nguyễn Tài Tuấn",
    Thumbnail: "https://cser.vn/images/user.png",
  },
  {
    label: "Phạm Trung Hiếu",
    value: "Phạm Trung Hiếu",
    Thumbnail: "https://cser.vn/images/user.png",
  },
];

const CustomOptionStaff = ({ children, ...props }) => {
  const { Thumbnail, label } = props.data;
  return (
    <components.Option {...props}>
      <div className="d-flex align-items-center">
        <div className="w-20px h-20px mr-2 rounded-circle overflow-hidden d-flex align-items-center justify-content-center">
          <img className="w-100" src={Thumbnail} alt={label} />
        </div>
        {children}
      </div>
    </components.Option>
  );
};

const CustomOption = ({ children, ...props }) => {
  const { color } = props.data;
  return (
    <components.Option {...props}>
      <div className="d-flex align-items-center">
        <div
          className="w-20px h-15px rounded-2px mr-2"
          style={{ background: color }}
        ></div>
        {children}
      </div>
    </components.Option>
  );
};

function SidebarCalendar({ onOpenModal }) {
  return (
    <div className="ezs-calendar__sidebar">
      <button
        className="btn btn-primary btn-sm h-42px mb-24px"
        onClick={onOpenModal}
      >
        Tạo đặt lịch mới
      </button>
      <div className="datepicker-inline">
        <DatePicker
          selected={new Date()}
          onChange={(date) => console.log(date)}
          inline
        />
      </div>
      <div className="form-group form-group-ezs">
        <label className="mb-1">Nhân viên</label>
        <Select
          isMulti
          className="select-control"
          classNamePrefix="select"
          isLoading={false}
          isClearable
          isSearchable
          //menuIsOpen={true}
          name="color"
          placeholder="Chọn nhân viên"
          components={{
            Option: CustomOptionStaff,
          }}
          options={StaffArr}
          noOptionsMessage={() => "Không có nhân viên"}
        />
      </div>
      <div className="form-group form-group-ezs">
        <label className="mb-1">Trạng thái đặt lịch</label>
        <Select
          className="select-control"
          classNamePrefix="select"
          isLoading={false}
          isClearable
          isSearchable
          //menuIsOpen={true}
          name="color"
          placeholder="Chọn trạng thái"
          components={{ Option: CustomOption }}
          options={StatusArr}
        />
      </div>
      <div className="form-group form-group-ezs">
        <label className="mb-1">Trạng thái buổi dịch vụ</label>
        <Select
          className="select-control"
          classNamePrefix="select"
          isLoading={false}
          isClearable
          isSearchable
          //menuIsOpen={true}
          name="color"
          placeholder="Chọn trạng thái dịch vụ"
          components={{ Option: CustomOption }}
          options={StatusServiceArr}
        />
      </div>
      <div className="form-group form-group-ezs">
        <label className="mb-1">Nâng cao</label>
        <Select
          className="select-control"
          classNamePrefix="select"
          isLoading={false}
          isClearable
          isSearchable
          //menuIsOpen={true}
          name="color"
          placeholder="Chọn"
          options={AdvancedArr}
        />
      </div>
    </div>
  );
}

export default SidebarCalendar;
