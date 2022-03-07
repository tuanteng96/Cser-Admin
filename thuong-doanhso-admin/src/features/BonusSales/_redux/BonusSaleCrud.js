import axiosClient from "../../../redux/axioClient";

const BONUS_STAFF_URL = "/api/v3/orderbonus?cmd=calc";

const getOrderItem = (data) => {
    return axiosClient.post(`${BONUS_STAFF_URL}`, JSON.stringify(data));
};
const postOrderItem = (data) => {
    return axiosClient.post(`${BONUS_STAFF_URL}`, JSON.stringify(data));
}

const BonusSaleCrud = {
    getOrderItem,
    postOrderItem
};
export default BonusSaleCrud;