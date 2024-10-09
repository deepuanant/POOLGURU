const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

// Google Authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { 
    failureRedirect: '/login'
}), (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    const user = req.user;
    const token = generateToken(user);
    const userData = JSON.stringify({
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        department: user.department,
        twoFactorEnabled: user.twoFactorEnabled,
        otpVerify: user.otpVerify,
        twofactorqr: user.twofactorqr,
        firstname: user.firstname,
        lastname: user.lastname,
        verified2fa: user.verified2fa,
        isVerified: user.isVerified,
        profilephoto: user.profilephoto,
    });
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${token}&user=${encodeURIComponent(userData)}`);
});

router.get('/auth/microsoft',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/');
    });
  
  router.post('/auth/microsoft/callback',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' ,}),
    (req, res) => {
      if (!req.user) {
        return res.redirect('/login');
      }
        const user = req.user;
        const token = generateToken(user);
        const userData = JSON.stringify({
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            department: user.department,
            twoFactorEnabled: user.twoFactorEnabled,
            otpVerify: user.otpVerify,
            twofactorqr: user.twofactorqr,
            firstname: user.firstname,
            lastname: user.lastname,
            verified2fa: user.verified2fa,
            isVerified: user.isVerified,
            profilephoto: user.profilephoto,
        });
        res.redirect(`${process.env.FRONTEND_URL}/auth/microsoft/callback?token=${token}&user=${encodeURIComponent(userData)}`);
    
      
    })


module.exports = router;