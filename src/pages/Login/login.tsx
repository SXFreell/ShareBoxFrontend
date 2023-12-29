import { Button, Form, Input, Space } from "@arco-design/web-react"

import styles from './login.module.less'

function Login() {
  const printValues: Function = (values: any, message: string) => {
    console.log(message, values);
  }

  return (
    <Space className={styles['space-margin']}>
      <Form
        layout="vertical"
        // labelPosition="top"
        // onValueChange={values => printValues(values, 'change')}
        onSubmit={values => printValues(values, 'success')}
        // onSubmitFail={(_, values) => printValues(values, 'fail')}
      >
        <Form.Item field="Username" label="用户名" style={{ width: 200 }}>
          <Input></Input>
        </Form.Item>
        <Form.Item
          field="Password"
          label="密码"
          style={{ width: 200 }}
          rules={[
            { required: true, message: '请输入密码' },
          ]}
        >
          <Input.Password></Input.Password>
        </Form.Item>
        <Space>
          <Button htmlType="submit">登录</Button>
        </Space>
      </Form>
    </Space>
  )
}

export default Login
