"use client";

import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import type { Blog } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createBlog, updateBlog } from "@/services/blogs";
import { assetUrl } from "@/utils/urls";

const schema = Yup.object({
  title: Yup.string().min(3, "Min 3 characters").required("Title is required"),
  description: Yup.string()
    .min(10, "Min 10 characters")
    .required("Description is required")
});

export function BlogFormModal({
  open,
  onClose,
  initial
}: {
  open: boolean;
  onClose: (didChange: boolean) => void;
  initial?: Blog | null;
}) {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Reset when switching between create/edit or reopening
    if (open) {
      setFile(null);
      setPreviewUrl(null);
    }
  }, [open, initial?._id]);

  React.useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: initial?.title || "",
      description: initial?.description || ""
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        if (initial?._id) {
          await updateBlog(initial._id, {
            title: values.title,
            description: values.description,
            ...(file ? { image: file } : {})
          });
          toast.success("Blog updated");
        } else {
          if (!file) {
            toast.error("Please select an image");
            return;
          }
          await createBlog({ ...values, image: file });
          toast.success("Blog created");
        }
        onClose(true);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Save failed");
      }
    }
  });

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const displayImage =
    previewUrl || (initial?.image ? assetUrl(initial.image) : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => onClose(false)}
      />
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">
              {initial?._id ? "Edit blog" : "Create blog"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Title, image upload, and description.
            </p>
          </div>
          <button
            className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-50"
            onClick={() => onClose(false)}
          >
            ✕
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={formik.handleSubmit}>
          <Input
            label="Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title ? (formik.errors.title as string) : ""}
          />

          <div className="space-y-2">
            <div className="flex items-end justify-between gap-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.currentTarget.files?.[0] || null)}
                  className="block w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-900 hover:file:bg-slate-200"
                />
                <span className="mt-1 block text-xs text-slate-500">
                  {initial?._id
                    ? "Choose a new file to replace the current image (optional)."
                    : "Upload an image for this blog post."}
                </span>
              </label>
            </div>

            {displayImage ? (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayImage}
                  alt="Preview"
                  className="h-48 w-full object-cover"
                />
              </div>
            ) : null}
          </div>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </span>
            <textarea
              name="description"
              className={[
                "min-h-28 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition",
                formik.touched.description && formik.errors.description
                  ? "border-rose-400 focus:ring-2 focus:ring-rose-200"
                  : "border-slate-200 focus:ring-2 focus:ring-indigo-200"
              ].join(" ")}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.description && formik.errors.description ? (
              <span className="mt-1 block text-xs text-rose-600">
                {formik.errors.description as string}
              </span>
            ) : null}
          </label>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onClose(false)}
              disabled={formik.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={formik.isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

