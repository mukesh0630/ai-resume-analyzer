import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { saveUserProfile } from "../utils/saveUserProfile";


export default function Signup({ onSwitch, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup() {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await saveUserProfile(res.user, { name });
    onSuccess();
  } catch {
    setError("Signup failed");
  }
}

async function handleGoogle() {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    await saveUserProfile(res.user);
    onSuccess();
  } catch {
    setError("Google signup failed");
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl w-full max-w-md border border-white/10">

        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        <input
          className="w-full mb-4 px-4 py-3 rounded-xl bg-black/40 border border-white/10"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          className="w-full mb-4 px-4 py-3 rounded-xl bg-black/40 border border-white/10"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-black/40 border border-white/10"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={handleSignup}
          className="w-full bg-purple-500 py-3 rounded-xl font-semibold hover:bg-purple-600"
        >
          Sign Up
        </button>

        <button
          onClick={handleGoogle}
          className="w-full mt-4 bg-white text-black py-3 rounded-xl font-semibold"
        >
          Sign up with Google
        </button>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            onClick={onSwitch}
            className="text-purple-400 cursor-pointer"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
