"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { login } from "@/services/auth";
import { setTokenCookie } from "@/utils/cookies";

const schema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Min 6 characters").required("Password is required")
});

export default function LoginPage() {
  const router = useRouter();
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        const data = await login(values);
        setTokenCookie(data.token);
        toast.success("Welcome back");
        router.replace("/dashboard");
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Login failed");
      }
    }
  });

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-xl font-extrabold tracking-tight">Admin Login</h1>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to manage your blog content.
        </p>

        <form className="mt-6 space-y-4" onSubmit={formik.handleSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email ? (formik.errors.email as string) : ""}
            placeholder="admin@example.com"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password ? (formik.errors.password as string) : ""}
            placeholder="••••••••"
          />
          <Button
            type="submit"
            className="w-full"
            isLoading={formik.isSubmitting}
          >
            Login
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link className="font-semibold text-indigo-700" href="/signup">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}

