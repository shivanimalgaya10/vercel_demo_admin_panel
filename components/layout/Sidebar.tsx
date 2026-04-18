import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="px-5 py-5">
        <div className="text-lg font-extrabold tracking-tight text-slate-900">
          Blog Admin
        </div>
        <div className="mt-1 text-xs text-slate-500">TailAdmin-inspired</div>
      </div>
      <nav className="flex-1 px-3 py-4">
        <Link
          href="/dashboard/blogs"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
          Blogs
        </Link>
      </nav>
      <div className="px-5 py-4 text-xs text-slate-400">
        © {new Date().getFullYear()}
      </div>
    </aside>
  );
}

