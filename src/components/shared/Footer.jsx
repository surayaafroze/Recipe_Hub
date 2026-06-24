"use client";
import Link from "next/link";
import { useSession } from "../../lib/auth-client";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const { data: session } = useSession();

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Description */}
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight flex items-center gap-2 mb-4">
              <span>🍳</span> RecipeHub
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Discover, share, and enjoy the best recipes from around the world. Your ultimate culinary companion.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/browse-recipes" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors">
                  Browse Recipes
                </Link>
              </li>
              {!session ? (
                <>
                  <li>
                    <Link href="/login" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors">
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/dashboard" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors">
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>123 Culinary Ave, Food City</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>contact@recipehub.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
          
          {/* Social Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-400 rounded-full transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="p-2 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-400 rounded-full transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="p-2 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-400 rounded-full transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-zinc-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
            &copy; {new Date().getFullYear()} RecipeHub. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
