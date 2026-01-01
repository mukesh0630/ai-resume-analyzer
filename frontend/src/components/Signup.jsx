import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { Eye, EyeOff } from "lucide-react";

export default function Signup({ onSwitch, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup() {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch {
      setError("Signup failed");
    }
  }

  async function handleGoogleSignup() {
    try {
      await signInWithPopup(auth, googleProvider);
      onSuccess();
    } catch {
      setError("Google signup failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-gray-900 to-black text-white">

      <div className="bg-white/10 backdrop-blur-xl
                      border border-white/10 rounded-3xl p-10 w-full max-w-md">

        <h2 className="text-3xl font-bold mb-6 text-center">
          Create Account
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl
                     bg-black/40 border border-white/10 outline-none"
        />

        {/* PASSWORD WITH EYE */}
        <div className="relative mb-6">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl
                       bg-black/40 border border-white/10 outline-none"
          />

          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-3 text-gray-400 hover:text-white"
          >
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          onClick={handleSignup}
          className="w-full bg-purple-500 hover:bg-purple-600
                     py-3 rounded-xl font-semibold"
        >
          Sign Up
        </button>

        <button
          onClick={handleGoogleSignup}
          className="w-full mt-4 bg-white text-black
                     py-3 rounded-xl font-semibold"
        >
          Sign up with Google
        </button>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <span
            onClick={onSwitch}
            className="text-purple-400 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
