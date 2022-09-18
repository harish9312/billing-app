import { Button, Checkbox, Form, Input } from "antd";
import { failedNotification, successNotification } from "../../util/util";

export const MyForm = (props: any) => {
  const onFinish = (values: any) => {
    const userInfo = localStorage.getItem("userInfo");
    if (
      values.username === JSON.parse(userInfo as any).name &&
      values.password === JSON.parse(userInfo as any).password
    ) {
      successNotification("Login Successfull...!!!");
      props.onSubmit(true);
      return;
    }
    failedNotification("Invalid Username or...!!!");
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input placeholder="Username" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
