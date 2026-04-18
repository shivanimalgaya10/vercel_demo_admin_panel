"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { signup } from "@/services/auth";
import { setTokenCookie } from "@/utils/cookies";

const schema = Yup.object({
  name: Yup.string().min(2, "Min 2 characters").required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Min 6 characters").required("Password is required")
});

export default function SignupPage() {
  const router = useRouter();
  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        const data = await signup(values);
        setTokenCookie(data.token);
        toast.success("Account created");
        router.replace("/dashboard");
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Signup failed");
      }
    }
  });

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-xl font-extrabold tracking-tight">Create account</h1>
        <p className="mt-1 text-sm text-slate-500">
          Signup to start managing blogs.
        </p>

        <form className="mt-6 space-y-4" onSubmit={formik.handleSubmit}>
          <Input
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name ? (formik.errors.name as string) : ""}
            placeholder="Jane Doe"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email ? (formik.errors.email as string) : ""}
            placeholder="jane@example.com"
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
            Sign up
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-semibold text-indigo-700" href="/login">
            Login
          </Link>
        </div>
      </Card>
    </div>
  );
}

