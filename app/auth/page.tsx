"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { login, signUp } from "@/lib/actions/auth";

type Mode = "login" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const action = isLogin ? login : signUp;
    const result = await action(formData);

    setLoading(false);

    if (result.error) {
      alert(result.error);
    } else {
      alert(result.success);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <Card className="w-[400px] rounded-[2rem] shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? "Welcome back" : "Join VedaAI"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-2 mb-4 text-xs">
            <Button
              type="button"
              variant={isLogin ? "default" : "outline"}
              size="sm"
              className="rounded-full px-4"
              onClick={() => setMode("login")}
            >
              Login
            </Button>
            <Button
              type="button"
              variant={!isLogin ? "default" : "outline"}
              size="sm"
              className="rounded-full px-4"
              onClick={() => setMode("signup")}
            >
              Sign up
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input name="name" placeholder="Your Name" required />
            )}
            <Input name="email" type="email" placeholder="Email Address" required />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
            />
            {!isLogin && (
              <>
                <div className="border-t pt-4 mt-4 text-xs text-slate-400 uppercase font-bold">
                  School Details
                </div>
                <Input
                  name="schoolName"
                  placeholder="School Name (e.g. Delhi Public School)"
                  required
                />
                <Input
                  name="schoolTown"
                  placeholder="Town (e.g. Bokaro Steel City)"
                  required
                />
              </>
            )}
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 rounded-full py-6"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

