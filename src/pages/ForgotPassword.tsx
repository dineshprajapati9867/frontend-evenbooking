import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../api/Api";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [isEmailVerified, setIsEmailVerified] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleCheckEmail = async () => {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email =
        "Please enter a valid email";
    }

    setErrors(newErrors);

    if (newErrors.email) return;

    try {
      setIsLoading(true);

      const response = await api({
        path: "auth/forget-password",
        method: "POST",
        body: {
          email,
        },
      });

      setIsEmailVerified(true);

      toast.success(
        response.message || "Email found",
      );
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!password.trim()) {
      newErrors.password =
        "Password is required";
    } else if (password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword =
        "Confirm password is required";
    } else if (
      password !== confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    if (
      newErrors.password ||
      newErrors.confirmPassword
    ) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await api({
        path: "auth/forget-password",
        method: "POST",
        body: {
          email,
          password,
        },
      });

      toast.success(
        response.message ||
          "Password updated successfully",
      );

      navigate("/login");
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
          Forgot Password
        </h1>

        <div className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              disabled={isEmailVerified}
              onChange={(e) => {
                setEmail(e.target.value);

                setErrors((prev) => ({
                  ...prev,
                  email: "",
                }));
              }}
              className={`w-full rounded-lg border p-3 outline-none disabled:bg-slate-100 ${
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

          {!isEmailVerified ? (
            <button
              onClick={handleCheckEmail}
              disabled={isLoading}
              className="w-full cursor-pointer rounded-lg bg-violet-600 py-3 text-white"
            >
              {isLoading
                ? "Checking..."
                : "Submit"}
            </button>
          ) : (
            <>
              <div>
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(
                      e.target.value,
                    );

                    setErrors((prev) => ({
                      ...prev,
                      password: "",
                    }));
                  }}
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

              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(
                      e.target.value,
                    );

                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword:
                        "",
                    }));
                  }}
                  className={`w-full rounded-lg border p-3 outline-none ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                />

                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {
                      errors.confirmPassword
                    }
                  </p>
                )}
              </div>

              <button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full cursor-pointer rounded-lg  bg-violet-600 py-3 text-white disabled:bg-violet-400"
              >
                {isLoading
                  ? "Updating..."
                  : "Reset Password"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;