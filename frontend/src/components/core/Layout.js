import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isAuth, logout } from '../auth/helpers';

const Layout = ({ children, match, history }) => {
  const isActive = (path) => {
    if (match.path === path) {
      return 'active';
    }
  };

  const nav = () => (
    <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
      <Link to="/" className="navbar-brand">
        MERN Boilerplate
      </Link>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            Home
          </Link>
        </li>
        {!isAuth() && (
          <>
            <li className="nav-item">
              <Link to="/login" className={`nav-link ${isActive('/login')}`}>
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/register"
                className={`nav-link ${isActive('/register')}`}
              >
                Register
              </Link>
            </li>
          </>
        )}

        {isAuth() && isAuth().role === 'admin' && (
          <li className="nav-item">
            <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>
              Admin Dashboard
            </Link>
          </li>
        )}

        {isAuth() && isAuth().role === 'subscriber' && (
          <li className="nav-item">
            <Link to="/private" className={`nav-link ${isActive('/private')}`}>
              Dashboard
            </Link>
          </li>
        )}

        {isAuth() && (
          <>
            <li className="nav-item">
              <span className="nav-link">{isAuth().name}</span>
            </li>
            <li className="nav-item">
              <span
                className="nav-link"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  logout(() => {
                    history.push('/');
                  });
                }}
              >
                Logout
              </span>
            </li>
          </>
        )}
      </ul>
    </nav>
  );

  return (
    <>
      {nav()}
      <div className="container">{children}</div>
    </>
  );
};

export default withRouter(Layout);
