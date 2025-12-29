export default function Signup({ onSwitch }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

        <input className="input" placeholder="Email" />
        <input className="input mt-4" placeholder="Password" type="password" />

        <button className="btn-primary mt-6 w-full">Sign Up</button>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <span onClick={onSwitch} className="text-blue-400 cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
