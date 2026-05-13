import { apiGet, apiPost } from "@/lib/api";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type User = {
  id: string;
  email: string;
  name?: string;
};

type MeResponse = {
  user: User;
};

type AuthContextVal = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextVal | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await apiGet<MeResponse>("/auth/me");

        if (res.ok) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  async function logout() {
    await apiPost("/auth/logout");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contextVal = useContext(AuthContext);

  if (!contextVal) throw new Error("useauth must be used inside provider");

  return contextVal;
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true, state: { from: location.pathname } });
    }
  }, [loading, navigate, user, location.pathname]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
        <p className="text-sm font-medium text-neutral-500">Checking session...</p>
      </div>
    </div>
  );
  
  if (!user) return null;

  return <>{children}</>;
}
