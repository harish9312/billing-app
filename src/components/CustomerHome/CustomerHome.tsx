import { Input, Modal, Spin, Tabs } from "antd";
import React from "react";
import {
  DELETE_TRANSACTION,
  GET_CUSTOMER,
  GET_TRANSACTION,
  mainReducer,
  UPDATE_CUSTOMER,
} from "../../util/mainReducer";
import { deleteTransaction, successNotification } from "../../util/util";
import "./customerHome.scss";
const { TabPane } = Tabs;

export const CustomerHome = (props: any) => {
  const [isLoading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("LEN");
  const [customers, setCustomers] = React.useState([
    {
      data: [],
    },
  ] as any);
  const [deleteModal, openDeleteModal] = React.useState({} as any);
  const [name, setName] = React.useState("");
  const [isEditing, setEditing] = React.useState({
    name: "",
    value: false,
    newName: "",
  });

  React.useEffect(() => {
    const getAllCustomers = async () => {
      const allCust = (await mainReducer({ type: GET_CUSTOMER })) as any;
      const allTransaction = (await mainReducer({
        type: GET_TRANSACTION,
      })) as any;
      const allData = allCust.rows.map(({ doc: custDoc }: any) => {
        const data = allTransaction.rows.filter(({ doc }: any) => {
          return doc.customer_id === custDoc.id;
        });
        custDoc.data = data.map((x: any) => ({
          ...x.doc.data,
          id: x.id,
          isCust: x.doc.isCust,
          _rev: x.doc._rev,
        }));
        return custDoc;
      });
      setCustomers(allData);
      setLoading(false);
    };
    getAllCustomers();
  }, []);

  const netFineRemain = customers
    .find((x: any) => x.id === props.data.id)
    ?.data.map((x: any) => {
      if (x.intake) {
        return -(x.orNetFine + x.netFine);
      }
      return x.netFine;
    })
    .reduce((x: any, y: any) => x + y, 0);

  const orLabourCharge = customers
    .find((x: any) => x.id === props.data.id)
    ?.data.map((x: any) => {
      if (x.intake) {
        if (!isNaN(x.orLabourCharge)) {
          return -Number(x.orLabourCharge);
        }
      }
      if (!isNaN(x.labourCharge)) {
        return Number(x.labourCharge);
      }
      return 0;
    })
    .filter((x: any) => x)
    .reduce((x: any, y: any) => x + y, 0);
  console.log(">> customers", customers);
  return (
    <div className="customer-home">
      <div className="top-pane">
        <button
          className="ant-btn ant-btn-primary back-button"
          onClick={props.onBack}
        >
          Back
        </button>
        <h1>
          <div className={isEditing.value ? "top-name" : "top-to-edit"}>
            {isEditing.name === props.data.name && (
              <Input
                type="text"
                defaultValue={props.data.name}
                onChange={(e: any) => setName(e.target.value)}
              />
            )}
            {isEditing.newName && isEditing.newName}
            {!isEditing.value && !isEditing.newName && props.data.name}
            {!isEditing.value ? (
              <i
                onClick={() =>
                  setEditing({
                    value: true,
                    name: props.data.name,
                    newName: "",
                  })
                }
                className="fa fa-pencil"
              />
            ) : (
              <i
                onClick={() => {
                  setEditing({ value: false, name: "", newName: name });
                  mainReducer({
                    type: UPDATE_CUSTOMER,
                    payload: {
                      name,
                      id: props.data._id,
                    },
                  });
                  successNotification(`Customer Name Changed to ${name}`);
                }}
                className="fa fa-check"
              />
            )}
          </div>
        </h1>
        <hr />
        <button
          className="ant-btn ant-btn-primary"
          style={{ margin: "10px" }}
          onClick={() => {
            props.addNewCalc(props.data, "NEWCALC");
          }}
        >
          New Transaction
        </button>
        <button
          style={{ margin: "10px" }}
          className="ant-btn ant-btn-primary"
          onClick={() => {
            props.addNewCalc(props.data, "NEWCALCCUST");
          }}
        >
          New Amount/Weight
        </button>
        <div className="net-fine-container">
          <div className="net-fine-remain">
            <div className="name-label">Net Fine</div>
            <div>{netFineRemain} gm</div>
          </div>
          <div className="net-fine-remain">
            <div className="name-label">Labour Cost</div>
            <div>₹{orLabourCharge}</div>
          </div>
        </div>
        {!customers.length && <h1>No Customer Added</h1>}
        <Tabs defaultActiveKey="1" onChange={(key) => setActiveTab(key)}>
          <TabPane tab="LEN" key="LEN">
            {isLoading && <Spin size="large" />}
            <h3>
              {!customers.find((x: any) => x.id === props.data.id)?.data
                .length && "No Data"}
            </h3>{" "}
          </TabPane>
          <TabPane tab="DEN" key="DEN">
            {isLoading && <Spin size="large" />}
            <h3>
              {!customers.find((x: any) => x.id === props.data.id)?.data
                .length && "No Data"}
            </h3>
          </TabPane>
        </Tabs>
      </div>
      <div className="transactions">
        {customers
          .find((x: any) => x.id === props.data.id)
          ?.data.filter((x: any) =>
            activeTab === "LEN" ? !x.intake : x.intake
          )
          .map((x: any) => {
            return (
              <div className="row-card">
                <i
                  onClick={() => props.setEdit(x, props.data)}
                  className="fa fa-pencil"
                  aria-hidden="true"
                ></i>
                <i
                  onClick={() => openDeleteModal(x)}
                  className="fa fa-trash-o"
                  aria-hidden="true"
                ></i>
                <Modal
                  title="Basic Modal"
                  visible={JSON.stringify(deleteModal).length > 10}
                  onOk={() => {
                    setCustomers(
                      deleteTransaction(deleteModal.id, props.data.id)
                    );
                    mainReducer({
                      type: DELETE_TRANSACTION,
                      payload: {
                        toDelete: deleteModal.id,
                      },
                    });
                    successNotification(
                      `Transaction Deleted of Date: ${deleteModal.date}`
                    );
                    openDeleteModal({});
                  }}
                  onCancel={() => openDeleteModal({})}
                >
                  Confirm Delete Transaction?
                </Modal>
                <div className="row-data-new">
                  <div className="row-data">
                    <div className="name-label">Date</div>
                    <div>{x.date}</div>
                  </div>
                  <div className="row-data">
                    <div className="name-label">Weight</div>
                    <div>{x.weight} gm</div>
                  </div>
                  <div className="row-data">
                    <div className="name-label">Fine</div>
                    <div>{x.fine}%</div>
                  </div>
                  <div className="row-data">
                    <div className="name-label"> Net Fine</div>
                    <div>{x.netFine} gm</div>
                  </div>
                  <div className="row-data">
                    <div className="name-label">Labour Charge</div>
                    <div>₹{x.labourCharge || "NA"}</div>
                  </div>
                  <div className="row-data">
                    <div className="name-label">Amount</div>
                    <div>₹{x.amount || "NA"}</div>
                  </div>
                  <div className="row-data">
                    <div className="name-label">Rate</div>
                    <div>₹{x.rate || "NA"}</div>
                  </div>
                  <div className="row-data">
                    <div className="name-label">Net Fine Given</div>
                    <div>{x.orNetFine || "NA"} gm</div>
                  </div>
                  <div className="row-data">
                    <div className="name-label">Labour Charge Given</div>
                    <div>₹{x.orLabourCharge || "NA"}</div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
