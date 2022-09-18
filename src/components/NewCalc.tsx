import { Button, DatePicker, Form, Input } from "antd";
import moment from "moment";
import * as React from "react";
import * as uuid from "uuid";
import {
  ADD_TRANSACTION,
  GET_CUSTOMER,
  mainReducer,
  UPDATE_TRANSACTION,
} from "../util/mainReducer";
import { saveCustomer, successNotification } from "../util/util";

export const NewCalc = (props: any) => {
  console.log(">> props", props);
  return (
    <div className="new-calc">
      <h1>{props.data.name || props.editValues.name}</h1>
      <hr />
      <CalcForm {...props} />
    </div>
  );
};

const CalcForm = (props: any) => {
  const [customers, setCustomers] = React.useState({
    rows: [],
  });

  React.useEffect(() => {
    const getAllCustomers = async () => {
      setCustomers((await mainReducer({ type: GET_CUSTOMER })) as any);
    };
    getAllCustomers();
  }, []);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log(">> values", values);
    if (!values.date) {
      values.date = moment().format("DD-MM-YYYY");
    } else {
      values.date = moment(values.date).format("DD-MM-YYYY");
    }
    const { id } = props.data;
    const tId = uuid.v1();
    values.id = tId;
    if (props.isCust) {
      values.intake = true;
    }
    const allCustomers = customers.rows.map(({ doc }: any) => {
      if (id === doc.id) {
        if (!doc.data) {
          doc.data = [];
        }
        doc.data.push(values);
      }
      return doc;
    });
    saveCustomer(allCustomers);
    if (props.isEdit) {
      mainReducer({
        type: UPDATE_TRANSACTION,
        payload: {
          data: values,
          id: id,
          toDelete: props.editValues.id,
          _rev: props.editValues._rev,
          isCust: props.isCust,
        },
      });
      successNotification(`Transaction Updated for [ ${props.data.name} ]`);
    } else {
      mainReducer({
        type: ADD_TRANSACTION,
        payload: {
          id: id,
          data: values,
          isCust: props.isCust,
        },
      });
      successNotification(`Transaction Added for [ ${props.data.name} ]`);
    }
    props.onBack();
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onFineChange = (e: any) => {
    const { value } = e.target;
    const weight = form.getFieldValue("weight");
    const netFine = (weight * value) / 100;
    form.resetFields(["netFine"]);
    form.setFieldsValue({
      netFine: Math.round(netFine),
    });
  };
  const onFineChangeAmount = (e: any) => {
    const { value } = e.target;
    const amount = form.getFieldValue("amount");
    const netFine = amount / value;
    form.resetFields(["orNetFine"]);
    form.setFieldsValue({
      orNetFine: Math.round(netFine),
    });
  };

  let initialValues: any = {
    date: moment(),
  };
  if (props.isEdit) {
    initialValues = {
      ...props.editValues,
      date: moment(new Date(props.editValues.date)),
    };
  }
  return (
    <>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        <Form.Item label="Date" name="date">
          <DatePicker format={"DD-MM-YYYY"} name="date" />
        </Form.Item>
        <Form.Item
          label="Weight in gm"
          name="weight"
          rules={[{ required: true, message: "Please input your weight!" }]}
        >
          <Input name="weight" type="number" />
        </Form.Item>
        <Form.Item
          label="Fine in %"
          name="fine"
          rules={[{ required: true, message: "Please input your fine!" }]}
        >
          <Input onChange={onFineChange} type="number" />
        </Form.Item>
        <Form.Item
          label="Net Fine in gm"
          name="netFine"
          rules={[{ required: true, message: "Please input your net fine!" }]}
        >
          <Input name="netFine" type="number" />
        </Form.Item>
        {!props.isCust && (
          <Form.Item
            label="Labour Charge in ₹"
            name="labourCharge"
            rules={[
              {
                required: true,
                message: "Please input your net Labour Charge!",
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
        )}

        {props.isCust && (
          <div>
            <h1>OR</h1>
            <Form.Item
              label="Amount"
              name="amount"
              rules={[
                { required: true, message: "Please input your net fine!" },
              ]}
            >
              <Input name="amount" type="number" />
            </Form.Item>
            <Form.Item
              label="Rate"
              name="rate"
              rules={[
                { required: true, message: "Please input your net fine!" },
              ]}
            >
              <Input onChange={onFineChangeAmount} name="rate" type="number" />
            </Form.Item>
            <Form.Item
              label="Net Fine"
              name="orNetFine"
              rules={[
                { required: true, message: "Please input your net fine!" },
              ]}
            >
              <Input name="orNetFine" type="number" />
            </Form.Item>
            <Form.Item
              label="Labour Charge"
              name="orLabourCharge"
              rules={[
                { required: true, message: "Please input your net fine!" },
              ]}
            >
              <Input name="orLabourCharge" type="number" />
            </Form.Item>
          </div>
        )}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <button
        className="ant-btn ant-btn-primary back-button"
        onClick={props.onBack}
      >
        Back
      </button>
    </>
  );
};
