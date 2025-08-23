"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IUserRegisterPayload } from "@/types";
import { handleRegister } from "@/apis/user";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

const RegisterPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState<IUserRegisterPayload>({
    fullName: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    if (!form.email || !form.password || !form.fullName) {
      enqueueSnackbar("Please fill all information", {
        variant: "warning",
      });
      return;
    }

    setSubmitting(true);
    try {
      const resp = await handleRegister(form);
      if (!resp.isError) {
        enqueueSnackbar("Register Success, Login to continue", {
          variant: "success",
        });
        router.push("/");
      }
    } catch (err: any) {
      enqueueSnackbar(err.message ?? "Something went wrong, try again!", {
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm rounded-lg border bg-background p-6 shadow">
        <h1 className="mb-6 text-xl font-semibold">
          Enter your details to continue
        </h1>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Bipul Dubey"
              value={form.fullName}
              onChange={(e) => {
                setForm({ ...form, fullName: e.target.value });
              }}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
              }}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
              }}
              required
              autoComplete="current-password"
            />
          </div>

          <Button className="w-full" disabled={submitting} onClick={onSubmit}>
            {submitting ? "Signing up..." : "Sign up"}
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <span>Already have an account?</span>{" "}
          <Link href="/" className="underline hover:text-primary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
