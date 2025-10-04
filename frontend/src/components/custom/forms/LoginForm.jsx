import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { loginSchema } from "../../../validations/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Mail, Lock, Eye, EyeClosed } from "lucide-react";
import Logo from "../../../assets/imgs/SDO-LOGO.webp";
import { useAuth } from "@/context/AuthContext";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

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
        data.remember
      );
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message: error.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-sm flex flex-col items-center gap-4"
      >
        {/* Logo */}
        <div className="flex justify-center w-full">
          <img src={Logo} alt="logo" className="w-20 h-20 sm:w-24 sm:h-24" />
        </div>

        <h2 className="text-center text-xl sm:text-2xl font-semibold">
          Welcome!
        </h2>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full relative">
              <FormControl>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    {...field}
                    placeholder="Enter Email Address"
                    className="rounded-[1rem] py-4 pl-12"
                  />
                </div>
              </FormControl>
              <FormMessage className="ml-3 text-sm text-red-500" />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full relative">
              <FormControl>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    {...field}
                    placeholder="Enter Password"
                    className="rounded-[1rem] py-4 pl-12"
                    type={!showPassword ? "password" : "text"}
                  />
                  <div
                    className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer`}
                  >
                    {showPassword ? (
                      <Eye onClick={() => setShowPassword(!showPassword)} />
                    ) : (
                      <EyeClosed
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage className="ml-3 text-sm text-red-500" />
            </FormItem>
          )}
        />

        {/* Remember me */}
        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem className="w-full flex items-center px-1 ml-2.5 space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-1 border-primary"
                  id="remember"
                />
              </FormControl>
              <FormLabel htmlFor="remember" className="text-base">
                Remember me
              </FormLabel>
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <FormMessage>{form.formState.errors.root.message}</FormMessage>
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
    </Form>
  );
};

export default LoginForm;
