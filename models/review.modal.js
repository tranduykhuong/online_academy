import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }, 
    course: {
        type: mongoose.Types.ObjectId,
        ref: 'Course'
    },
    comment:{
        type: String,
        maxlength: 50,
        minlength: 0,
        trim: true,
        default: ""
    } ,
    rating: {
        type: Number,
        min: [0, "Rating must be above 0"],
        max: [5, "Rating must be below 5"],
        default: 1
    }
  },
  { timestamps: true }
); // timestamps -> key createdAt, updatedAt

ReviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name image'
  });

  this.populate({
    path: 'course',
    select: 'name'
  });

  next();
})

export default mongoose.model("Review", ReviewSchema);