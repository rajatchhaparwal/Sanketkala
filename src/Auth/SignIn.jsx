
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from './firebase'
import { toast } from "react-toastify";

function SignIn() {

  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try{
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Registered successfully!", { position: "top-center" });
      window.location.href = "/getStarted";
    }
    catch(error){
      toast.error(error.message , {position:'bottom-center'});
    }
  }
 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <section className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800  mb-4">Sign In</h1>
        
        <form onSubmit={handleOnSubmit} className="space-y-4">

          <div>
            <label className="block text-gray-700 font-medium">Enter your Email ID</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Enter Password</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-amber-500 text-white py-2 rounded-lg hover:font-bold transition">
            Sign In
          </button>


          <div className="flex gap-1 mt-3">
            <p>Did'nt have an account?</p> <Link to={"/SignUp"} className="text-blue-400 hover:underline" >sign up</Link>
          </div>
        </form>
      </section>
    </div>
  );
}

export default SignIn;

