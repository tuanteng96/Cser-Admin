import axiosClient from "../../../../redux/axioClient";

const GET_MEMBERS_STAFF_URL = "/api/gl/select2";
const GET_ROOT_SERVICES_URL = "/api/v3/mbook";
const POST_BOOKING_URL = "/api/v3/mbookadmin?cmd=AdminBooking";

const getMembers = (key) => {
    return axiosClient.get(`${GET_MEMBERS_STAFF_URL}?cmd=member&q=${key}`);
};
const getStaffs = ({ StockID, key }) => {
    return axiosClient.get(`${GET_MEMBERS_STAFF_URL}?cmd=user&roles=DV&crstockid=${StockID}&q=${key}`);
};
const getRootServices = ({ MemberID, StockID }) => {
    return axiosClient.get(`${GET_ROOT_SERVICES_URL}?cmd=getroot&memberid=${MemberID}&ps=15&pi=1&key=&stockid=${StockID}`);
}
const postBooking = (data, { CurrentStockID, u_id_z4aDf2 }) => {
    return axiosClient.post(`${POST_BOOKING_URL}&CurrentStockID=${CurrentStockID}&u_id_z4aDf2=${u_id_z4aDf2}`, JSON.stringify(data));
};

const deleteBooking = (data, { CurrentStockID, u_id_z4aDf2 }) => {
    return axiosClient.post(`${POST_BOOKING_URL}&CurrentStockID=${CurrentStockID}&u_id_z4aDf2=${u_id_z4aDf2}`, JSON.stringify(data));
};

const getBooking = ({ MemberID, From, To, StockID, Status, UserServiceIDs }) => {
    return axiosClient.get(`/api/v3/mbookadmin?cmd=getbooks&memberid=${MemberID}&from=${From}&to=${To}&stockid=${StockID}&status=${Status}&UserServiceIDs=${UserServiceIDs}`);
}

const CalendarCrud = {
    getMembers,
    getStaffs,
    getRootServices,
    postBooking,
    deleteBooking,
    getBooking
};
export default CalendarCrud;