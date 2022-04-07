import {
    createSlice
} from '@reduxjs/toolkit'

const OrderInfo = window.top.OrderBonus23Info || {
    OrderID: 28070,
};
const CrStockID = window.top.CrStockID || 8975;

const initialState = {
    ...OrderInfo,
    CrStockID
};

export const authSlice = createSlice({
    name: 'Auth',
    initialState,
    reducers: {
        //increment: (state) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        //state.value += 1
        //}
    },
})

// Action creators are generated for each case reducer function
//export const { increment } = authSlice.actions

export default authSlice.reducer;