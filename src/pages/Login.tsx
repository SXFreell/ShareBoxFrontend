import { Button, Form } from "@douyinfe/semi-ui"



function Login() {
  const printValues: Function = (values: any, message: string) => {
    console.log(message, values);
  }

  return (
    <>
      <Form
        layout="vertical"
        labelPosition="top"
        onValueChange={values => printValues(values, 'change')}
        onSubmit={values => printValues(values, 'success')}
        onSubmitFail={(_, values) => printValues(values, 'fail')}
      >
        <Form.Input field="Username" label="用户名" style={{ width: 200 }} />
        <Form.Input
          field="Password"
          label="密码"
          style={{ width: 200 }}
          rules={[
            { required: true, message: '请输入密码' },
          ]}
        />
        <Button htmlType="submit" type="primary">登录</Button>
      </Form>
    </>
  )
}

export default Login
