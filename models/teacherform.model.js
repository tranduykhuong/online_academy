import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const TeacherFormSchema = new mongoose.Schema(
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
    gender: {
      type: String,
      enum: ["nam", "nữ"],
      default: "nam"
    },
    active: {
      type: Boolean,
      default: true
    },
    description:{
      type: String,
      default: ""
    },
    experience:{
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

export default mongoose.model("TeacherForm", TeacherFormSchema);