import mongoose from "mongoose";

const MiddleCategorySchema = new mongoose.Schema(
  {
    //required: name, typeOf, price
    name: {
      type: String,
      required: [true, "Please provide middle category name"],
      maxlength: 50,
      trim: true,
      unique: true,
    },
    courseList: {
        type: Array,
        default: [],
    },
    categorycourse:{
        type: mongoose.Types.ObjectId,
        ref: "CourseCategory",
        required: [true, "middle category must not be empty"],
    }
  },
  { timestamps: true }
); // timestamps -> key createdAt, updatedAt

export default mongoose.model("MiddleCategory", MiddleCategorySchema);
