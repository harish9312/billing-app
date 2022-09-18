import { Button, Form, Input, Spin } from "antd";
import React from "react";
import * as uuid from "uuid";
import { GET_CUSTOMER, mainReducer } from "../util/mainReducer";
import { addCustomer, saveCustomers, successNotification } from "../util/util";
import "./home.scss";
export const Home = (props: any) => {
  const [customers, setCustomers] = React.useState();
  const [isAddNew, setAddNew] = React.useState("Home");
  const [isLoading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const getAllCustomers = async () => {
      setCustomers((await mainReducer({ type: GET_CUSTOMER })) as any);
      setLoading(false);
    };
    getAllCustomers();
  }, [isAddNew]);
  if (isAddNew === "New") {
    return (
      <CustomerForm
        {...props}
        onBack={() => setAddNew("Home")}
        onSubmit={() => setAddNew("Home")}
      />
    );
  }
  if (isAddNew === "Change_Password") {
    return (
      <PasswordForm
        {...props}
        onBack={() => setAddNew("Home")}
        onSubmit={() => setAddNew("Home")}
      />
    );
  }
  return (
    <div className="home">
      <h1>Home</h1>
      <button
        className="ant-btn ant-btn-primary logout"
        onClick={() => {
          localStorage.removeItem("isLoggedIn");
          window.location.href = "/";
        }}
      >
        Logout
      </button>
      <hr />{" "}
      <button
        className="ant-btn ant-btn-primary"
        onClick={() => setAddNew("New")}
      >
        Add New Customer
      </button>{" "}
      <hr />{" "}
      <div className="header-name">
        {isLoading && <Spin size="large" />}
        {((customers as any)?.rows || []).map(({ doc }: any) => {
          return (
            <div
              onClick={() => props.setActive(doc)}
              className="customer-name"
              key={doc.name}
            >
              {doc.name}
            </div>
          );
        })}
      </div>
      <button
        className="ant-btn ant-btn-primary change-password"
        onClick={() => setAddNew("Change_Password")}
      >
        Change Password
      </button>
    </div>
  );
};

const CustomerForm = (props: any) => {
  const onFinish = (values: any) => {
    const cus = {
      id: uuid.v1(),
      _id: uuid.v1(),
      data: [],
      name: values.name,
    };
    addCustomer(cus);
    saveCustomers(cus);
    successNotification(`{${values.name}} Added to Customers`);
    props.onSubmit();
  };
  return (
    <div className="customer-add">
      <button
        className="ant-btn ant-btn-primary back-button"
        onClick={props.onBack}
      >
        Back
      </button>
      <h1>Add New Customer</h1>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input name="name" type="text" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>{" "}
    </div>
  );
};

const PasswordForm = (props: any) => {
  const onFinish = (values: any) => {
    localStorage.setItem("userInfo", JSON.stringify(values));
    props.onBack();
  };
  return (
    <div className="customer-add">
      <button
        className="ant-btn ant-btn-primary back-button"
        onClick={props.onBack}
      >
        Back
      </button>
      <h1>Change Password</h1>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input name="name" type="text" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password name="password" type="password" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>{" "}
    </div>
  );
};
