import cookie from 'js-cookie';

// Set in Cookie
export const setCookie = (key, value) => {
  if (window !== 'undefined') {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

// Remove from Cookie
export const removeCookie = (key) => {
  if (window !== 'undefined') {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

// Get from Cookie such as stored Token
export const getCookie = (key) => {
  if (window !== 'undefined') {
    return cookie.get(key);
  }
};

// Set in LocalStorage
export const setLocalStorage = (key, value) => {
  if (window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Remove from LocalStorage
export const removeLocalStorage = (key) => {
  if (window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

// Authenticate user by passing data to Cookie and LocalStorage during signin
export const authenticate = (response, next) => {
  setCookie('token', response.data.token);
  setLocalStorage('user', response.data.user);
  next();
};

// Access user info from LocalStorage
export const isAuth = () => {
  if (window !== 'undefined') {
    const cookieChecked = getCookie('token');

    if (cookieChecked) {
      if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user'));
      } else {
        return false;
      }
    }
  }
};

export const logout = (next) => {
  removeCookie('token');
  removeLocalStorage('user');
  next();
};

export const updateUser = (response, next) => {
  if (window !== 'undefined') {
    let auth = JSON.parse(localStorage.getItem('user'));
    auth = response.data;
    localStorage.setItem('user', JSON.stringify(auth));
  }
  next();
};
