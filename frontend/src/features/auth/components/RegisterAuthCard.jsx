import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import LoadingPage from "../../shared/LoadingPage";
import useAuth from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AuthCard() {
  const [password, togglePassoword] = useState(false);

  const navigate = useNavigate();

  const { HandleRegisterAPI } = useAuth();

  const { loading } = useSelector((state) => state.authentication);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function submitFormHanlder(userData) {
 
     try {
       const response = await HandleRegisterAPI(userData);
       console.log(response);
       if (response.success) {
         toast.success(response.message);
         navigate("/");
       } else {
       toast.error(response.message);
      }
     } catch (error) {
       console.log(error);
       toast.error(error.message);
     }
  }

  const onError = (errors) => {
    Object.values(errors).forEach((err) => {
      toast.error(err.message);
    });
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="bg-[#171f33]/60 backdrop-blur-xl border border-gray-700/20 rounded-3xl p-8 shadow-2xl">
      {/* Form */}
      <form
        className="space-y-5"
        onSubmit={handleSubmit(submitFormHanlder, onError)}
      >
        {/* Username */}
        <div>
          <label className="text-xs text-gray-400">USERNAME</label>
          <input
            {...register("username", {
              required: "username is required",
              pattern: {
                value: /^[A-Za-z][A-Za-z0-9_]{3,19}$/,
                message:
                  "Username must start with a letter and contain only letters, numbers, underscores (4–20 chars)",
              },
              setValueAs: (value) => value.trim(),
            })}
            type="text"
            placeholder="curator_name"
            className="w-full mt-2 p-3 rounded-xl bg-[#2d3449]/50 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-xs text-gray-400">EMAIL ADDRESS</label>
          <input
            {...register("email", {
              required: "email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },

              setValueAs: (value) => value.trim(),
            })}
            type="email"
            placeholder="nexus@atelier.io"
            className="w-full mt-2 p-3 rounded-xl bg-[#2d3449]/50 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password */}

        <div>
          <label className="text-xs text-gray-400">PASSWORD</label>
          <div className="mt-2 p-3 flex items-center rounded-xl bg-[#2d3449]/50 outline-none focus:ring-2 focus:ring-blue-400">
            <input
              {...register("password", {
                required: "password is required",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must be 8+ chars with uppercase, lowercase, number & special character",
                },
                setValueAs: (value) => value.trim(),
              })}
              type={password ? "text" : "password"}
              placeholder="••••••••"
              className="w-full grow  h-full outline-none border-none "
            />

            <span>
              {" "}
              {password ? (
                <i
                  className="ri-eye-line cursor-pointer"
                  onClick={() => togglePassoword((prev) => !prev)}
                ></i>
              ) : (
                <i
                  className="ri-eye-off-line cursor-pointer"
                  onClick={() => togglePassoword((prev) => !prev)}
                ></i>
              )}{" "}
            </span>
          </div>
        </div>

        {/* Button */}
        <button type="submit" className="w-full cursor-pointer py-3 rounded-xl bg-gradient-to-r from-blue-300 to-blue-500 text-black font-semibold hover:scale-[1.02] transition">
          Create Account →
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6 text-xs text-gray-400">
        <div className="flex-1 border-t border-gray-700"></div>
        <span className="px-3">OR CONTINUE WITH</span>
        <div className="flex-1 border-t border-gray-700"></div>
      </div>

      {/* Social */}
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-[#222a3d] rounded-xl py-3 text-sm hover:bg-[#31394d]">
          Google
        </button>
        <button className="bg-[#222a3d] rounded-xl py-3 text-sm hover:bg-[#31394d]">
          Apple
        </button>
      </div>

      {/* Login */}
      <p className="text-center text-sm text-gray-400 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-300 cursor-pointer">
          Login
        </Link>
      </p>
    </div>
  );
}
