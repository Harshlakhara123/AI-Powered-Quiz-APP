"use server";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { setAuthCookie } from "@/lib/auth";

export async function signUp(formData: FormData) {
  try {
    await dbConnect();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const schoolName = formData.get("schoolName") as string;
    const schoolTown = formData.get("schoolTown") as string;

    const existingUser = await User.findOne({ email });
    if (existingUser) return { error: "User already exists" };

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      schoolName,
      schoolTown,
    });

    await setAuthCookie({
      userId: user._id.toString(),
      name: user.name,
      schoolName: user.schoolName,
      schoolTown: user.schoolTown,
    });

    return { success: "Account created successfully!" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return { error: message };
  }
}

export async function login(formData: FormData) {
  try {
    await dbConnect();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const user = await User.findOne({ email });
    if (!user) {
      return { error: "Invalid email or password" };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { error: "Invalid email or password" };
    }

    await setAuthCookie({
      userId: user._id.toString(),
      name: user.name,
      schoolName: user.schoolName,
      schoolTown: user.schoolTown,
    });

    return { success: "Logged in successfully" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return { error: message };
  }
}
