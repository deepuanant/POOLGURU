const User = require("../models/user.model");
const OTP = require("../models/otp.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  sendVerificationEmail,
  generateverificationToken,
  sendEmail,
  sendOTPEmail
} = require("../utils/email");
const {
  successFullVerification,
  passwordResetEmail,
} = require("../utils/EmailTemplate");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { profile } = require("console");
const { parse } = require("path");
const cloudinary = require('cloudinary').v2;
const { getOnlineUsers, getUser } = require("../config/Usersdata");
const { getIo } = require("../config/socketconnet");
const { use } = require("passport");
const path = require('path');
const fs = require('fs').promises;
// console.log(io) 

// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
// };

// const sendOTP = async (email, generatedOTP) => {
//   try {
//     await sendOTPEmail(email, generatedOTP);

//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.SENDER_EMAIL,
//       to: email,
//       subject: "OTP for Verification",
//       text: `Here is Your OTP for Verifying your Email: ${generatedOTP}`,
//     });

//     return true;
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// };




const register = async (req, res) => {
  const { username, password, email, role } = req.body;
  try {
    if (!username || !email || (!password)) {
      return res.status(400).json({ msg: "Not all fields have been entered" });
    }

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      return res
        .status(400)
        .json({ msg: "An account with this username, email, or Google ID already exists" });
    }

    const verificationToken = generateverificationToken(email);

    await sendVerificationEmail(email, verificationToken);

    const initials = `${username.charAt(0)}`.toUpperCase();
    const profilephoto = `https://ui-avatars.com/api/?name=${initials}&size=150&background=ffffff&color=f97316`;
    const coverphoto = path.join(__dirname, '..', 'assets', 'profile-bg.jpg');

    const newUser = await User.create({
      username,
      email,
      password,
      role,
      verificationToken,
      profilephoto,
      coverphoto
    });

    res.status(201).json({
      user: newUser,
      msg: "New user created. Please verify your email to activate your account.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

// const register = async (req, res) => {
//   const { username, password, email, role } = req.body;
//   try {
//     if (!username || !password || !email) {
//       return res.status(400).json({ msg: "Not all fields have been entered" });
//     }

//     const existedUser = await User.findOne({
//       $or: [{ username }, { email }],
//     });

//     if (existedUser) {
//       return res
//         .status(400)
//         .json({ msg: "An account with this username or email already exists" });
//     }

//     const otp = generateOTP();
//     const otpSent = await sendOTP(email, otp);

//     if (!otpSent) {
//         return res.status(500).json({ message: "Failed to send OTP Try again" });
//     }

//     // Store the OTP in the OTP collection
//     await OTP.findOneAndUpdate(
//         { email },
//         { otp, otpExpires: Date.now() + 300000 }, // 5 minutes expiration
//         { upsert: true, new: true }
//     );
//     res.status(200).json({ message: "OTP sent for email verification" });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//     console.log(error);
//   }
// };

const loginverify = async (req, res) => {
  try {
    const { token, otp } = req.body;
    if (!token || !otp) {
      return res.status(400).json({ message: "Token not found" });
    }

    const user = await User.findOne({ temptoken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }
    const email = user.email
    console.log(email);

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: "Session expired, try again" });
    }
    if (otpRecord.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (otpRecord.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role || null },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Delete the OTP record after successful verification
    await OTP.deleteOne({ email });
    await User.findOneAndUpdate({ temptoken: token }, { temptoken: null });


    res.status(200).json({
      message: "Login successful",
      token: jwtToken,
      user: {
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
        coverphoto: user.coverphoto
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const removeCoverPhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Path to your default cover photo
    const defaultCoverPhotoPath = "https://wallpapers.com/images/hd/profile-picture-background-i0irz526vjljpyfv.jpg";

    // Check if the default cover photo exists
    // try {
    //   await fs.access(defaultCoverPhotoPath);
    // } catch (error) {
    //   return res.status(500).json({ message: "Default cover photo not found" });
    // }

    if (user.coverphoto) {
      const d = await cloudinary.uploader.destroy(user.coverphoto);
      user.coverphoto = defaultCoverPhotoPath;

    }
    await user.save();


    res.status(200).json({ message: "Cover photo reset to default successfully", user });
  } catch (error) {
    console.error("Error removing cover photo:", error);
    res.status(500).json({ message: "Error removing cover photo", error: error.message });
  }
};

// Helper function to extract public_id from Cloudinary URL
function getPublicIdFromUrl(url) {
  if (!url) return null;
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename.split('.')[0];
}


const removeProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const initials = `${user.username.charAt(0).toUpperCase()}`;
    const deletePic = await cloudinary.uploader.destroy(user.profilephoto);
    if (deletePic) {

      user.profilephoto = `https://ui-avatars.com/api/?name=${initials}&size=150&background=ffffff&color=f97316`;
    } else {
      return res.status(404).json({ message: "Error in removing profile photo" });
    }

    await user.save();

    res.status(200).json({ message: "Profile photo removed successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error removing profile photo", error: error.message });
  }
};

const lockscreencheck = async (req, res) => {
  try {
    const { password } = req.body;
    console.log(password);
    const user
      = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid password" });
    }
    console.log(!user.comparePassword(password));
    res.status(200).json({ message: "Password verified successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error verifying password", error: error.message });
  }
};









const verify = async (req, res) => {
  try {
    const { email, enteredOTP, password, username, role } = req.body;

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: "session expired try again" });
    }
    if (otpRecord.otp != enteredOTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (otpRecord.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password,
      username,
      role,
      isVerified: true,
    });

    await newUser.save();

    // Delete OTP record after successful verification
    await OTP.deleteOne({ email });

    res
      .status(200)
      .json({ message: "User verified and registered successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { googleId, email, name } = req.body;
    let user = await User.findOne({ googleId });

    if (!user) {
      const initials = `${name.charAt(0)}`.toUpperCase();
      const profilephoto = `https://ui-avatars.com/api/?name=${initials}&size=150`;
      const coverphoto = path.join(__dirname, '..', 'assets', 'profile-bg.jpg');

      user = new User({
        googleId,
        email,
        username: name,
        isVerified: true,
        password: crypto.randomBytes(16).toString('hex'),
        profilephoto,
        coverphoto
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role, department: user.department || null },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Google authentication successful",
      token: jwtToken,
      user: {
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
        coverphoto: user.coverphoto
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







const login = async (req, res) => {
  try {
    const { email, password, googleId } = req.body;
    let user;

    if (googleId) {
      user = await User.findOne({ googleId });
    } else {
      user = await User.findOne({ email });
    }

    if (!user || (!googleId && !(await user.comparePassword(password)))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    if (user.verified2fa && !googleId) {

      const Temptoken = jwt.sign(
        { id: user._id, role: user.role || null },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      const token = Temptoken;
      user.temptoken = token;
      await user.save();

      return res
        .status(200)
        .json({ message: "2FA OTP required", token });

    }

    if (user.otpVerify && !googleId) {

      const Temptoken = jwt.sign(
        { id: user._id, role: user.role || null },
        process.env.JWT_SECRET,
        { expiresIn: "5m" }
      );
      const token = Temptoken;
      user.temptoken = token;
      await user.save();

      const generatedOTP = Math.floor(100000 + Math.random() * 900000);
      try {
        await sendOTPEmail(email, generatedOTP);
        await OTP.findOneAndUpdate(
          { email },
          { otp: generatedOTP, otpExpires: Date.now() + 300000 },
          { upsert: true, new: true }
        );
        return res.status(200).json({
          message: "OTP sent for email verification",
          token,
        });
      } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ message: "Failed to send OTP. Try again" });
      }
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role || null },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      message: "Login successful",
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        location:user.location,
        designation:user.designation,
        mobileno:user.mobileno,
        about:user.about,
        companyname:user.companyname,
        twoFactorEnabled: user.twoFactorEnabled,
        otpVerify: user.otpVerify,
        twofactorqr: user.twofactorqr,
        firstname: user.firstname,
        lastname: user.lastname,
        verified2fa: user.verified2fa,
        isVerified: user.isVerified,
        profilephoto: user.profilephoto,
        coverphoto: user.coverphoto
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const verifylogin2FA = async (req, res) => {
  try {
    const { token, otp } = req.body;
    if (!token || !otp) {
      return res.status(400).json({ message: "Token or OTP not found" });
    }

    const user = await User.findOne({ temptoken: token });

    if (!user) {
      return res.status(404).json({ error: "Invalid token" });
    }

    const otpString = otp.toString(); // Convert OTP to string if necessary
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: otpString,
    });

    if (verified) {
      user.temptoken = null; // Clear the temp token
      await user.save(); // Save changes to the user

      const jwtToken = jwt.sign(
        { id: user._id, role: user.role || null },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "Login successful",
        token: jwtToken,
        user: {
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
          coverphoto: user.coverphoto
        },
      });
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.error('Error in verifylogin2FA:', error);
    res.status(500).json({ message: error.message });
  }
};


const sendgmailotp = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ temptoken: token });
    console.log(user);
    console.log(user.email);
    if (!user) {
      return res.status(404).json({ error: "Invalid token" });
    }
    const generatedOTP = Math.floor(100000 + Math.random() * 900000);
    try {
      await sendOTPEmail(user.email, generatedOTP);
      await OTP.findOneAndUpdate({ email: user.email }, { otp: generatedOTP, otpExpires: Date.now() + 300000 }, { upsert: true, new: true });
      return res.status(200).json({ message: "OTP sent for email verification", token });
    } catch (error) {
      return res.status(500).json({ message: "Failed to send OTP. Try again" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};





const verifyEmail = async (req, res) => {
  try {
    const tokenId = req.params.token;
    const user = await User.findOne({ verificationToken: tokenId });
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: "Invalid verification token." });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    const congratulationContent = successFullVerification();

    res.send(congratulationContent);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred during email verification." });
    console.log(error);
  }
};

const enable2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const secret = speakeasy.generateSecret({ name: `Treyst Infotech Pvt Ltd` });


    const otpauthUrl = secret.otpauth_url;
    const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);
    user.twoFactorSecret = secret.base32;
    user.twofactorqr = qrCodeUrl;
    user.twoFactorEnabled = true;

    await user.save();


    res.status(200).json({ message: "Qr generated", qrCodeUrl, user: user });
  } catch (error) {
    res.status(500).json({ error: "Failed to enable 2FA" });
  }
};

const verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.id).select("-password");
    console.log(token);

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });

    if (verified) {
      user.verified2fa = true;
      await user.save();
      res.json({ message: '2FA enabled successfully', user: user });
    } else {
      res.status(400).json({ error: "Invalid token" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to verify 2FA" });
  }
};

const disable2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    user.twofactorqr = null;
    user.verified2fa = false;
    await user.save();
    console.log(user);
    res.json({ message: '2FA disabled successfully', user: user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

// const updateUser = async (req, res) => {
// if(req.user.role === "Admin"){

//   try {
//     const { updates } = req.body;
//     console.log(updates);
//     const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
//       new: true,
//       runValidators: true,
//     }).select("-password");
//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res
//       .status(200)
//       .json({ message: "User updated successfully", user: updatedUser });
//   } catch (error) {
//     res
//       .status(400)
//       .json({ message: "Error updating user", error: error.message });
//   }

// }
// else{
//   if(req.user.role === "User"){
//     try {
//       const {firstname,lastname} = req.body;
//       const photo = req.files?.profilePhoto;
//       console.log(req.body)
//       console.log(firstname,lastname);
//       console.log(photo);
//       const updatedUser = await User.findByIdAndUpdate(req.user._id, {firstname:firstname,lastname:lastname} , {
//         new: true,
//         runValidators: true,
//       }).select("-password");
//       if (photo) {
//         const photoUploadResult = await cloudinary.uploader.upload(photo.tempFilePath);
//         console.log(photoUploadResult);
//         updatedUser.profilephoto = photoUploadResult.secure_url;
//     }
//     await updatedUser.save();
//       if (!updatedUser) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       res
//         .status(200)
//         .json({ message: "User updated successfully", user: updatedUser });
//     } catch (error) {
//       res
//         .status(400)
//         .json({ message: "Error updating user", error: error.message });
//     }
//   }
// }
// };



const updateUser = async (req, res) => {
  try {
    const { firstname, lastname, about, mobileno, designation, location, companyname } = req.body;
    const photo = req.files?.profilePhoto;
    const coverphoto = req.files?.coverphoto;
    console.log(req.body)
    console.log(firstname, lastname);
    console.log(photo);
    console.log(coverphoto);
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { firstname: firstname, lastname: lastname, about: about, mobileno: mobileno, designation: designation, location: location, companyname: companyname }, {
      new: true,
      runValidators: true,
      select: "-password -assignpages -payoutMonitor -folder -payoutdata"
    })
    if (photo) {
      const photodelete = await cloudinary.uploader.destroy(updatedUser.profilephoto);
      const photoUploadResult = await cloudinary.uploader.upload(photo.tempFilePath);
      console.log(photoUploadResult);
      updatedUser.profilephoto = photoUploadResult.secure_url;
    } else if (coverphoto) {
      const coverphotodelete = await cloudinary.uploader.destroy(updatedUser.coverphoto);
      const coverphotoUploadResult = await cloudinary.uploader.upload(coverphoto.tempFilePath);
      console.log(coverphotoUploadResult);
      updatedUser.coverphoto = coverphotoUploadResult.secure_url;
    }

    await updatedUser.save();
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating user", error: error.message });
    console.log(error);
  }
}



// Helper function to extract public_id from Cloudinary URL
function getPublicIdFromUrl(url) {
  if (!url) return null;
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename.split('.')[0];
}



const loginotpstatus = async (req, res) => {
  try {
    const { otpVerify } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      otpVerify,
      { new: true, runValidators: true }
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "LoginOTP status updated successfully", user: updatedUser });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating Status", error: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

const changeUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error changing password", error: error.message });
  }
};

const verifyUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({
      id: user._id,
      email: user.email,
      name: user.username,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};


const changeUserRole = async (req, res) => {
  try {
    const io = await getIo();
    const { role } = req.body;
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();
    const receiveruser = getUser(user.username);
    if (receiveruser) {
      io.to(receiveruser.socketId).emit("rolechanged", {
        User: user
      });
    }

    res.status(200).json({ message: "User role changed successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Error changing role", error: error.message });
  }
};


// const assignpagestoUser = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const { services } = req.body;
//     console.log(userId);
//     // Validate input
//     if (!Array.isArray(services) || services.length === 0) {
//       return res.status(400).json({ error: 'Services must be an array and cannot be empty.' });
//     }

//     // Update the user's assignpages array
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $addToSet: { assignpages: { $each: services } } }, // Add services only if they don't exist
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ error: 'User not found.' });
//     }

//     res.status(200).json({ message: 'Services assigned successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error.' });
//   }
// }

const assignpagestoUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { services } = req.body;

    console.log(userId);

    // Validate input
    if (!Array.isArray(services)) {
      return res.status(400).json({ error: 'Services must be an array.' });
    }

    // Update the user's assignpages array by fully replacing it
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { assignpages: services } }, // Fully replace the assignpages array
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'Services updated successfully' });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: 'Internal server error.' });
  }
};


const removepagesfromUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { services } = req.body;

    // Validate input
    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: 'Services must be an array and cannot be empty.' });
    }

    // Update the user's assignpages array
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { assignpages: { $in: services } } }, // Remove services if they exist
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'Services removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
}


const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // Token expires in 30 minutes

    await user.save();

    // Send email
    const emailContent = passwordResetEmail(resetToken);

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        html: emailContent,
      });

      res.status(200).json({ message: "Password reset link sent to email" });
    } catch (err) {
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await user.save();

      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error in password reset request",
      error: error.message,
    });
  }
};



const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const token = req.body.token;
    const password = req.body.password;
    console.log(token);
    console.log(password);

    console.log("in reset password");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      // resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error resetting password", error: error.message });
  }
};




module.exports = {
  register,
  login,
  verifyEmail,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserPassword,
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
  removeCoverPhoto,

};