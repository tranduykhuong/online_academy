import mongoose from "mongoose";

const CourseCategorySchema = new mongoose.Schema(
  {
    //required: name, typeOf, price
    name: {
      type: String,
      required: [true, "Please provide course category name"],
      maxlength: 50,
      trim: true,
      unique: true,
    },
    middlecourseList: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'MiddleCategory',
      }
    ],
  },
  { timestamps: true }
); // timestamps -> key createdAt, updatedAt

export default mongoose.model("CourseCategory", CourseCategorySchema);
