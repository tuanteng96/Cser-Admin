import React, { Fragment, useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import Select from "react-select"
import NumberFormat from "react-number-format"
import { Formik, FieldArray, Form } from 'formik';
import PropTypes from 'prop-types'

function Divided({ OrderInfo, onSubmit, loading }) {
    const [initialValuesAdd, setInitialValuesAdd] = useState({ ToAdd: [] });
    const [initialValues, setInitialValues] = useState({ divided: [] })
    useEffect(() => {
        if (OrderInfo) {
            const { oiItems } = OrderInfo;
            const newObt = oiItems && oiItems.length > 0 ? oiItems.map(item => ({
                Product: item,
                Staff: null
            })) : [];
            setInitialValuesAdd({ ToAdd: newObt });
        }
    }, [OrderInfo]);

    const onToAdd = (values, { resetForm }) => {
        const { ToAdd } = values;
        const itemChange = ToAdd && ToAdd.length > 0 ? ToAdd.filter(item => item.Staff) : [];
        if (itemChange.length > 0) {
            const newArr = itemChange.map(item => ({
                Product: item.Product,
                Hoa_Hong: [{
                    Product: item.Product,
                    Staff: item.Staff,
                    Value: item.Product.gia_tri_thanh_toan
                }].filter(item => item.Value),
                Doanh_So: [{
                    Product: item.Product,
                    Staff: item.Staff,
                    Value: item.Product.gia_tri_doanh_so
                }].filter(item => item.Value)
            }));
            setInitialValues({ divided: newArr });
            resetForm();
        }
    }

    return (
        <Fragment>
            <div className="row">
                <div className="col-md-6">
                    <div className="border rounded mb-3 px-4 py-2">
                        <Formik
                            enableReinitialize
                            initialValues={initialValuesAdd}
                            onSubmit={onToAdd}
                        >
                            {(formikProps) => {
                                const {
                                    values,
                                    setFieldValue,
                                } = formikProps;

                                return (
                                    <Form>
                                        {
                                            values && values.ToAdd && values.ToAdd.map((item, index) => (

                                                <div className="d-flex align-items-center my-3" key={index}>
                                                    <div className="w-250px fw-bold pe-4">
                                                        {item.Product.ProdTitle}
                                                    </div>
                                                    <div className="flex-1">
                                                        <Select
                                                            classNamePrefix="select"
                                                            className={`select-control`}
                                                            name={`ToAdd[${index}].Staff`}
                                                            options={
                                                                OrderInfo.nhan_vien
                                                            }
                                                            value={item.Staff}
                                                            placeholder="Ch???n Nh??n vi??n"
                                                            noOptionsMessage={() =>
                                                                "Kh??ng c?? l???a ch???n"
                                                            }
                                                            onChange={(option) => {
                                                                setFieldValue(`ToAdd[${index}].Staff`, option, false)
                                                            }}
                                                            isSearchable
                                                            isClearable
                                                            menuPosition="fixed"
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        <div className="text-end mb-3">
                                            <button type="submit" className="btn btn-primary">T???o m???i</button>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                </div>
            </div>
            {
                initialValues && initialValues.divided && initialValues.divided.length > 0 && (
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                    >
                        {(formikProps) => {
                            const {
                                values,
                                handleBlur,
                                setFieldValue,
                            } = formikProps;
                            return (
                                <Form>
                                    <Table bordered responsive>
                                        <thead>
                                            <tr>
                                                <th className="min-w-250px w-20">S???n ph???m</th>
                                                <th className="text-center min-w-250px w-40">Hoa h???ng</th>
                                                <th className="text-center min-w-250px w-40">Doanh s???</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                values.divided.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="vertical-align-middle font-weight-boldest">
                                                            {item.Product.ProdTitle}
                                                        </td>
                                                        <td>
                                                            <FieldArray
                                                                name={`divided[${index}].Hoa_Hong`}
                                                                render={arrayHelpers => (
                                                                    item.Hoa_Hong.map((sub, idx) => (
                                                                        <div className="d-flex align-items-center my-2" key={idx}>
                                                                            <label className="font-weight-boldest mb-1 w-140px text-truncate pe-3">{sub.Staff.Fn}</label>
                                                                            <NumberFormat
                                                                                allowNegative={false}
                                                                                name={`divided[${index}].Hoa_Hong[${idx}].Value`}
                                                                                placeholder={"Nh???p gi?? tr???"}
                                                                                className={`form-control flex-1`}
                                                                                isNumericString={true}
                                                                                thousandSeparator={true}
                                                                                value={sub.Value}
                                                                                onValueChange={(val) => {
                                                                                    setFieldValue(
                                                                                        `divided[${index}].Hoa_Hong[${idx}].Value`,
                                                                                        val.floatValue
                                                                                            ? val.floatValue
                                                                                            : val.value, false
                                                                                    );
                                                                                }}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                        </div>
                                                                    ))
                                                                )} />
                                                        </td>
                                                        <td>
                                                            <FieldArray
                                                                name={`divided[${index}].Doanh_So`}
                                                                render={arrayHelpers => (
                                                                    item.Doanh_So.map((sub, idx) => (
                                                                        <div className="d-flex align-items-center my-2" key={idx}>
                                                                            <label className="font-weight-boldest mb-1 w-140px text-truncate pe-3">{sub.Staff.Fn}</label>
                                                                            <NumberFormat
                                                                                allowNegative={false}
                                                                                name={`divided[${index}].Doanh_So[${idx}].Value`}
                                                                                placeholder={"Nh???p gi?? tr???"}
                                                                                className={`form-control flex-1`}
                                                                                isNumericString={true}
                                                                                thousandSeparator={true}
                                                                                value={sub.Value}
                                                                                onValueChange={(val) => {
                                                                                    setFieldValue(
                                                                                        `divided[${index}].Doanh_So[${idx}].Value`,
                                                                                        val.floatValue
                                                                                            ? val.floatValue
                                                                                            : val.value, false
                                                                                    );
                                                                                }}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                        </div>
                                                                    ))
                                                                )} />
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                    <div>
                                        <button className={`btn btn-success ${loading.divided ? "spinner spinner-white spinner-right" : ""}`} type="submit" disabled={loading.divided}>C???p nh???p</button>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                )
            }

        </Fragment>
    )
}

Divided.propTypes = {
    OrderInfo: PropTypes.object
}

export default Divided
