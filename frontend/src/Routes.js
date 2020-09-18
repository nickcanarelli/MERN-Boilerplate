import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from './App';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Activate from './components/auth/Activate';
import Private from './components/core/Private';
import Admin from './components/core/Admin';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/auth/activate/:token" component={Activate} />
        <Route path="/auth/recover-password" component={ForgotPassword} />
        <Route path="/auth/reset-password/:token" component={ResetPassword} />
        <PrivateRoute path="/private" component={Private} />
        <AdminRoute path="/admin" component={Admin} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
