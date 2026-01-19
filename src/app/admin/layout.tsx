// src/app/(admin)/layout.tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">Admin Sidebar</aside>

      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
