import { useState } from 'react';
import { useAuth } from './use-auth'; // Or however you get your token

export default function UseFetch(fn) {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth(); // ✅ Change to your real auth hook

  const call = async (...args) => {
    setLoading(true);
    try {
      await fn(token, ...args);
    } catch (err) {
      console.error("UseFetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, fn: call };
}
