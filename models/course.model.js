import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    //Video đường dẫn, đề cương, privew?
    name: {
      type: String,
      required: [true, "Course name must not be empty"],
      maxlength: 50,
      trim: true,
      unique: true,
    },
    briefDescription: {
      type: String,
      trim: true,
    },
    detailDescription: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['in progress', 'completed'],
      default: 'in progress',
      trim: true,
    },
    image: {
      type: String,
      default: "./default.png",
    },
    videodemo: {
      type: String,
      default: "./default.mp4",
    },
    studentList: [mongoose.Types.ObjectId],
    listChapter: [
      {
        title: {
          type: String,
          required: [true, "Chapter title must not be empty"],
          trim: true,
        },
        listVideo: [
          {
            name: {
              type: String,
              trim: true,
              unique: true,
            },
            urlVideo: {
              type: String,
              default: "./default.mp4",
            },
            avtVideo: {
              type: String,
              default: "./default.png",
            }
          }
        ]
      }
    ],
    ratingList: {
      type: Array,
      default: [],
    },
    ratingTotal: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Please provide price of Course"],
    },
    middlecategory: {
      type: mongoose.Types.ObjectId,
      ref: "MiddleCategory",
      required: [true, "Category must not be empty"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Provider must not be empty"],
    },
  },
  { timestamps: true }
); // timestamps -> key createdAt, updatedAt

export default mongoose.model("Course", CourseSchema);

