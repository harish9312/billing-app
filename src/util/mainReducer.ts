import PouchDB from "pouchdb";
import * as uuid from "uuid";
const db = new PouchDB("customer");
const customer_data = new PouchDB("customer_data");
export const mainReducer = (action: { type?: string; payload?: any }) => {
  switch (action.type) {
    case ADD_CUSTOMER:
      return db.put(action.payload).then((res) => res);
    case UPDATE_CUSTOMER:
      return db.get(action.payload.id).then((res) => {
        db.put({
          ...res,
          name: action.payload.name,
        });
      });

    case ADD_TRANSACTION:
      return customer_data
        .put({
          _id: uuid.v1(),
          customer_id: action.payload.id,
          data: action.payload.data,
          isCust: action.payload.isCust,
        })
        .then((res) => res);
    case GET_CUSTOMER:
      return db.allDocs({ include_docs: true }).then((res) => res);
    case GET_TRANSACTION:
      return customer_data.allDocs({ include_docs: true }).then((res) => res);
    case UPDATE_TRANSACTION:
      customer_data.get(action.payload.toDelete).then((res) => {
        customer_data.remove(res);
      });
      return customer_data
        .put({
          _id: uuid.v1(),
          customer_id: action.payload.id,
          data: action.payload.data,
        })
        .then((res) => res);
    case DELETE_TRANSACTION:
      return customer_data.get(action.payload.toDelete).then((res) => {
        customer_data.remove(res);
      });
    default:
      return {
        customers: db.allDocs({ include_docs: true }).then((res) => res),
        transactions: customer_data
          .allDocs({ include_docs: true })
          .then((res) => res),
      };
  }
};

export const ADD_CUSTOMER = "ADD_CUSTOMER";
export const ADD_TRANSACTION = "ADD_TRANSACTION";
export const GET_CUSTOMER = "GET_CUSTOMER";
export const GET_TRANSACTION = "GET_TRANSACTION";
export const UPDATE_TRANSACTION = "UPDATE_TRANSACTION";
export const DELETE_TRANSACTION = "DELETE_TRANSACTION";
export const UPDATE_CUSTOMER = "UPDATE_CUSTOMER";
