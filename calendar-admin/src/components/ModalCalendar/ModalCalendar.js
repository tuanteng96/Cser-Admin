import React from "react";
import PropTypes from "prop-types";
import Select, { components } from "react-select";
import { Dropdown, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";

ModalCalendar.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
};
ModalCalendar.defaultProps = {
  show: false,
  onHide: null,
};

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

function ModalCalendar({ show, onHide }) {
  return (
    <Modal size="md" dialogClassName="modal-max-sm" show={show} onHide={onHide}>
      <Modal.Header className="open-close" closeButton>
        <Modal.Title>Đặt lịch dịch vụ</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="form-group form-group-ezs px-6 pt-3">
          <label className="mb-1">Dịch vụ</label>
          <Select
            className="select-control"
            classNamePrefix="select"
            isLoading={false}
            isClearable
            isSearchable
            //menuIsOpen={true}
            name="color"
            placeholder="Chọn dịch vụ"
            options={[{ label: "Nguyễn Tài Tuấn", value: "Nguyễn Tài Tuấn" }]}
          />
        </div>
        <div className="form-group form-group-ezs px-6 pt-3 border-top">
          <label className="mb-1">Thời gian thực hiện</label>
          <DatePicker
            selected={new Date()}
            onChange={(date) => console.log(date)}
            className="form-control"
          />
          <Select
            className="select-control mt-2"
            classNamePrefix="select"
            isLoading={false}
            isClearable
            isSearchable
            //menuIsOpen={true}
            name="color"
            placeholder="Chọn cơ sở"
            options={[{ label: "Nguyễn Tài Tuấn", value: "Nguyễn Tài Tuấn" }]}
          />
        </div>
        <div className="form-group form-group-ezs px-6 pt-3 border-top">
          <label className="mb-1">Khách hàng</label>
          <Select
            className="select-control"
            classNamePrefix="select"
            isLoading={false}
            isClearable
            isSearchable
            //menuIsOpen={true}
            name="color"
            placeholder="Chọn khách hàng"
            components={{
              Option: CustomOptionStaff,
            }}
            options={StaffArr}
          />
        </div>
        <div className="form-group form-group-ezs px-6 pt-3 border-top">
          <label className="mb-1">Nhân viên thực hiện</label>
          <Select
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
          />
          <textarea
            className="form-control mt-2"
            rows="5"
            placeholder="Nhập ghi chú"
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Dropdown>
          <Dropdown.Toggle className="btn-sm" id="dropdown-custom-1">
            Đã xác nhận
          </Dropdown.Toggle>
          <Dropdown.Menu className="super-colors">
            <Dropdown.Item eventKey="1">Action</Dropdown.Item>
            <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
            <Dropdown.Item eventKey="3" active>
              Active Item
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div>
          <button className="btn btn-sm btn-secondary" onClick={onHide}>
            Hủy
          </button>
          <button className="btn btn-sm btn-primary ml-2">Đặt lịch mới</button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalCalendar;
