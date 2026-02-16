import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { loginSchema } from "../../../validations/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Mail, Lock, Eye, EyeClosed } from "lucide-react";
import Logo from "../../../assets/imgs/SDO-LOGO.webp";
import { useAuth } from "@/context/AuthContext";

const LoginForm = () => {
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      await login(
        { email: data.email, password: data.password },
        data.remember,
      );
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message: error.message,
      });
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-sm flex flex-col items-center gap-4"
    >
      {/* Logo */}
      <div className="flex justify-center w-full">
        <img src={Logo} alt="logo" className="w-24 h-24 sm:w-34 sm:h-34" />
      </div>

      <h2 className="text-center text-2xl sm:text-4xl font-semibold">
        Welcome!
      </h2>

      {/* Email */}
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState: { error } }) => (
          <Field className="w-full relative">
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                {...field}
                placeholder="Enter Email Address"
                className="rounded-[0.75rem] py-4 pl-12"
              />
            </div>
            {error && (
              <FieldError className="ml-3 text-sm text-red-500">
                {error.message}
              </FieldError>
            )}
          </Field>
        )}
      />

      {/* Password */}
      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState: { error } }) => (
          <Field className="w-full relative">
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                {...field}
                placeholder="Enter Password"
                className="rounded-[0.75rem] py-4 pl-12"
                type={!showPassword ? "password" : "text"}
              />
              <div
                className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer`}
              >
                {showPassword ? (
                  <Eye onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <EyeClosed onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>
            </div>
            {error && (
              <FieldError className="ml-3 text-sm text-red-500">
                {error.message}
              </FieldError>
            )}
          </Field>
        )}
      />

      {/* Remember me */}
      <Controller
        control={form.control}
        name="remember"
        render={({ field }) => (
          <Field>
            <div className="w-full flex items-center px-1 ml-2.5 space-x-2">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className="border-1 border-primary flex-shrink-0"
                id="remember"
              />
              <FieldLabel htmlFor="remember" className="text-base">
                Remember me
              </FieldLabel>
            </div>
          </Field>
        )}
      />

      {/* global errors */}
      {form.formState.errors.root && (
        <FieldError>{form.formState.errors.root.message}</FieldError>
      )}

      {/* Submit */}
      <Button
        type="submit"
        className="p-4 w-full rounded-full"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
