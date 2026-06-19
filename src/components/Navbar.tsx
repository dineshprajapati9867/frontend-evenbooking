import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const isLogin = localStorage.getItem("isLogin") === "true";

  const name = localStorage.getItem("name");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("name");

    toast.success("Logged out successfully");

    navigate("/login");

    window.location.reload();
  };
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#070715]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <h1
          className="cursor-pointer text-2xl font-bold text-white"
          onClick={() => navigate("/")}
        >
          TicketFlow
        </h1>

        <div className="flex items-center gap-3">
          {isLogin ? (
            <div className="flex items-center gap-4">
              <span className="text-white">Hello, {name}</span>

              <button
                onClick={handleLogout}
                className="cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-white hover:bg-slate-800"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
