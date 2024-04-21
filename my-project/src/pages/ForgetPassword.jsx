import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Connection/DB';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    sendPasswordResetEmail(auth, values.email)
        .then((response) => {
            // console.log(response);
            message.success('If your email is registered with us, you will receive a password reset link.');
            navigate('/login');
        })
        .catch((error) => {
            console.error('Error sending password reset email:', error);
            message.error(error.message);
        })
        .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Form
        name="reset_password"
        className="reset-form max-w-md w-full bg-white p-8 border rounded shadow-lg"
        onFinish={onFinish}
      >
        <h1 className='text-xl font-bold py-5 text-center'>Reset Password</h1>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="reset-form-button w-full" loading={loading}>
            Send Reset Email
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPassword;
