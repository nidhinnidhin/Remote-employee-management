"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!password || password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/company/employees/set-password`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      }
    );

    if (!res.ok) {
      setError("Unable to set password");
      return;
    }

    router.replace("/employees/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-96">
        <h1 className="text-xl font-semibold mb-4">Set your password</h1>

        <input
          type="password"
          placeholder="New password"
          className="w-full mb-3 p-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="w-full mb-3 p-2 border"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white p-2"
        >
          Save Password
        </button>
      </div>
    </div>
  );
}
