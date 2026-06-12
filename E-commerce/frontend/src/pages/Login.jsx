import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { API_URL } from "../config";
const Login = () => {
  const location = useLocation();
  const [state, setState] = useState("Login"); // Changed to 'Login' as default
  useEffect(() => {
    if (location.state?.formType === 'login') {
      setState('Login')
    }
  }, [location]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [timer, setTimer] = useState(180); // 3 minutes = 180 seconds

  useEffect(() => {
    let interval;
    if (showOTP && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOTP, timer]);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const responseData = await res.json();
      if (responseData.success) {
        localStorage.setItem("auth-token", responseData.token);
        window.location.replace("/");
      } else {
        alert(responseData.errors);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signup = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await res.json();
      if (responseData.success) {
        // Instead of logging in, show OTP verify screen
        setShowOTP(true);
        setTimer(180);
        alert(responseData.message);
      } else {
        alert(responseData.errors);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/otp-verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otp,
        }),
      });
      const responseData = await res.json();
      if (responseData.success) {
        localStorage.setItem("auth-token", responseData.token);
        window.location.replace("/");
      } else {
        alert(responseData.errors);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });
      const responseData = await res.json();
      if (responseData.success) {
        setTimer(180);
        alert(responseData.message);
      } else {
        alert(responseData.errors);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full">
        {/* Toggle Switch */}
        <div className="flex mb-1 bg-white mt-15 rounded-t-lg overflow-hidden shadow-sm"></div>

        {/* Form Container */}
        <div className="bg-white p-8 sm:p-10 rounded-b-lg rounded-tr-lg shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {showOTP ? "Verify Account" : state === "Login" ? "Welcome Back" : "Join Us Today"}
            </h1>
            <p className="text-gray-600">
              {showOTP
                ? `Enter the OTP sent to your email. Time remaining: ${formatTime(timer)}`
                : state === "Login"
                ? "Login to your account to continue"
                : "Create a new account to get started"}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {!showOTP ? (
              // Login/Signup Fields
              <div className="space-y-4">
                {state === "Sign Up" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      required
                      name="username"
                      value={formData.username}
                      onChange={changeHandler}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 
                      focus:border-red-500 focus:ring-2 focus:ring-red-500/20 
                      text-gray-900 text-base outline-none transition-all
                      placeholder:text-gray-400 disabled:bg-gray-100"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={changeHandler}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 
                    focus:border-red-500 focus:ring-2 focus:ring-red-500/20 
                    text-gray-900 text-base outline-none transition-all
                    placeholder:text-gray-400 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={changeHandler}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 
                    focus:border-red-500 focus:ring-2 focus:ring-red-500/20 
                    text-gray-900 text-base outline-none transition-all
                    placeholder:text-gray-400 disabled:bg-gray-100"
                  />
                </div>
              </div>
            ) : (
              // OTP Input Field
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    One Time Password (OTP)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading || timer === 0}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 
                    focus:border-red-500 focus:ring-2 focus:ring-red-500/20 
                    text-gray-900 outline-none transition-all
                    placeholder:text-gray-400 disabled:bg-gray-100 text-center tracking-widest text-xl"
                  />
                  {timer === 0 && (
                    <button
                      type="button"
                      onClick={resendOtp}
                      disabled={loading}
                      className="mt-2 text-sm text-red-500 hover:text-red-700 font-medium underline float-right disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Terms & Conditions - Only for Sign Up and NOT in OTP mode */}
            {state === "Sign Up" && !showOTP && (
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  disabled={loading}
                  className="mt-1 h-4 w-4 rounded border-gray-300 
                  text-red-500 focus:ring-red-500/20 disabled:bg-gray-100"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-red-500 hover:text-red-600 font-medium"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-red-500 hover:text-red-600 font-medium"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            )}

            {/* Submit / Verify Button */}
            <button
              onClick={() => {
                if (showOTP) {
                  verifyOtp();
                } else {
                  state === "Login" ? login() : signup();
                }
              }}
              type="button"
              disabled={loading || (showOTP && timer === 0)}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-base 
              transition-all duration-300 focus:outline-none focus:ring-2 
              focus:ring-offset-2 cursor-pointer ${
                loading || (showOTP && timer === 0)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 focus:ring-red-500 hover:shadow-lg hover:shadow-red-500/30"
              } text-white`}
            >
              {loading
                ? "Processing..."
                : showOTP
                ? "Verify Account"
                : state === "Login"
                ? "Login to Account"
                : "Create Account"}
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">Or continue with</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Sign In Button */}
            <button 
              type="button"
              onClick={() => {
  window.location.href = `${API_URL}/auth/google`;
}}

              className="cursor-pointer w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {state === "Login" ? "Sign in with Google" : "Sign up with Google"}
            </button>

            {/* Forgot Password - Only for Login */}
            {state === "Login" && !showOTP && (
              <div className="text-center">
                <a
                  href="#"
                  className="text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  Forgot your password?
                </a>
              </div>
            )}
          </form>

          {/* Toggle Prompt - Hide in OTP mode */}
          {!showOTP && (
            <div className="text-center pt-6 mt-6 border-t">
              <p className="text-gray-600">
                {state === "Login"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={() =>
                    setState(state === "Login" ? "Sign Up" : "Login")
                  }
                  disabled={loading}
                  className="cursor-pointer text-red-500 hover:text-red-600 font-medium underline disabled:text-gray-400"
                >
                  {state === "Login" ? "Sign Up" : "Login here"}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
