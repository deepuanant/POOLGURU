const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    profilephoto: {
      type: String,

    },
    coverphoto: {
      type: String,
      default: "https://wallpapers.com/images/hd/profile-picture-background-i0irz526vjljpyfv.jpg"

    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Regular expression for password validation
          // Must include at least one lowercase letter, one uppercase letter, and one number
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        },
        message: (props) =>
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and be at least 8 characters long",
      },
    },
    role: {
      type: String,
      enum: ["Admin", "Employee", "User"],
      default: "User",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number
    },
    twofactorqr: {
      type: String
    },
    verified2fa: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    twoFactorSecret: String,
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twofactorqr: {
      type: String
    },
    otpVerify: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    temptoken: {
      type: String
    },
    assignpages: {
      type: [String],
      enum: ['Pool Scrubbing', 'Payout Monitoring', 'Loss Estimation', 'Pool Reconcilation', 'Direct Assignment', 'Co Lending', 'Securitization'],
      default: []
    },
    mobileno: {
      type: String
    },
    address: {
      type: String
    },
    location: {
      type: String
    },
    companyname: {
      type: String
    },
    designation: {
      type: String
    },
    about: {
      type: String
    },

    payoutMonitor: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PayOutBatches'

    }],
    payoutdata: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PayoutData'
    }],
    folder: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder'
    }],



  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
