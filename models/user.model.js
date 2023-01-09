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
      required: [true, "Password must not empty"],
      select: false,
      // minlength: 6,
      trim: true,
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
    favoriteCourses: [{
        type: mongoose.Types.ObjectId
      }
    ],
    boughtCourses: [
      {
        idCourse:  mongoose.Types.ObjectId,
        idChapter: mongoose.Types.ObjectId,
        idLesson: mongoose.Types.ObjectId,
        currentTime: Number
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

UserSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.methods.hashPassword = async function(
  userPassword
  ) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(this.password, salt);
}

UserSchema.methods.correctPassword = async function(
  candidatePassword, 
  userPassword
  ) {
    console.log(candidatePassword);
    console.log(userPassword);
  return await bcrypt.compare(candidatePassword, userPassword)
}


//Tạo web token
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

export default mongoose.model("User", UserSchema);

