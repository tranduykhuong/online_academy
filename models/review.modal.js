import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }, 
    course: {
        type: mongoose.Types.ObjectId,
        ref: 'course'
    },
    comment:{
        type: String,
        required: [true, "Comment must not be empty"],
        maxlength: 50,
        minlength: 3,
        trim: true,
    } ,
    rating: {
        type: Number,
        min: [0, "Rating must be above 0"],
        max: [5, "Rating must be below 5"]
    }
  },
  { timestamps: true }
); // timestamps -> key createdAt, updatedAt

export default mongoose.model("Review", ReviewSchema);

