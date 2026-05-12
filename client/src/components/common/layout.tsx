import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "@/context/auth";

export default function CommonLayout() {
  const navigate = useNavigate();
  const { loading, logout, user } = useAuth();

  async function onlogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Clean minimal header */}
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
          <Link to="/">
            <span className="font-serif-display text-lg tracking-tight text-neutral-900">
              Support Planner
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {!loading && user ? (
              <Button
                onClick={onlogout}
                variant="ghost"
                className="cursor-pointer text-xs font-medium uppercase tracking-widest text-neutral-700 hover:text-neutral-900"
              >
                Logout
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
