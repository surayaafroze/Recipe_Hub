"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useSession, authClient } from "../lib/auth-client";
import { Home, Search, User, LayoutDashboard, LogOut, Menu, X, LogIn, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
            }
            toast.success("Logged out successfully");
            router.push('/login');
            router.refresh();
          }
        }
      });
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight flex items-center gap-2">
                <span>🍳</span> RecipeHub
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-6 items-center">
              <Link href="/" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1.5 px-1 pt-1 text-sm font-medium transition-colors">
                <Home className="w-4 h-4" /> Home
              </Link>
              <Link href="/browse-recipes" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1.5 px-1 pt-1 text-sm font-medium transition-colors">
                <Search className="w-4 h-4" /> Browse Recipes
              </Link>
            </div>
          </div>
          
          {/* Desktop Right Side */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <ThemeToggle />
            {session ? (
              <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-zinc-700 pl-4">
                <Link href="/dashboard/profile" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition">
                  {session.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 ${session.user?.image ? 'hidden' : 'flex'} items-center justify-center font-bold text-sm border-2 border-indigo-100 dark:border-indigo-900`}>
                    {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span>Profile</span>
                </Link>
                
                <Link href="/dashboard" className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-4 py-2 rounded-lg text-sm font-semibold transition">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>

                <button onClick={handleLogout} className="inline-flex items-center gap-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-zinc-700 pl-4">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition">
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link href="/register" className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-md hover:shadow-lg">
                  <UserPlus className="w-4 h-4" /> Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition cursor-pointer"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" onClick={() => setIsOpen(false)} className="border-transparent text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-zinc-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-3 pl-3 pr-4 py-3 border-l-4 text-base font-medium transition">
              <Home className="w-5 h-5" /> Home
            </Link>
            <Link href="/browse-recipes" onClick={() => setIsOpen(false)} className="border-transparent text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-zinc-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-3 pl-3 pr-4 py-3 border-l-4 text-base font-medium transition">
              <Search className="w-5 h-5" /> Browse Recipes
            </Link>
            
            {session ? (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
                <div className="flex items-center px-4 mb-4">
                  <div className="flex-shrink-0">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="Profile" className="h-10 w-10 rounded-full object-cover border-2 border-indigo-100 dark:border-zinc-700" 
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`h-10 w-10 rounded-full bg-indigo-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 ${session.user?.image ? 'hidden' : 'flex'} items-center justify-center font-bold text-lg border-2 border-indigo-100 dark:border-zinc-700`}>
                      {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-white">{session.user?.name}</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{session.user?.email}</div>
                  </div>
                </div>
                
                <Link href="/dashboard/profile" onClick={() => setIsOpen(false)} className="border-transparent text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-zinc-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-3 pl-3 pr-4 py-3 border-l-4 text-base font-medium transition">
                  <User className="w-5 h-5" /> Profile
                </Link>
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="border-transparent text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-zinc-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-3 pl-3 pr-4 py-3 border-l-4 text-base font-medium transition">
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </Link>
                <button onClick={() => { setIsOpen(false); handleLogout(); }} className="w-full text-left border-transparent text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-500 flex items-center gap-3 pl-3 pr-4 py-3 border-l-4 text-base font-medium transition cursor-pointer">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
                <Link href="/login" onClick={() => setIsOpen(false)} className="border-transparent text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-zinc-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-3 pl-3 pr-4 py-3 border-l-4 text-base font-medium transition">
                  <LogIn className="w-5 h-5" /> Login
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="border-transparent text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-zinc-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-3 pl-3 pr-4 py-3 border-l-4 text-base font-medium transition">
                  <UserPlus className="w-5 h-5" /> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
