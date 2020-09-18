import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import jwt from 'jsonwebtoken';

const ResetPassword = ({ match, history }) => {
  const [values, setValues] = useState({
    name: '',
    token: '',
    newPassword: '',
    buttonText: 'Reset Password',
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);

    if (token) {
      setValues({ ...values, name, token });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { name, token, newPassword, buttonText } = values;

  const handleChange = (event) => {
    setValues({ ...values, newPassword: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: 'Resetting Password' });

    axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API}/reset-password`,
      data: {
        newPassword,
        resetPasswordLink: token,
      },
    })
      .then((response) => {
        toast.success(response.data.message);
        setValues({ ...values, buttonText: 'Resetting' });
        history.push('/login');
      })
      .catch((error) => {
        setValues({ ...values, buttonText: 'Reset Password' });
        toast.error(error.response.data.error);
      });
  };

  const resetPasswordForm = () => (
    <form>
      <div className="form-group">
        <label htmlFor="password" className="text-muted">
          Password:
        </label>
        <input
          id="password"
          type="password"
          className="form-control"
          value={newPassword}
          onChange={handleChange}
          required
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
        <h1 className="p-5 text-center">Reset Password</h1>
        <p>Hey {name}, please reset your password.</p>
        {resetPasswordForm()}
      </div>
    </Layout>
  );
};

export default ResetPassword;
