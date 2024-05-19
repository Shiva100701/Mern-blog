import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";


export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const hashPassword = bcryptjs.hashSync(password, 10);
    // console.log(hashPassword);
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res.json("signup successfull");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
       next(errorHandler(400, "User not Found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    const { password: pass, ...rest } = validUser._doc;
    if (!validPassword) {
      return next(errorHandler(400, "Invalid credentials"));
    }

    const token = jwt.sign(
      {
        id: validUser._id,
      },
      process.env.JWT_SECRET
    );
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-9);

      const hashPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username: name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashPassword,
        photoUrl: googlePhotoUrl,
      });
      const { password, ...rest } = newUser._doc;
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};