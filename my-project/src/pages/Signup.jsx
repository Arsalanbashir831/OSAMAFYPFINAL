import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Connection/DB';

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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Form
        name="normal_login"
        className="login-form max-w-md w-full bg-white p-8 border rounded shadow-lg"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <h1 className='text-xl font-bold py-5 text-center'>Signup</h1>
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
          <Button type="primary" htmlType="submit" className="login-form-button w-full" loading={loading}>
            Signup
          </Button>
          Or <a href="/login">Login now!</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;
