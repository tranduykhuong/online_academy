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
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    benifits: {
      type: String,
      trim: true,
    },
    who: {
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
    studentList: [
      {
        studentId: mongoose.Types.ObjectId,
        registerTime: 
        {
         type: Date,
         default: Date.now()
        }
      }
    ],
    listChapter: [
      {
        title: {
          type: String,
          required: [true, "Chapter title must not be empty"],
          trim: true,
        },
        chapter: Number,
        listVideo: [
          {
            chapter: Number,
            lession: Number,
            name: {
              type: String,
              trim: true,
            },
            urlVideo: {
              type: String,
            },
            duration: {
              type: Number
            },
            avtVideo: {
              type: String,
            },
          }
        ]
      }
    ],
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10,
    },
    price: {
      type: Number,
      required: [true, "Please provide price of Course"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc in NEW document creation
          return val < this.price; 
        },
        message: 'Discount price {{VALUE}} should be below regular price'
      }
    },
    descriptionDiscount: {
      type: String,
      default: "",
    },
    field: {
      type: mongoose.Types.ObjectId,
      ref: "Field",
      //required: [true, "Field must not be empty"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      // required: [true, "Provider must not be empty"],
    },
    accept: {
      type: Boolean,
      default: false,
    },
    fieldsVideo: [
      {
        name: String,
        maxCount: Number
      }
    ],
  },
  { 
    timestamps: true,
    toObject: { virtuals: true } 
  }
); // timestamps -> key createdAt, updatedAt

CourseSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'createdBy',
    select: 'name image description where'
  });

  this.populate({
    path: 'field',
    select: 'name',
  })

  next();
})

export default mongoose.model("Course", CourseSchema);