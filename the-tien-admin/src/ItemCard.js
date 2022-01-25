import React, { useEffect, useState } from 'react';
import axiosClient from './axios/axiosClient';
import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

export default function ItemCard({ item, getMoneyCard, index }) {
    const [btnLoading, setBtnLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [ListHistory, setListHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const changeCard = (item) => {
        setBtnLoading(true);
        axiosClient.get(`/api/v3/moneycard?cmd=lock&id=${item.id}`).then(response => {
            getMoneyCard(() => {
                setBtnLoading(false);
                window.top?.toastr.success(`${item.trang_thai === "Khóa" ? "Kích hoạt thẻ tiền thành công" : "Khóa thẻ tiền thành công"}`, '', { timeOut: 2000 });
            })
        }).catch(err => console.log(err));
    }

    const formatVND = (price) => {
        if (typeof price === "undefined" || price === null) return false;
        return price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    };

    const getDetailCard = () => {
        setLoading(true);
        axiosClient.get(`/api/v3/moneycard?cmd=detail&id_the_tien=${item.id}`).then(({ data }) => {
            setListHistory(data.data)
            setLoading(false);
        }).catch((err) => console.log(err));
    }

    useEffect(() => {
        if (isOpen) {
            getDetailCard();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (<React.Fragment>
        <tr>
            <th className="text-center" scope="row">{index + 1}</th>
            <td>
                <div>
                    {item.ten} {item.trang_thai === "Khóa" && <b className="text-danger text-capitalize">( Khóa )</b>}
                </div>
                <div>HSD : {!item.han_dung ? "Không giới hạn" : (<React.Fragment>
                    {item.han_dung && moment().diff(item.han_dung, "minutes") < 0
                        ? moment(item.han_dung).format("DD/MM/YYYY")
                        : <b className="text-danger">Hết hạn</b>}
                </React.Fragment>)}</div>
            </td>
            <td>
                <div>{formatVND(item.gia_tri_the)} </div>
                {(item.gioi_han_sp !== 0 || item.gioi_han_dv !== 0) && <div>( Sản phẩm :  {formatVND(item.gioi_han_sp)} - Dịch vụ : {formatVND(item.gioi_han_dv)})</div>}
            </td>
            <td>
                <div>{formatVND(item.gia_tri_chi_tieu)}  </div>
                {(item.gia_tri_chi_tieu_sp !== 0 || item.gia_tri_chi_tieu_dv !== 0) && <div>( Sản phẩm :  {formatVND(item.gia_tri_chi_tieu_sp)} - Dịch vụ : {formatVND(item.gia_tri_chi_tieu_dv)})</div>}
            </td>
            <td>
                <div>{formatVND(item.gia_tri_chi_tieu - item.su_dung)} </div>
                {( item.gia_tri_chi_tieu_sp - item.su_dung_sp !== 0 || item.gia_tri_chi_tieu_dv - item.su_dung_dv !== 0) && (item.gioi_han_sp !== 0 || item.gioi_han_dv !== 0 || item.gia_tri_chi_tieu_sp !== 0 || item.gia_tri_chi_tieu_dv !== 0) && <div>( Sản phẩm :  {formatVND(item.gia_tri_chi_tieu_sp - item.su_dung_sp)} - Dịch vụ : {formatVND(item.gia_tri_chi_tieu_dv - item.su_dung_dv)})</div>}
            </td>
            <td className="text-center">
                <div className="moneycard-btn">
                    <button type="button" className={`mb-5px btn btn-sm btn-${item.trang_thai === "Khóa" ? "success" : "danger"}`} onClick={() => changeCard(item)} disabled={btnLoading}>
                        {btnLoading && "Đang thực hiên"} {!btnLoading && (<>{item.trang_thai === "Khóa" ? "Kích hoạt" : "Khóa thẻ"}</>)}
                    </button>
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Đóng lịch sử" : "Lịch sử"}</button>
                </div>
            </td>
        </tr>
        {
            isOpen && (
                <tr>
                    <td className="moneycard-history" colSpan={1}></td>
                    <td className="moneycard-history" colSpan={5}>
                        {/* <h5>Lịch sử sử dụng</h5> */}
                        <div className="moneycard-timeline">
                            {
                                loading && ("Đang tải ...")
                            }
                            {
                                !loading && (<React.Fragment>
                                    {
                                        ListHistory && ListHistory.length > 0 ? (
                                            <ul>
                                                {
                                                    ListHistory.map((sub, idx) => (
                                                        <li className="down" key={idx}>
                                                            <div className="price">
                                                                <div className="price-number">{formatVND(sub.gia_tri)}</div>
                                                                <div className="price-time">{moment(sub.ngay).format("HH:mm DD/MM/YYYY")}</div>
                                                            </div>
                                                            <div className="note">{sub.san_pham}</div>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        ) : ("Không có lịch sử")
                                    }
                                </React.Fragment>)
                            }

                        </div>
                    </td>
                </tr>
            )
        }
        {/* <div className="item-moneycard">
            <div className="moneycard-title">
                {item.ten} {item.trang_thai === "Khóa" && <span className="text-danger text-capitalize">( Khóa )</span>}
            </div>
            <div>
                {item.gia_tri_the !== item.gia_tri_chi_tieu && <div>Giá trị thẻ tiền : {formatVND(item.gia_tri_the)} {(item.gioi_han_sp !== 0 || item.gioi_han_dv !== 0) && <>( Sản phẩm :  {formatVND(item.gioi_han_sp)} - Dịch vụ : {formatVND(item.gioi_han_dv)})</>}</div>}
                <div>Giá trị chi tiêu : {formatVND(item.gia_tri_chi_tieu)} {(item.gia_tri_chi_tieu_sp !== 0 || item.gia_tri_chi_tieu_dv !== 0) && <>( Sản phẩm :  {formatVND(item.gia_tri_chi_tieu_sp)} - Dịch vụ : {formatVND(item.gia_tri_chi_tieu_dv)})</>} </div>
                <div>Đã chi tiêu tiêu : {formatVND(item.su_dung)} {(item.su_dung_sp !== 0 || item.su_dung_dv !== 0) && <>( Sản phẩm :  {formatVND(item.su_dung_sp)} - Dịch vụ : {formatVND(item.su_dung_dv)})</>}</div>
                <div>Còn lại : {formatVND(item.gia_tri_chi_tieu - item.su_dung)} {(item.gia_tri_chi_tieu_sp - item.su_dung_sp !== 0 || item.gia_tri_chi_tieu_dv - item.su_dung_dv !== 0) && <>( Sản phẩm :  {formatVND(item.gia_tri_chi_tieu_sp - item.su_dung_sp)} - Dịch vụ : {formatVND(item.gia_tri_chi_tieu_dv - item.su_dung_dv)})</>}</div>
                <div>Hạn sử dụng : {!item.han_dung ? "Không giới hạn" : (<React.Fragment>
                    {item.han_dung && moment().diff(item.han_dung, "minutes") < 0
                        ? moment(item.han_dung).format("DD/MM/YYYY")
                        : <b className="text-danger">Hết hạn</b>}
                </React.Fragment>)}</div>
            </div>
            <div className="moneycard-btn">
                <button type="button" className={`btn btn-sm btn-${item.trang_thai === "Khóa" ? "success" : "danger"} mr-8px`} onClick={() => changeCard(item)} disabled={btnLoading}>
                    {btnLoading && "Đang thực hiên"} {!btnLoading && (<>{item.trang_thai === "Khóa" ? "Kích hoạt thẻ" : "Khóa thẻ"}</>)}
                </button>
                <button type="button" className="btn btn-sm btn-primary" onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Đóng lịch sử" : "Lịch sử sử dụng"}</button>
            </div>
            {
                isOpen && (
                    <div className="moneycard-history">
                        <h5>Lịch sử sử dụng</h5>
                        <div className="moneycard-timeline">
                            {
                                loading && ("Đang tải ...")
                            }
                            {
                                !loading && (<React.Fragment>
                                    {
                                        ListHistory && ListHistory.length > 0 ? (
                                            <ul>
                                                {
                                                    ListHistory.map((sub, idx) => (
                                                        <li className="down" key={idx}>
                                                            <div className="price">
                                                                <div className="price-number">{formatVND(sub.gia_tri)}</div>
                                                                <div className="price-time">{moment(sub.ngay).format("HH:mm DD/MM/YYYY")}</div>
                                                            </div>
                                                            <div className="note">{sub.san_pham}</div>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        ) : ("Không có lịch sử")
                                    }
                                </React.Fragment>)
                            }

                        </div>
                    </div>
                )
            }
        </div> */}
    </React.Fragment>);
}
