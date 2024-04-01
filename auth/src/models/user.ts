import mongoose from "mongoose";
import Password from "../services/password";

// An interface that describes the properties that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties that the user model has
interface UserModel extends mongoose.Model<UserDoc> {
  // All the props that a Model has + add more on top
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a user document has
interface UserDoc extends mongoose.Document {
  // All the props that a Document has + add more on top
  email: string;
  password: string;
  //   createdAt: string;
  //   updatedAt: string
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Pre-Save Hook
userSchema.pre("save", async function (done) {
  // function keyword gives access to the document being saved as 'this', arrow fn would override 'this' to be equal to the context of the file
  if (this.isModified("password")) {
    // User.build({email: "test@test.com", password: "dkfjdkf"}) will mark password as modified
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done(); // Done all the async work to do
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

// To ensure the type checking for new user objects, calling new User() directly doesnt do the job
// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// };

export default User;

/*
---- Generics Syntac : <> ----
    - Acts as functions for types
    - const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
    - Think as <UserDoc, UserModel> are arguments for the function model
    - Instead of being values, here they are types
*/
