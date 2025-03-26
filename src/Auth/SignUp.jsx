import { Link } from "react-router-dom";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      toast.success("Registered successfuly:",{position:'top-center'});

    
      await setDoc(doc(db, "Users", user.uid), {
        uid: user.uid,
        email: user.email,
        userName: name,
      });
      window.location.href = "/getStarted";
      console.log("User data stored in Firestore successfully!");
    } catch (error) {
      toast.error(error.message , {position:'bottom-center'});
    }
  };

      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <section className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm">
            <h1 className="text-2xl font-bold text-gray-800  mb-2">Sign Up</h1>
            <p className="text-xl mb-3">create your account</p>
            <form className="space-y-4" onSubmit={handleSignUp}>

            <div>
                <label className="block text-gray-700 font-medium">Username</label>
                <input 
                  type="name" 
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Username"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
    
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
                <label className="block text-gray-700 font-medium">Create Password</label>
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
                Sign Up
              </button>
        
    
              <div className="flex gap-1 mt-3">
                <p>Already have an account?</p> <Link to={"/SignIn"} className="text-blue-400 hover:underline" >sign In</Link>
              </div>
            </form>
          </section>
        </div>
      );
    }


export default SignUp;
