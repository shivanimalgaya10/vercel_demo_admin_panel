"use client";

import * as React from "react";
import toast from "react-hot-toast";

import type { Blog } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BlogFormModal } from "@/components/blogs/BlogFormModal";
import { deleteBlog, getBlogs } from "@/services/blogs";

export default function BlogsPage() {
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Blog | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      setBlogs(await getBlogs());
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Blogs</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, update, and delete blog posts.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          Create Blog
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Image</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td className="px-4 py-5 text-slate-500" colSpan={4}>
                    Loading...
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td className="px-4 py-5 text-slate-500" colSpan={4}>
                    No blogs yet.
                  </td>
                </tr>
              ) : (
                blogs.map((b) => (
                  <tr key={b._id} className="bg-white">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">
                        {b.title}
                      </div>
                      <div className="mt-1 line-clamp-1 text-xs text-slate-500">
                        {b.description}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        className="text-indigo-700 hover:underline"
                        href={b.image}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setEditing(b);
                            setOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={async () => {
                            const ok = window.confirm(
                              "Delete this blog? This cannot be undone."
                            );
                            if (!ok) return;
                            try {
                              await deleteBlog(b._id);
                              toast.success("Deleted");
                              await refresh();
                            } catch (err: any) {
                              toast.error(
                                err?.response?.data?.message || "Delete failed"
                              );
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <BlogFormModal
        open={open}
        initial={editing}
        onClose={async (didChange) => {
          setOpen(false);
          setEditing(null);
          if (didChange) await refresh();
        }}
      />
    </div>
  );
}

