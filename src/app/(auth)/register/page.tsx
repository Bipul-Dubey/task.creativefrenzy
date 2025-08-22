"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!form.email || !form.password || !form.name) {
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
    } catch (err: any) {
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

        <div onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Bipul Dubey"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
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

export default LoginPage;
