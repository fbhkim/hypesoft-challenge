'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <html lang="pt-BR">
        <body className="flex items-center justify-center min-h-screen">
          <p>Carregando...</p>
        </body>
      </html>
    );
  }

  if (!isAuthenticated) {
    return (
      <html lang="pt-BR">
        <body>
          <div>Redirecionando para login...</div>
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen">
        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-center h-16 border-b">
              <h1 className="text-xl font-bold text-gray-800">ShopSense</h1>
            </div>
            <nav className="mt-5 px-4">
              <Link href="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100">
                Dashboard
              </Link>
              <Link href="/products" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100">
                Produtos
              </Link>
              <Link href="/categories" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100">
                Categorias
              </Link>
              <button
                onClick={logout}
                className="w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100 text-red-600"
              >
                Sair
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Mobile header */}
            <header className="lg:hidden bg-white shadow-sm">
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-xl font-bold">ShopSense</h1>
                <div className="w-6"></div> {/* For alignment */}
              </div>
            </header>

            {/* Page content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}