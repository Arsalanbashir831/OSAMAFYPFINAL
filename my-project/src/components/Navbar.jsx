import React, { useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: 'Live Matches', path: '/', isExternal: false },
    { name: 'League', path: '/league', isExternal: false },
    { name: 'Players', path: '/team', isExternal: false },
    { name: 'AI Chat', path: '/chatbot', isExternal: false },
    { name: 'Score Prediction', path: 'http://127.0.0.1:4000/prediction', isExternal: true },
  ];

  const userMenu = (
    <Menu>
      {/* Uncomment if needed
      <Menu.Item key="profile">
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="settings">
        <Link to="/settings">Settings</Link>
      </Menu.Item> */}
      <Menu.Item key="logout">
        <Link to="/login">Logout</Link>
      </Menu.Item>
    </Menu>
  );

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    },
    closed: {
      x: '-100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="bg-blue-900 text-white">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">CricApp</Link>
        <div className="hidden md:flex space-x-4">
          {navLinks.map(link => link.isExternal ? (
            <a key={link.name} href={link.path} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
              {link.name}
            </a>
          ) : (
            <Link key={link.name} to={link.path} className="hover:text-gray-300">
              {link.name}
            </Link>
          ))}
          <Dropdown overlay={userMenu} trigger={['click']}>
            <a onClick={e => e.preventDefault()} className="hover:text-gray-300 flex items-center">
              <UserOutlined /> <span className="ml-2">Account</span>
            </a>
          </Dropdown>
        </div>
        <MenuOutlined className="md:hidden cursor-pointer" onClick={toggleMenu} />
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden absolute w-full bg-blue-900 shadow-lg z-10 h-[100vh]"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="p-4 flex flex-col space-y-4">
              {navLinks.map(link => link.isExternal ? (
                <a key={link.name} href={link.path} onClick={toggleMenu} target="_blank" rel="noopener noreferrer">
                  {link.name}
                </a>
              ) : (
                <Link key={link.name} to={link.path} onClick={toggleMenu}>
                  {link.name}
                </Link>
              ))}
              <Dropdown overlay={userMenu} trigger={['click']}>
                <a onClick={e => e.preventDefault()}>Account <UserOutlined /></a>
              </Dropdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
