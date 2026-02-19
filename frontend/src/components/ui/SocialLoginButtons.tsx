"use client";

import { signIn } from "next-auth/react";
import Button from "./LoginButton";

const SocialLoginButtons = () => {
  const handleLogin = async (provider: string) => {
    await signIn(provider, {
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <Button onClick={() => handleLogin("google")}>
        Continue with Google
      </Button>

      <Button onClick={() => handleLogin("facebook")}>
        Continue with Facebook
      </Button>

      <Button onClick={() => handleLogin("github")}>
        Continue with GitHub
      </Button>
    </div>
  );
};

export default SocialLoginButtons;
