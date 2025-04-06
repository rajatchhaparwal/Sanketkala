import { Link } from "react-router-dom";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from './firebase'
import { toast } from "react-toastify";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in successfully!", { position: "top-center" });
      window.location.href = "/getStarted";
    } catch (error) {
      let errorMessage = "An error occurred during sign in.";
      
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage, { position: "bottom-center" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <section className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Sign In</h1>
        
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className={`w-full bg-amber-500 text-white py-2 rounded-lg hover:font-bold transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <div className="flex gap-1 mt-3">
            <p>Don't have an account?</p> 
            <Link to={"/SignUp"} className="text-blue-400 hover:underline">Sign up</Link>
          </div>
        </form>
      </section>
    </div>
  );
}

export default SignIn;

