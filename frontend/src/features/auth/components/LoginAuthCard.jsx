
import { Link } from "react-router-dom";
import {useForm} from "react-hook-form";
import { toast } from "react-toastify";
import LoadingPage from "../../shared/LoadingPage";
import useAuth from "../hooks/useAuth"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";





export default function AuthCard() {

  const [password, togglePassoword] = useState(false)

  const navigate = useNavigate()

  const { HandleLoginAPI} = useAuth();
  const {loading } = useSelector(state=>state.authentication)
  const {register , handleSubmit,formState: { errors },} = useForm();

 async function submitEventHandler(userData){
    try {
       
     const response =  await  HandleLoginAPI(userData)
     console.log(response);
     if(response.success){
        toast.success(response.message);
        navigate("/")
     }
     else{
        toast.error(response.message)
     }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
    
  }


   const onError = (errors) => {
    Object.values(errors).forEach((err) => {
      toast.error(err.message); 
    });
  };


  if(loading) return <LoadingPage/>


  return (
    <div className="bg-[#171f33]/60 backdrop-blur-xl border border-gray-700/20 rounded-3xl p-8 shadow-2xl">

      {/* Social */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button className="bg-[#222a3d] rounded-xl py-3 text-sm hover:bg-[#31394d]">
          Google
        </button>
        <button className="bg-[#222a3d] rounded-xl py-3 text-sm hover:bg-[#31394d]">
          GitHub
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center my-6 text-xs text-gray-400">
        <div className="flex-1 border-t border-gray-700"></div>
        <span className="px-3">OR CONTINUE WITH EMAIL</span>
        <div className="flex-1 border-t border-gray-700"></div>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit(submitEventHandler ,onError)}>

        <div>
          <label className="text-xs text-gray-400">EMAIL ADDRESS / USERNAME</label>
          <input
            {...register("identifier",{required:"name is required", setValueAs:(value) => value.trim()})}
            type="text"
            placeholder="curator@mindvault.io"
            className="w-full mt-2 p-3 rounded-xl bg-[#2d3449]/50 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-400">
            <label>PASSWORD</label>
            <span className="text-blue-300 cursor-pointer">Forgot?</span>
          </div>
          

          <div className="mt-2 p-3 flex items-center rounded-xl bg-[#2d3449]/50 outline-none focus:ring-2 focus:ring-blue-400">
          <input
            {...register("password", {required:"password is required", setValueAs:(value) => value.trim()})}
            type={password ? 'text' : "password"}
            placeholder="••••••••"
            className="w-full grow  h-full outline-none border-none "
            />


           <span> {password  ? <i className="ri-eye-line cursor-pointer" onClick={()=>togglePassoword(prev=>!prev)}></i> :<i className="ri-eye-off-line cursor-pointer" onClick={()=>togglePassoword(prev=>!prev)}></i>} </span>

          </div>
        </div>

        {/* Button */}
        <button type="submit" className="w-full mt-4 py-3 cursor-pointer rounded-xl bg-gradient-to-r from-blue-300 to-blue-500 text-black font-semibold hover:scale-[1.02] transition">
          Login with email →
        </button>
      </form>

      {/* Bottom */}
      <p className="text-center text-sm text-gray-400 mt-6">
        Don’t have an account?{" "}
        <Link className="text-blue-300 cursor-pointer" to="/register">Create a Vault</Link>
      </p>
    </div>
  );
}