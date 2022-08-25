import { createSlice } from '@reduxjs/toolkit';

const OrdersSlice = createSlice({
  name: 'Orders',
  initialState: {
    orders: [],
  },
  reducers: {
    addAndRemoveOrder: (state, action) => {
      let order = action.payload;
      const { orders } = state;
      const newOrders = [...orders];
      const index = newOrders.findIndex(
        (item) => item.product._id === order._id
      );

      if (index === -1) {
        order = {
          product: order,
          quantity: 1,
        };
        newOrders.push(order);
      } else {
        newOrders.splice(index, 1);
      }
      state.orders = newOrders;
    },

    incrementOrderQuantity: (state, action) => {
      const { orders } = JSON.parse(JSON.stringify(state));
      // console.log(orders);
      const temp = [...orders];
      const product = action.payload;
      const index = temp.findIndex((item) => item.product._id === product._id);
      if (index !== -1) {
        temp[index].quantity += 1;
      }

      // console.log(temp[index]);
      state.orders = temp;
    },

    decrementOrderQuantity: (state, action) => {
      const { orders } = JSON.parse(JSON.stringify(state));
      // console.log(orders);
      const product = action.payload;
      const index = orders.findIndex(
        (item) => item.product._id === product._id
      );

      if (index !== -1) {
        if (orders[index].quantity > 1) {
          orders[index].quantity -= 1;
        } else {
          orders.splice(index, 1);
        }

        state.orders = orders;
      }

      // state.orders = action.payload;
    },

    removeOrder: (state, action) => {
      const { orders } = JSON.parse(JSON.stringify(state));
      const product = action.payload;
      const index = orders.findIndex(
        (item) => item.product._id === product._id
      );

      if (index !== -1) {
        orders.splice(index, 1);
      }

      state.orders = orders;
    },
    changeOrderQuantity: (state, action) => {
      const { orders } = JSON.parse(JSON.stringify(state));
      const { product, quantity } = action.payload;
      // console.log('ChangeOrderQuantity ====>', product._id, quantity);
      const index = orders.findIndex(
        (item) => item.product._id === product._id
      );

      if (index !== -1) {
        if (quantity > 0) {
          orders[index].quantity = quantity;
        } else {
          orders[index].quantity = 1;
        }
      }

      state.orders = orders;
    },

    clearOrders: (state) => {
      state.orders = [];
    },
  },
});

export const {
  addAndRemoveOrder,
  incrementOrderQuantity,
  decrementOrderQuantity,
  removeOrder,
  changeOrderQuantity,
  clearOrders,
} = OrdersSlice.actions;
export default OrdersSlice.reducer;
