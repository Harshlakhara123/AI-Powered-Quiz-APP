"use server";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function signUp(formData: FormData) {
    try {
        await dbConnect();

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const schoolName = formData.get("schoolName") as string;
        const schoolTown = formData.get("schoolTown") as string;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return { error: "User already exists" };

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create User
        await User.create({
            name,
            email,
            password: hashedPassword,
            schoolName,
            schoolTown,
        });

        return { success: "Account created successfully!" };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return { error: message };
    }
}