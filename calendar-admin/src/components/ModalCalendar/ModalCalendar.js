import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select, { components } from "react-select";
import AsyncSelect from "react-select/async";
import { Dropdown, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import moment from "moment";
import CalendarCrud from "../../App/modules/Calendar/_redux/CalendarCrud";
import { toUrlServer } from "../../helpers/AssetsHelpers";
moment.locale("vi");

ModalCalendar.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
};
ModalCalendar.defaultProps = {
  show: false,
  onHide: null,
  onSubmit: null,
};

const CustomOptionStaff = ({ children, ...props }) => {
  const { Thumbnail, label } = props.data;
  return (
    <components.Option {...props}>
      <div className="d-flex align-items-center">
        <div className="w-20px h-20px mr-3 rounded-circle overflow-hidden d-flex align-items-center justify-content-center">
          <img className="w-100" src={Thumbnail} alt={label} />
        </div>
        {children}
      </div>
    </components.Option>
  );
};

const initialDefault = {
  MemberID: null,
  RootIdS: "",
  BookDate: new Date(),
  Desc: "",
  StockID: 0,
  UserServiceIDs: "",
};

function ModalCalendar({ show, onHide, onSubmit, btnLoading }) {
  const [initialValues, setInitialValues] = useState(initialDefault);
  const { AuthStocks, AuthCrStockID } = useSelector(({ Auth }) => ({
    AuthStocks: Auth.Stocks.filter(
      (item) => item.ParentID !== 0
    ).map((item) => ({ ...item, value: item.ID, label: item.Title })),
    AuthCrStockID: Auth.CrStockID,
  }));

  useEffect(() => {
    if (show) {
      setInitialValues((prevState) => ({
        ...prevState,
        StockID: AuthCrStockID,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const loadOptionsCustomer = (inputValue, callback) => {
    setTimeout(async () => {
      const { data } = await CalendarCrud.getMembers(inputValue);
      const dataResult = data.data.map((item) => ({
        value: item.id,
        label: item.text,
        Thumbnail: toUrlServer("/images/user.png"),
      }));
      callback(dataResult);
    }, 800);
  };

  const loadOptionsStaff = (inputValue, callback, stockID) => {
    const filters = {
      key: inputValue,
      StockID: stockID,
    };
    setTimeout(async () => {
      const { data } = await CalendarCrud.getStaffs(filters);
      const dataResult = data.data.map((item) => ({
        value: item.id,
        label: item.text,
        Thumbnail: toUrlServer("/images/user.png"),
      }));
      callback(dataResult);
    }, 800);
  };

  const loadOptionsServices = (inputValue, callback, stockID, MemberID) => {
    const filters = {
      key: inputValue,
      StockID: stockID,
      MemberID: MemberID?.value,
    };
    setTimeout(async () => {
      const { data } = await CalendarCrud.getRootServices(filters);
      const dataResult = data.lst.map((item) => ({
        value: item.ID,
        label: item.Title,
      }));
      callback(dataResult);
    }, 800);
  };

  const CalendarSchema = Yup.object().shape({
    BookDate: Yup.string().required("Vui lòng chọn ngày đặt lịch."),
    MemberID: Yup.object()
      .nullable()
      .required("Vui lòng chọn khách hàng"),
    RootIdS: Yup.array()
      .required("Vui lòng chọn dịch vụ.")
      .nullable(),
    UserServiceIDs: Yup.array()
      .required("Vui lòng chọn nhân viên.")
      .nullable(),
    StockID: Yup.string().required("Vui lòng chọn cơ sở."),
  });

  return (
    <Modal size="md" dialogClassName="modal-max-sm" show={show} onHide={onHide}>
      <Formik
        initialValues={initialValues}
        validationSchema={CalendarSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {(formikProps) => {
          const {
            errors,
            touched,
            values,
            handleChange,
            handleBlur,
            setFieldValue,
          } = formikProps;
          return (
            <Form>
              <Modal.Header className="open-close" closeButton>
                <Modal.Title>Đặt lịch dịch vụ</Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-0">
                <div className="form-group form-group-ezs px-6 pt-3 border-top">
                  <label className="mb-1">Khách hàng</label>
                  <AsyncSelect
                    className={`select-control ${
                      errors.MemberID && touched.MemberID
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    classNamePrefix="select"
                    isLoading={false}
                    isDisabled={false}
                    isClearable
                    isSearchable
                    //menuIsOpen={true}
                    name="MemberID"
                    value={values.MemberID}
                    onChange={(option) => setFieldValue("MemberID", option)}
                    onBlur={handleBlur}
                    placeholder="Chọn khách hàng"
                    components={{
                      Option: CustomOptionStaff,
                    }}
                    menuPosition="fixed"
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
                <div className="form-group form-group-ezs px-6 pt-3 border-top">
                  <label className="mb-1">Thời gian thực hiện</label>
                  <DatePicker
                    name="BookDate"
                    selected={values.BookDate}
                    onChange={(date) => setFieldValue("BookDate", date)}
                    onBlur={handleBlur}
                    className={`form-control ${
                      errors.BookDate && touched.BookDate
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Chọn thời gian"
                  />
                  <Select
                    className={`select-control mt-2 ${
                      errors.StockID && touched.StockID
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    classNamePrefix="select"
                    value={AuthStocks.filter(
                      (item) => item.ID === values.StockID
                    )}
                    //isLoading={true}
                    //isDisabled={true}
                    isClearable
                    isSearchable
                    //menuIsOpen={true}
                    name="StockID"
                    placeholder="Chọn cơ sở"
                    options={AuthStocks}
                    onChange={(option) => {
                      setFieldValue("StockID", option ? option.value : "");
                    }}
                    menuPosition="fixed"
                    onBlur={handleBlur}
                  />
                </div>
                <div className="form-group form-group-ezs px-6 pt-3">
                  <label className="mb-1">Dịch vụ</label>
                  <AsyncSelect
                    key={`${
                      values.MemberID && values.MemberID.value
                        ? values.MemberID.value
                        : "No-Member"
                    }-${values.StockID}`}
                    menuPosition="fixed"
                    isMulti
                    className={`select-control ${
                      errors.RootIdS && touched.RootIdS
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    classNamePrefix="select"
                    isLoading={false}
                    isDisabled={false}
                    isClearable
                    isSearchable
                    //menuIsOpen={true}
                    value={values.RootIdS}
                    onChange={(option) => setFieldValue("RootIdS", option)}
                    name="RootIdS"
                    placeholder="Chọn dịch vụ"
                    cacheOptions
                    loadOptions={(v, callback) =>
                      loadOptionsServices(
                        v,
                        callback,
                        values.StockID,
                        values.MemberID
                      )
                    }
                    defaultOptions
                    noOptionsMessage={({ inputValue }) =>
                      !inputValue
                        ? "Không có dịch vụ"
                        : "Không tìm thấy dịch vụ"
                    }
                  />
                </div>
                <div className="form-group form-group-ezs px-6 pt-3 border-top">
                  <label className="mb-1">Nhân viên thực hiện</label>
                  <AsyncSelect
                    key={values.StockID}
                    className={`select-control ${
                      errors.UserServiceIDs && touched.UserServiceIDs
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    classNamePrefix="select"
                    isLoading={false}
                    isDisabled={false}
                    isClearable
                    isSearchable
                    isMulti
                    menuPosition="fixed"
                    //menuIsOpen={true}
                    name="UserServiceIDs"
                    value={values.UserServiceIDs}
                    onChange={(option) =>
                      setFieldValue("UserServiceIDs", option)
                    }
                    placeholder="Chọn nhân viên"
                    components={{
                      Option: CustomOptionStaff,
                    }}
                    cacheOptions
                    loadOptions={(v, callback) =>
                      loadOptionsStaff(v, callback, values.StockID)
                    }
                    defaultOptions
                    noOptionsMessage={({ inputValue }) =>
                      !inputValue
                        ? "Không có nhân viên"
                        : "Không tìm thấy nhân viên"
                    }
                  />
                  <textarea
                    name="Desc"
                    value={values.Desc}
                    className="form-control mt-2"
                    rows="5"
                    placeholder="Nhập ghi chú"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  ></textarea>
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-content-between">
                <Dropdown>
                  <Dropdown.Toggle className="btn-sm" id="dropdown-custom-1">
                    Đã xác nhận
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="super-colors">
                    <Dropdown.Item eventKey="1" active>
                      Đã xác nhận
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="2">Chưa xác nhận</Dropdown.Item>
                    <Dropdown.Item eventKey="3">
                      Đặt nhưng không đến
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="4">Đang thực hiện</Dropdown.Item>
                    {/* <Dropdown.Divider /> */}
                    <Dropdown.Item eventKey="4">Đã hoàn thành</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <div>
                  <button className="btn btn-sm btn-secondary" onClick={onHide}>
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-sm btn-primary ml-2 ${
                      btnLoading.isBtnBooking
                        ? "spinner spinner-white spinner-right"
                        : ""
                    } w-auto my-0 mr-0`}
                    disabled={btnLoading.isBtnBooking}
                  >
                    Đặt lịch mới
                  </button>
                </div>
              </Modal.Footer>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}

export default ModalCalendar;
