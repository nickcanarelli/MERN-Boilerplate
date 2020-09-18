const User = require('../models/user');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const expressJwt = require('express-jwt');
const _ = require('lodash');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((error, user) => {
    if (user) {
      return res.status(400).json({
        error: 'Email is taken',
      });
    }
    const token = jwt.sign({ name, email, password }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account Activation Confirmation`,
      html: `
        <h1>Please use the following link to activate your account.</h1>
        <p>${process.env.FRONTEND_URL}/auth/activate/${token}</p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>${process.env.FRONTEND_URL}</p>
      `,
    };

    sgMail
      .send(emailData)
      .then((sent) => {
        console.log('Signup email sent', sent);
        return res.json({
          message: `Email has been sent to ${email}. Follow the instructions to activate your account.`,
        });
      })
      .catch((error) => {
        return res.json({
          message: error.message,
        });
      });
  });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function (error, decoded) {
      if (error) {
        console.log('JWT Verify in Account Activation Error: ', error);
        return res.status(401).json({
          error: 'Expired link. Signup again',
        });
      }

      const { name, email, password } = jwt.decode(token);

      const user = new User({ name, email, password });

      user.save((error, user) => {
        if (error) {
          console.log('Save user in account activation error: ', error);
          return res.status(401).json({
            error: 'Error saving user in database.',
          });
        }
        return res.json({
          message: 'Signup success. Please sign in.',
        });
      });
    });
  } else {
    return res.json({
      message: 'Something went wrong. Try again.',
    });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  User.findOne({ email }).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist. Please signup.',
      });
    }

    // Authenticate User
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Email and password do match.',
      });
    }

    // Generate a token and send to frontend
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const { _id, name, email, role } = user;

    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

exports.requireLogin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});

exports.adminMiddleware = (req, res, next) => {
  User.findById({ _id: req.user._id }).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    if (user.role !== 'admin') {
      return res.status(400).json({
        error: 'Unauthorized access.',
      });
    }

    req.profile = user;
    next();
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, (error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist.',
      });
    }

    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: '12h',
      }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Password Reset Confirmation`,
      html: `
        <h1>Please use the following link to reset your password.</h1>
        <p>${process.env.FRONTEND_URL}/auth/reset-password/${token}</p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>${process.env.FRONTEND_URL}</p>
      `,
    };

    return user.updateOne({ resetPasswordLink: token }, (error, success) => {
      if (error) {
        return res.status(400).json({
          error: 'Database connection error on user password forgot request.',
        });
      } else {
        sgMail
          .send(emailData)
          .then((sent) => {
            console.log('Password reset email sent', sent);
            return res.json({
              message: `Email has been sent to ${email}. Follow the instructions to activate your account.`,
            });
          })
          .catch((error) => {
            return res.json({
              message: error.message,
            });
          });
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(400).json({
          error: 'Expired link. Try again.',
        });
      }
      User.findOne({ resetPasswordLink }, (error, user) => {
        if (error || !user) {
          return res.status(400).json({
            error: 'Something went wrong. Please try again.',
          });
        }
        const updatedFields = {
          password: newPassword,
          resetPasswordLink: '',
        };

        user = _.extend(user, updatedFields);

        user.save((error, result) => {
          if (error) {
            return res.status(400).json({
              error: 'Error resetting user password.',
            });
          }
          res.json({
            message: `Great! Now you can login with your new password.`,
          });
        });
      });
    });
  }
};
