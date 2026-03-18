"use client";

import { signUp } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SignUpPage() {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const result = await signUp(formData);

        if (result.error) alert(result.error);
        else alert(result.success);
    };

    return (
        <div className="flex h-screen items-center justify-center bg-slate-100">
            <Card className="w-[400px] rounded-[2rem] shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Join VedaAI</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input name="name" placeholder="Your Name" required />
                        <Input name="email" type="email" placeholder="Email Address" required />
                        <Input name="password" type="password" placeholder="Password" required />
                        <div className="border-t pt-4 mt-4 text-xs text-slate-400 uppercase font-bold">School Details</div>
                        <Input name="schoolName" placeholder="School Name (e.g. Delhi Public School)" required />
                        <Input name="schoolTown" placeholder="Town (e.g. Bokaro Steel City)" required />
                        <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 rounded-full py-6">
                            Create Account
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}