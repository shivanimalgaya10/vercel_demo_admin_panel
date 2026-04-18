import { api } from "./api";
import type { Blog } from "@/types";

export async function getBlogs() {
  const { data } = await api.get<Blog[]>("/api/blogs");
  return data;
}

export async function createBlog(payload: {
  title: string;
  description: string;
  image: File;
}) {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("description", payload.description);
  form.append("image", payload.image);

  const { data } = await api.post<Blog>("/api/blogs", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

export async function updateBlog(
  id: string,
  payload: Partial<{ title: string; description: string; image: File }>
) {
  const form = new FormData();
  if (payload.title != null) form.append("title", payload.title);
  if (payload.description != null) form.append("description", payload.description);
  if (payload.image != null) form.append("image", payload.image);

  const { data } = await api.put<Blog>(`/api/blogs/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

export async function deleteBlog(id: string) {
  const { data } = await api.delete<{ message: string }>(`/api/blogs/${id}`);
  return data;
}

