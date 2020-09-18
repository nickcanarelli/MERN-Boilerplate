import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Layout from '../core/Layout';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { isAuth } from './helpers';

const Register = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    buttonText: 'Submit',
  });

  const { name, email, password, buttonText } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: 'Submitting' });

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/register`,
      data: {
        name,
        email,
        password,
      },
    })
      .then((response) => {
        setValues({
          ...values,
          name: '',
          email: '',
          password: '',
          buttonText: 'Submitted',
        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        setValues({ ...values, buttonText: 'Submit' });
        toast.error(error.response.data.error);
      });
  };

  const registerForm = () => (
    <form>
      <div className="form-group">
        <label htmlFor="name" className="text-muted">
          Name:
        </label>
        <input
          id="name"
          type="text"
          className="form-control"
          value={name}
          onChange={handleChange('name')}
        />
      </div>
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
        <h1 className="p-5 text-center">Register</h1>
        {registerForm()}
      </div>
    </Layout>
  );
};

export default Register;
