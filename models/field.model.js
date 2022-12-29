import mongoose from "mongoose";

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
        ref: "category",
        required: [true, "Field category must not be empty"],
    }
  },
  { timestamps: true }
); // timestamps -> key createdAt, updatedAt

export default mongoose.model("Field", FieldSchema);
