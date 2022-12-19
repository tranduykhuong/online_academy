import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }, 
    course: {
        type: mongoose.Types.ObjectId,
        ref: 'courses'
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
        default: 0,
        min: [0, "Rating must be above 0.0"],
        max: [5, "Rating must be below 5.0"],
        set: (val) => Math.round(val * 10) / 10,
    }
  },
  { timestamps: true }
); // timestamps -> key createdAt, updatedAt

export default mongoose.model("Review", ReviewSchema);

