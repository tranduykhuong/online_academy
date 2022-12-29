import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    //required: name, typeOf, price
    name: {
      type: String,
      required: [true, "Please provide course category name"],
      maxlength: 50,
      trim: true,
      unique: true,
    }
  },
  { timestamps: true }
); // timestamps -> key createdAt, updatedAt

export default mongoose.model("Category", CategorySchema);
