import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must not empty"],
      minlength: 3,
      maxlength: 50,
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email must not empty"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email!",
      ],
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password must not empty"]
    },
    gender: {
      type: String,
      enum: ["nam", "nữ"],
      default: "nam"
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student"
    },
    boughtCourses: [
      {
      idCourse: mongoose.Types.ObjectId,
      idChapter: mongoose.Types.ObjectId,
      idLesson: mongoose.Types.ObjectId,
      currentTime: Number,
     }
    ],
    favoriteCourses: [
      {
      type: mongoose.Types.ObjectId,
    }
    ],
    image: {
      type: String,
      default: ""
    },
    active: {
      type: Boolean,
      default: true
    },
    description:{
      type: String,
      default: ""
    },
    where:{
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

//Mã hóa password
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Tạo web token
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

//So sánh mật khẩu để login
UserSchema.methods.comparePassword = async function (inputPassword) {
  const isMatch = await bcrypt.compare(inputPassword, this.password);
  return isMatch;
};

export default mongoose.model("User", UserSchema);