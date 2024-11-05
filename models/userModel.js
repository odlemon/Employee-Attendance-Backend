import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    department: { type: String },
    gender: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: false },
    isAdmin: { type: Boolean, default: false },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    isActive: { type: Boolean, default: true },
    
    // New field for tracking login and logout times per session
    activityLogs: [
      {
        loginTime: {
          type: Date,
          required: true,
        },
        logoutTime: {
          type: Date,
          default: null, // Initially null until logout
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to record login activity
userSchema.methods.logLogin = async function () {
  this.activityLogs.push({ loginTime: new Date() });
  await this.save();
};

// Method to record logout activity by updating the latest log
userSchema.methods.logLogout = async function () {
  const latestLog = this.activityLogs[this.activityLogs.length - 1];
  
  if (latestLog && !latestLog.logoutTime) {
    latestLog.logoutTime = new Date();
    await this.save();
  }
};

const User = mongoose.model("User", userSchema);

export default User;
