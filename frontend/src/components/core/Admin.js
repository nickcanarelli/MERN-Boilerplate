import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { isAuth, getCookie, logout, updateUser } from '../auth/helpers';

const Admin = ({ history }) => {
  const [values, setValues] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    buttonText: 'Submit',
  });

  const token = getCookie('token');

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = () => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const { role, name, email } = response.data;
        setValues({ ...values, role, name, email });
      })
      .catch((error) => {
        if (error.response.status === 401) {
          logout(() => {
            history.push('/');
          });
        }
      });
  };

  const { role, name, email, password, buttonText } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: 'Submitting' });

    axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API}/admin/update`,
      data: {
        name,
        password,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        updateUser(response, () => {
          setValues({ ...values, buttonText: 'Submit' });
          toast.success('Profile updated successfully.');
        });
      })
      .catch((error) => {
        setValues({ ...values, buttonText: 'Submit' });
        toast.error(error.response.data.error);
      });
  };

  const updateForm = () => (
    <form>
      <div className="form-group">
        <label htmlFor="role" className="text-muted">
          Role:
        </label>
        <input
          id="role"
          type="text"
          className="form-control"
          defaultValue={role}
          disabled
        />
      </div>
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
          defaultValue={email}
          disabled
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
        <h1 className="pt-5 text-center">Admin</h1>
        <p className="lead text-center">Update Profile</p>
        {updateForm()}
      </div>
    </Layout>
  );
};

export default Admin;
