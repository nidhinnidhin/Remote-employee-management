"use client";

import { useState } from "react";

export default function LoginForm({
  onSubmit,
  buttonText = "Login",
}: {
  onSubmit: (data: FormData) => Promise<any>;
  buttonText?: string;
}) {
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const result = await onSubmit(formData);
    if (!result.success) {
      setError(result.message);
      return;
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="w-full border p-2 rounded"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        {buttonText}
      </button>
    </form>
  );
}
