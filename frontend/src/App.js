import React from 'react';
import Layout from './components/core/Layout';

const App = () => {
  return (
    <>
      <Layout>
        <div className="col-md-8 offset-md-2 text-center">
          <h1 className="pt-5">MERN Authentication Boilerplate</h1>
          <hr />
          <p className="lead">
            MERN authentication system with the following features:
          </p>
          <ul className="text-left w-50p mx-auto" style={{ width: '70%' }}>
            <li>Login (email/password)</li>
            <li>Register</li>
            <li>Account Activation (email)</li>
            <li>Forgot Password</li>
            <li>Reset Password</li>
            <li>Private Routes for Authenticated Users with Roles</li>
            <li>Roles:</li>
            <ul>
              <li>Subscriber</li>
              <li>Admin</li>
            </ul>
          </ul>
          <p className="lead pt-5">
            This was built to bootstrap fullscale production-ready MERN stack
            applications and remove the hassle of rewriting basic authentication
            functionality.
          </p>
        </div>
      </Layout>
    </>
  );
};

export default App;
