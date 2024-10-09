const express = require('express');
const router = express.Router();

const {
  register,
  login,
  verifyEmail,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  verifyUser,
  enable2FA,
  verify2FA,
  changeUserRole,
  verify,
  requestPasswordReset,
  resetPassword,
  disable2FA,
  loginverify,
  loginotpstatus,
  googleAuth,
  removeProfilePhoto,
  verifylogin2FA,
  sendgmailotp,
  lockscreencheck,
  assignpagestoUser,
  removepagesfromUser,
  removeCoverPhoto
} = require('../controller/user.controller');

const { authenticateToken, authorizeRole, isAdmin } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/loginverify', loginverify);
router.post('/loginverify2fa', verifylogin2FA);
router.post('/sendgmailotp', sendgmailotp);

router.get('/verify-email/:token', verifyEmail);
router.post('/verifyotp', verify);
router.delete('/removeProfilePhoto', authenticateToken, removeProfilePhoto);
router.delete('/removeCoverPhoto', authenticateToken, removeCoverPhoto);


router.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

router.get('/admin-only', authenticateToken, authorizeRole(['Admin']), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

router.post('/enable-2fa', authenticateToken, enable2FA);
router.post('/verify-2fa', authenticateToken, verify2FA);
router.post('/disable-2fa', authenticateToken, disable2FA);

router.get('/verify', authenticateToken, verifyUser);
router.get('/getAllusers', isAdmin, getAllUsers);

router.post('/google-auth', googleAuth);

router.get('/users', authenticateToken, authorizeRole(['Admin']), getAllUsers);
router.get('/users/:id', authenticateToken, authorizeRole(['Admin']), getUserById);
router.post('/users/update', authenticateToken, updateUser);
router.delete('/users/:id', isAdmin, deleteUser);
router.put('/users/change-role/:id', isAdmin, changeUserRole);
router.put('/loginoptstatus', authenticateToken, loginotpstatus);
router.post('/lockscreencheck', authenticateToken, lockscreencheck);
router.post('/assignpages/:id', isAdmin, assignpagestoUser);
router.post('/removepages/:id', isAdmin, removepagesfromUser);

// router.patch('/users/:id/change-password', authenticateToken, authorizeRole(['Super Admin']), changeUserPassword);

module.exports = router;