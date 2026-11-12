import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      default: "",
    },
    profilepic: {
      type: String,
      default: "",
    },
    nativelanguage: {
      type: String,
      default: "",
    },
    learninglanguage: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true },
);

// userSchema.pre("save", async function (next) {
//     if(!this.isModified('password')) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    // WHY THIS. PASSWORD IS WRITE HERE why not like password = await bcrypt.hash(this.password, salt); because we want to hash the password before saving it to the database. The "this" keyword refers to the current instance of the user model that is being saved. By using "this.password", we are accessing the password field of that specific user instance and hashing it before it gets stored in the database. If we were to use a variable like "password" instead, it would not refer to the specific user's password and would not achieve the desired effect of hashing the password before saving.
    
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
   
  const ispasswrodcorrect = await bcrypt.compare(enteredPassword, this.password);
  return ispasswrodcorrect;
};

const User = mongoose.model("User", userSchema);

export default User;
