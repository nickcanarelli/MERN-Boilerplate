import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Layout from '../core/Layout';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { authenticate, isAuth } from './helpers';

const Login = ({ history }) => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    buttonText: 'Sign In',
  });

  const { email, password, buttonText } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: 'Submitting' });

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/login`,
      data: {
        email,
        password,
      },
    })
      .then((response) => {
        // Save the response (user, token) in localstorage/cookie
        authenticate(response, () => {
          setValues({
            ...values,
            email: '',
            password: '',
            buttonText: 'Signing In',
          });
          isAuth() && isAuth().role === 'admin'
            ? history.push('/admin')
            : history.push('/private');
        });
      })
      .catch((error) => {
        console.log('Sign In Error: ', error.response.data);
        setValues({ ...values, buttonText: 'Sign In' });
        toast.error(error.response.data.error);
      });
  };

  const loginForm = () => (
    <form>
      <div className="form-group">
        <label htmlFor="email" className="text-muted">
          Email Address:
        </label>
        <input
          id="email"
          type="email"
          className="form-control"
          value={email}
          onChange={handleChange('email')}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password" className="text-muted">
          Password:
        </label>
        <input
          id="password"
          type="password"
          value={password}
          className="form-control"
          onChange={handleChange('password')}
        />
      </div>
      <Link to="/auth/recover-password" className="d-flex mb-3">
        Forgot Password
      </Link>
      <div>
        <button className="btn btn-primary" onClick={handleSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {isAuth() ? <Redirect to="/" /> : null}
        <h1 className="p-5 text-center">Sign In</h1>
        {loginForm()}
      </div>
    </Layout>
  );
};

export default Login;
