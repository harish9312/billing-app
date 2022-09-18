import { notification } from "antd";
import { mainReducer, ADD_CUSTOMER, GET_CUSTOMER } from "./mainReducer";

export const getCustomers = () => {
  return JSON.parse(localStorage.getItem("customers") || "[]");
};

export const saveCustomer = (all: any) => {
  localStorage.setItem("customers", JSON.stringify(all));
};

export const saveCustomers = (custData: any) => {
  const all = getCustomers();
  all.push(custData);
  localStorage.setItem("customers", JSON.stringify(all));
};

export const deleteTransaction = (tId: any, custId: any) => {
  const all = getCustomers().map((customer: any) => {
    if (customer.id === custId) {
      customer.data = customer.data.filter((t: any) => t.id !== tId);
    }
    return customer;
  });
  saveCustomer(all);
  return all;
};

export const addCustomer = (customerData: any) => {
  return mainReducer({
    type: ADD_CUSTOMER,
    payload: customerData,
  });
};
export const getCustomer = (customerData: any) => {
  return mainReducer({
    type: GET_CUSTOMER,
  });
};

export const successNotification = (msg: string) => {
  notification.success({
    message: msg,
    duration: 5,
  });
};

export const failedNotification = (msg: string) => {
  notification.error({
    message: msg,
    duration: 5,
  });
};
