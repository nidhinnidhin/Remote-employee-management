"use client";

import { LOCAL_STORAGE_KEYS } from "@/shared/constants/temp/local-storage-keys";
import { useEffect, useState } from "react";

const STORAGE_KEY = LOCAL_STORAGE_KEYS.OTP_TIMER_EXPIRY_KEY;

export function useOtpTimer() {
  const [remaining, setRemaining] = useState(0);
  const [expired, setExpired] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const expiry = localStorage.getItem(STORAGE_KEY);

      if (!expiry) {
        setExpired(true);
        setRemaining(0);
        return;
      }

      const diff = Math.floor((Number(expiry) - Date.now()) / 1000);

      if (diff <= 0) {
        setExpired(true);
        setRemaining(0);
      } else {
        setExpired(false);
        setRemaining(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startTimer = (seconds: number) => {
    const expiry = Date.now() + seconds * 1000;
    localStorage.setItem(STORAGE_KEY, expiry.toString());
    setExpired(false);
    setRemaining(seconds);
  };

  const clearTimer = () => {
    localStorage.removeItem(STORAGE_KEY);
    setExpired(true);
    setRemaining(0);
  };

  return { remaining, expired, startTimer, clearTimer };
}
