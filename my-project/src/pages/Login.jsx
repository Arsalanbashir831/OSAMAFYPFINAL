import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Connection/DB';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.username, values.password);
      console.log('Logged in user:', userCredential.user);
      message.success('Login successful!');
      navigate('/'); // Redirect on successful login
    } catch (error) {
      console.error('Login error:', error);
      message.error('Wrong credentials, please try again.' + error);
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
          rules={[{ required: true, message: 'Please input your Email!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
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

          <a className="login-form-forgot float-right" href="/forgot">
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
