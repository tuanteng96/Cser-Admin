import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap'
import { formatVND } from '../../../helpers/FormatHelpers'
import { Formik, FieldArray, Form } from 'formik';
import NumberFormat from "react-number-format";
import moment from "moment";
import AutoSubmit from '../components/AutoSubmit';
moment.locale();         // vi

function BounsSalesIn({ OrderInfo, onSubmit }) {
    const [initialValues, setInitialValues] = useState({
        BounsSalesIn: []
    });

    useEffect(() => {
        if (OrderInfo) {
            const { doanh_so, hoa_hong, oiItems } = OrderInfo;
            const newObj = oiItems && oiItems.length > 0 ? oiItems.map(product => {
                const Hoa_hong_arr = hoa_hong.filter(item => item.SubSourceID === product.ID);
                const Doanh_so_arr = doanh_so.filter(item => item.OrderItemID === product.ID);

                return {
                    Product: product,
                    Hoa_Hong: Hoa_hong_arr,
                    Doanh_So: Doanh_so_arr
                }
            }) : [];
            //console.log(OrderInfo);
            //console.log(doanh_so);
            //console.log(hoa_hong);
            setInitialValues((prevState) => ({
                ...prevState,
                BounsSalesIn: newObj
            }))
        }
    }, [OrderInfo]);

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={onSubmit}
        >
            {(formikProps) => {
                const {
                    values,
                    submitForm,
                    handleBlur,
                    setFieldValue,
                    initialValues
                } = formikProps;

                return (
                    <Form>

                        <Table className="mb-0" bordered responsive>
                            <thead>
                                <tr>
                                    <th className="min-w-200px w-30">Sản phẩm</th>
                                    <th className="min-w-300px text-center w-35">Hoa hồng</th>
                                    <th className="min-w-300px text-center w-35">Doanh số</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    values && values.BounsSalesIn && values.BounsSalesIn.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div>
                                                    <div className="fw-bolder">{item.Product.ProdTitle}</div>
                                                    <div>SL : {item.Product.Qty} * {formatVND(item.Product.don_gia)} = {formatVND(item.Product.ToPay)}</div>
                                                    <div>Tổng Doanh số dự kiến : {formatVND(item.Product.gia_tri_doanh_so)}</div>
                                                    <div>Tổng hoa hồng dự kiến : {formatVND(item.Product.gia_tri_thanh_toan)}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <FieldArray
                                                    name={`BounsSalesIn[${index}].Hoa_Hong`}
                                                    render={arrayHelpers => (
                                                        item.Hoa_Hong && item.Hoa_Hong.map((sub, idx) => (
                                                            <div className="d-flex align-items-center my-3" key={idx}>
                                                                <div className="mb-1 w-120px pe-2">
                                                                    <label className="text-truncate line-height-sm font-weight-boldest w-100">{sub.User.FullName}</label>
                                                                    <div className="text-muted line-height-sm">{moment(sub.CreateDate).format('DD.MM.YYYY')}</div>
                                                                </div>
                                                                <NumberFormat
                                                                    allowNegative={false}
                                                                    name={`BounsSalesIn[${index}].Hoa_Hong[${idx}].Value`}
                                                                    placeholder={"Nhập giá trị"}
                                                                    className={`form-control flex-1`}
                                                                    isNumericString={true}
                                                                    thousandSeparator={true}
                                                                    value={sub.Value}
                                                                    onValueChange={(val) => {
                                                                        setFieldValue(
                                                                            `BounsSalesIn[${index}].Hoa_Hong[${idx}].Value`,
                                                                            val.floatValue
                                                                                ? val.floatValue
                                                                                : val.value, false
                                                                        );
                                                                    }}
                                                                    onBlur={handleBlur}
                                                                    disabled={!sub.chinh_sua}
                                                                />
                                                                {sub.chinh_sua && <div className="text-danger w-30px text-end cursor-pointer" onClick={() => arrayHelpers.remove(idx)}>Xóa</div>}
                                                            </div>
                                                        ))
                                                    )} />
                                            </td>
                                            <td>
                                                <FieldArray
                                                    name={`BounsSalesIn[${index}].Doanh_So`}
                                                    render={arrayHelpers => (
                                                        item.Doanh_So && item.Doanh_So.map((sub, idx) => (
                                                            <div className="d-flex align-items-center my-4" key={idx}>
                                                                <div className="mb-1 w-120px pe-2">
                                                                    <label className="text-truncate line-height-sm font-weight-boldest w-100">{sub.User.FullName}</label>
                                                                    <div className="text-muted line-height-sm">{moment(sub.CreateDate).format('DD.MM.YYYY')}</div>
                                                                </div>
                                                                <NumberFormat
                                                                    allowNegative={false}
                                                                    name={`BounsSalesIn[${index}].Doanh_So[${idx}].Value`}
                                                                    placeholder={"Nhập giá trị"}
                                                                    className={`form-control flex-1`}
                                                                    isNumericString={true}
                                                                    thousandSeparator={true}
                                                                    value={sub.Value}
                                                                    onValueChange={(val) => {
                                                                        setFieldValue(
                                                                            `BounsSalesIn[${index}].Doanh_So[${idx}].Value`,
                                                                            val.floatValue
                                                                                ? val.floatValue
                                                                                : val.value, false
                                                                        );
                                                                    }}
                                                                    onBlur={handleBlur}
                                                                    disabled={!sub.chinh_sua}
                                                                />
                                                                {sub.chinh_sua && <div className="text-danger w-30px text-end cursor-pointer" onClick={() => arrayHelpers.remove(idx)}>Xóa</div>}
                                                            </div>
                                                        ))
                                                    )} />
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                        <AutoSubmit values={values} submitForm={submitForm} initialValues={initialValues} />
                    </Form>
                );
            }}
        </Formik>
    )
}

BounsSalesIn.propTypes = {
    OrderInfo: PropTypes.object,
    onSubmit: PropTypes.func
}

export default BounsSalesIn
