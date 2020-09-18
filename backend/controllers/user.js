const User = require('../models/user');

exports.read = (req, res) => {
  const userId = req.params.id;

  User.findById(userId).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  });
};

exports.update = (req, res) => {
  const { name, password } = req.body;

  User.findOne({ _id: req.user._id }, (error, user) => {
    if (error || !user) {
      return res.stats(400).json({
        error: 'User not found',
      });
    }
    if (!name) {
      return res.status(400).json({
        error: 'Name is required',
      });
    } else {
      user.name = name;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: 'Password must be a minimum of 6 characters',
        });
      } else {
        user.password = password;
      }
    }
    user.save((error, updatedUser) => {
      if (error) {
        return res.status(400).json({
          error: 'User update failed. Please try again.',
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};
