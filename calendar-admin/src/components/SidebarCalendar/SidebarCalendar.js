import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select, { components } from "react-select";
import AsyncSelect from "react-select/async";
import DatePicker from "react-datepicker";
import { Form, Formik, useFormikContext } from "formik";
import CalendarCrud from "../../App/modules/Calendar/_redux/CalendarCrud";
import { toUrlServer } from "../../helpers/AssetsHelpers";
import { useSelector } from "react-redux";

SidebarCalendar.propTypes = {
  onOpenModal: PropTypes.func,
  onSubmit: PropTypes.func,
  filters: PropTypes.object,
};
SidebarCalendar.defaultProps = {
  onOpenModal: null,
  onSubmit: null,
  filters: null,
};

const StatusArr = [
  {
    value: "XAC_NHAN",
    label: "Đã xác nhận",
    color: "#3699FF",
  },
  {
    value: "CHUA_XAC_NHAN",
    label: "Chưa xác nhận",
    color: "#FFA800",
  },
  {
    value: "KHACH_KHONG_DEN",
    label: "Đặt nhưng không đến",
    color: "#F64E60",
  },
  // {
  //   value: "",
  //   label: "Đang thực hiện",
  //   color: "#1BC5BD",
  // },
  // {
  //   value: "",
  //   label: "Hoàn thành",
  //   color: "#B5B5C3",
  // },
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

const ValueChangeListener = () => {
  const { submitForm, values } = useFormikContext();

  useEffect(() => {
    submitForm();
  }, [values, submitForm]);

  return null;
};

const initialDefault = {
  MemberID: null,
  StockID: 0,
  From: new Date(), //yyyy-MM-dd
  To: null, //yyyy-MM-dd,
  Status: null,
  UserServiceIDs: null,
};

function SidebarCalendar({ onOpenModal, onSubmit, filters }) {
  const [initialValues, setInitialValues] = useState(initialDefault);
  const { CrStockID } = useSelector((state) => state.Auth);

  useEffect(() => {
    if (filters) {
      setInitialValues(filters);
    }
    else {
      setInitialValues((prevState) => ({ ...prevState, StockID: CrStockID }));
    }
  }, [CrStockID, filters]);

  const loadOptionsStaff = (inputValue, callback) => {
    const filters = {
      key: inputValue,
      StockID: CrStockID,
    };
    setTimeout(async () => {
      const { data } = await CalendarCrud.getStaffs(filters);
      const dataResult = data.data.map((item) => ({
        value: item.id,
        label: item.text,
        Thumbnail: toUrlServer("/images/user.png"),
      }));
      callback(dataResult);
    }, 300);
  };

  const loadOptionsCustomer = (inputValue, callback) => {
    setTimeout(async () => {
      const { data } = await CalendarCrud.getMembers(inputValue);
      const dataResult = data.data.map((item) => ({
        value: item.id,
        label: item.text,
        Thumbnail: toUrlServer("/images/user.png"),
      }));
      callback(dataResult);
    }, 300);
  };

  return (
    <div className="ezs-calendar__sidebar">
      <button
        className="btn btn-primary btn-sm h-42px mb-24px"
        onClick={onOpenModal}
      >
        Tạo đặt lịch mới
      </button>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {(formikProps) => {
          const { values, handleBlur, setFieldValue } = formikProps;
          return (
            <Form>
              <div className="datepicker-inline">
                <DatePicker
                  selected={values.From && new Date(values.From)}
                  onChange={(date) => {
                    setFieldValue("From", date[0], false);
                    setFieldValue("To", date[1], false);
                  }}
                  inline
                  selectsRange
                  startDate={values.From && new Date(values.From)}
                  endDate={values.To && new Date(values.To)}
                />
              </div>
              <div className="form-group form-group-ezs">
                <label className="mb-1">Khách hàng</label>
                <AsyncSelect
                  isMulti
                  className="select-control"
                  classNamePrefix="select"
                  isLoading={false}
                  isClearable
                  isSearchable
                  //menuIsOpen={true}
                  name="MemberID"
                  value={values.MemberID}
                  onChange={(option) =>
                    setFieldValue("MemberID", option, false)
                  }
                  placeholder="Chọn khách hàng"
                  components={{
                    Option: CustomOptionStaff,
                  }}
                  cacheOptions
                  loadOptions={loadOptionsCustomer}
                  defaultOptions
                  noOptionsMessage={({ inputValue }) =>
                    !inputValue
                      ? "Không có khách hàng"
                      : "Không tìm thấy khách hàng"
                  }
                />
              </div>
              <div className="form-group form-group-ezs">
                <label className="mb-1">Nhân viên</label>
                <AsyncSelect
                  key={CrStockID}
                  isMulti
                  className="select-control"
                  classNamePrefix="select"
                  isLoading={false}
                  isClearable
                  isSearchable
                  //menuIsOpen={true}
                  name="UserServiceIDs"
                  value={values.UserServiceIDs}
                  onChange={(option) => setFieldValue("UserServiceIDs", option, false)}
                  placeholder="Chọn nhân viên"
                  components={{
                    Option: CustomOptionStaff,
                  }}
                  cacheOptions
                  loadOptions={loadOptionsStaff}
                  defaultOptions
                  noOptionsMessage={({ inputValue }) =>
                    !inputValue
                      ? "Không có nhân viên"
                      : "Không tìm thấy nhân viên"
                  }
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
                  name="Status"
                  value={values.Status}
                  onChange={(option) =>
                    setFieldValue("Status", option ? option : null, false)
                  }
                  onBlur={handleBlur}
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
              <ValueChangeListener />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default SidebarCalendar;
