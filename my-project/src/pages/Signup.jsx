import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Connection/DB';
import logo from '../assets/logo.png'

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    setLoading(true);

    try {
      // Use Firebase Authentication to create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, values.username, values.password);
      console.log('Firebase user created: ', userCredential.user);
      message.success('Signup successful!');
      navigate('/'); // Redirect on successful signup
    } catch (error) {
      console.error('Signup error: ', error);
      message.error(error.message); // Display Firebase error message
    } finally {
      setLoading(false); // Ensure loading is stopped after handling the response
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3JpY2tldHxlbnwwfHwwfHx8MA%3D%3D)' }}>
      <div className="max-w-md w-full bg-white p-8 border rounded shadow-lg">
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="h-50 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Signup</h1>
        </div>
        <Form
          name="normal_signup"
          className="signup-form"
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
            <Button type="primary" htmlType="submit" className="signup-form-button w-full" loading={loading}>
              Signup
            </Button>
            <div className="text-center mt-4">
              Or <a href="/login">Login now!</a>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
