import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Connection/DB';
import logo from '../assets/logo.png'

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
    <div className="min-h-screen   bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3JpY2tldHxlbnwwfHwwfHx8MA%3D%3D)' }}>
      <div className="max-w-md w-full bg-white p-8 border rounded shadow-lg">
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="h-30 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Login</h1>
        </div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
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
            <div className="text-center mt-4">
              Or <a href="/signup">register now!</a>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
