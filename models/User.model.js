const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Please add a name"],
    },
    avatar: {
      type: String,
      default: "/images/hungdz.png",
    },
    email: {
      type: String,
      require: [true, "Please add a email"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        ,
        "Please add a valid email address",
      ],
      unique: true,
    },
    phone: {
      type: String,
      match: [/^(?:0|\+84)[1-9][0-9]{8,9}$/, "Please add a valid phone number"],
    },
    password: {
      type: String,
      require: [true, "Please add a password"],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "visitor", "admin"],
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.isMatchPassword = async function (passwordEnter) {
  console.log(passwordEnter, this.password);
  return await bcrypt.compare(passwordEnter, this.password);
};

UserSchema.methods.signToken = function () {
  console.log(this);
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.getResetpasswordToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire =
    Date.now() + process.env.RESET_TOKEN_EXPIRE * 60 * 1000;
  return resetToken;
};

UserSchema.methods.signRefreshToken = async function () {
  const refreshToken = jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    }
  );

  return refreshToken;
};

module.exports = mongoose.model("User", UserSchema);
