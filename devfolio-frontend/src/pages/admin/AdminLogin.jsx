import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../store/slices/authSlice";
import MobileMenu from "../../components/MobileMenu";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const authStatus = useSelector((s) => s.auth.status);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    try {
      const result = await dispatch(signIn({ username, password })).unwrap();
      navigate("/admin");
    } catch (err) {
      setError(err?.message || "Sign in failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-olive text-white p-6">
      <MobileMenu alwaysVisible items={[{ label: "BACK HOME", path: "/" }, { label: "VIEW PROJECTS", path: "/projects" }]} />
      
      <form onSubmit={handleSubmit} className="bg-olive-dark p-8 rounded-lg w-full max-w-sm shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-beige">Admin Login</h1>
        
        {/* Easter egg */}
        <p className="text-sm text-[#C9B7A5] mb-4 italic">
          You name better be Steven if you're on this page...
        </p>

        {error && <div className="text-red-400 mb-3">{error}</div>}

        <label className="block mb-2">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-2 rounded text-black"
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 rounded text-black"
        />

        <div className="flex items-center justify-between">
          <button className="bg-beige text-olive-dark py-2 px-4 rounded font-bold">Sign In</button>
        </div>
      </form>
    </div>
  );
}
