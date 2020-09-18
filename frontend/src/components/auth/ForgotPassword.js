import React, { useState } from 'react';
import Layout from '../core/Layout';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const ForgotPassword = ({ history }) => {
  const [values, setValues] = useState({
    email: '',
    buttonText: 'Reset Password',
  });

  const { email, buttonText } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: 'Resetting Password' });

    axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API}/forgot-password`,
      data: {
        email,
      },
    })
      .then((response) => {
        // Save the response (user, token) in localstorage/cookie
        toast.success(response.data.message);
        setValues({ ...values, buttonText: 'Requested' });
      })
      .catch((error) => {
        setValues({ ...values, buttonText: 'Reset Password' });
        toast.error(error.response.data.error);
      });
  };

  const forgotPasswordForm = () => (
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
        <h1 className="p-5 text-center">Recover Password</h1>
        {forgotPasswordForm()}
      </div>
    </Layout>
  );
};

export default ForgotPassword;
