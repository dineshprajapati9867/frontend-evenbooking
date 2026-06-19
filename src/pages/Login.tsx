import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../api/Api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email =
        "Please enter a valid email";
    }

    if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(
      (error) => error
    );
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsLoading(true);

      const response = await api({
        path: "auth/login",
        method: "POST",
        body: formData,
      });

      localStorage.setItem(
        "token",
        response.token
      );

      localStorage.setItem(
        "isLogin",
        "true"
      );

      localStorage.setItem(
        "name",
        response.user.name
      );

      toast.success("Login successful");

      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Login
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-lg border p-3 outline-none ${
                errors.email
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full rounded-lg border p-3 outline-none ${
                errors.password
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded-lg bg-violet-600 py-3 text-white disabled:bg-violet-400"
          >
            {isLoading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

<div className="flex items-center justify-between">


        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-violet-600"
          >
            Signup
          </Link>
        </p>
        <p className="mt-4 text-center text-sm">
          Forget password{" "}

          <Link
            to="/forget-password"
            className="font-medium text-violet-600"
          >
            Forget password
          </Link>
        </p>

        </div>
      </div>
    </div>
  );
};

export default Login;