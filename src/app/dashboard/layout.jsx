"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useSession } from '../../lib/auth-client';
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  Heart, 
  ShoppingBag, 
  User, 
  ShieldCheck,
  Users,
  AlertOctagon,
  CreditCard
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get('tab') || 'overview';
  const { data: session, isPending } = useSession();

  const isAdmin = session?.user?.role === 'admin';

  // Redirect admin from /dashboard to /dashboard/admin
  React.useEffect(() => {
    if (isAdmin && pathname === '/dashboard') {
      router.push('/dashboard/admin?tab=overview');
    }
  }, [isAdmin, pathname, router]);

  let navItems = [];
  if (isAdmin) {
    navItems = [
      { name: 'Overview', href: '/dashboard/admin?tab=overview', id: 'overview', icon: LayoutDashboard },
      { name: 'Manage Users', href: '/dashboard/admin?tab=users', id: 'users', icon: Users },
      { name: 'Manage Recipes', href: '/dashboard/admin?tab=recipes', id: 'recipes', icon: BookOpen },
      { name: 'Reports', href: '/dashboard/admin?tab=reports', id: 'reports', icon: AlertOctagon },
      { name: 'Transactions', href: '/dashboard/admin?tab=payments', id: 'payments', icon: CreditCard },
    ];
  } else {
    navItems = [
      { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { name: 'My Recipes', href: '/dashboard/my-recipes', icon: BookOpen },
      { name: 'Add Recipe', href: '/dashboard/add-recipe', icon: PlusCircle },
      { name: 'My Favorites', href: '/dashboard/favorites', icon: Heart },
      { name: 'Purchased Recipes', href: '/dashboard/purchased-recipes', icon: ShoppingBag },
      { name: 'Profile', href: '/dashboard/profile', icon: User },
    ];
  }

  if (isPending) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 min-h-[80vh]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 p-4 sticky top-24">
          <div className="mb-6 px-4">
            <h2 className="text-[15px] font-extrabold flex items-center gap-2 uppercase tracking-wider text-gray-900 dark:text-white">
              {isAdmin ? (
                <><ShieldCheck className="w-5 h-5 text-red-600" /> Admin Panel</>
              ) : (
                'Dashboard Menu'
              )}
            </h2>
          </div>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = isAdmin 
                ? (pathname === '/dashboard/admin' && currentTab === item.id)
                : pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
