import mongoose from "mongoose";
import categoryModel from "./category.model.js";

const FieldSchema = new mongoose.Schema(
  {
    //required: name, typeOf, price
    name: {
      type: String,
      required: [true, "Please provide field category name"],
      maxlength: 50,
      trim: true,
      unique: true,
    },
    category:{
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: [true, "Field category must not be empty"],
    },
    description: {
      type: String,
      trim: true,
    }
  },
  { timestamps: true }
); // timestamps -> key createdAt, updatedAt

FieldSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'category',
    select: 'name description updatedAt createdAt'
  });
  next();
});

export default mongoose.model("Field", FieldSchema);
