import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    setLoading(true); // Set loading before API call

    try {
      const response = await axios.post('http://127.0.0.1:4000/login', {
        username: values.username,
        password: values.password
      });

      if (response.status === 200) {
        message.success('Login successful!');
        navigate('/'); // Redirect on successful login
      } else {
        // As it's unusual to hit this block because errors usually throw an exception, just in case
        message.error('Unexpected status code returned.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        message.error('Wrong credentials, please try again.');
      } else {
        message.error('Login failed. Please try again later.');
      }
      console.log(error);
    } finally {
      setLoading(false); // Ensure loading is false after handling the response
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Form
        name="normal_login"
        className="login-form max-w-md w-full bg-white p-8 border rounded shadow-lg"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <h1 className='text-xl font-bold py-5 text-center'>Login</h1>
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <a className="login-form-forgot float-right" href="#" onClick={(e) => e.preventDefault()}>
            Forgot password
          </a>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button w-full" loading={loading}>
            Log in
          </Button>
          Or <a href="/signup">register now!</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
