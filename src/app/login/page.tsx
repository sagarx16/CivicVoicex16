"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center p-4 md:p-margin-desktop relative overflow-hidden">
      {/* Gradient blobs */}
      <div
        className="gradient-blob bg-primary-container w-[400px] h-[400px] top-[-100px] left-[-100px] animate-float"
      />
      <div
        className="gradient-blob bg-secondary-container w-[500px] h-[500px] bottom-[-150px] right-[-150px] animate-float-delayed"
      />
      <div
        className="gradient-blob bg-tertiary-fixed w-[300px] h-[300px] top-[20%] right-[10%] animate-float-slow"
      />

      {/* Card */}
      <main className="w-full max-w-[420px] bg-surface-container-lowest rounded-xl border border-outline-variant shadow-subtle p-8 z-10 relative animate-fade-in">
        {/* Header */}
        <div className="text-center mb-stack-lg">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 text-headline-lg font-bold text-primary mb-stack-sm"
          >
            <span className="material-symbols-outlined icon-filled text-primary-container">
              how_to_vote
            </span>
            CivicVoice
          </Link>
          <h1 className="text-headline-sm font-semibold text-on-surface mt-2">
            Welcome back
          </h1>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Sign in to continue shaping your community.
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-stack-md" onSubmit={(e) => e.preventDefault()}>
          {/* Email */}
          <div>
            <label
              className="block text-label-md text-on-surface mb-1"
              htmlFor="email"
            >
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline text-[20px]">
                  mail
                </span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface text-body-sm placeholder:text-on-surface-variant/50 transition-all"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                className="block text-label-md text-on-surface"
                htmlFor="password"
              >
                Password
              </label>
              <a
                className="text-label-sm text-primary hover:underline"
                href="#"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline text-[20px]">
                  lock
                </span>
              </div>
              <input
                className="block w-full pl-10 pr-10 py-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface text-body-sm placeholder:text-on-surface-variant/50 transition-all"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-outline hover:text-on-surface transition-colors text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2">
            <input
              className="h-4 w-4 rounded border-outline-variant accent-primary"
              id="remember-me"
              name="remember-me"
              type="checkbox"
            />
            <label
              className="text-body-sm text-on-surface-variant"
              htmlFor="remember-me"
            >
              Remember me
            </label>
          </div>

          {/* Submit */}
          <Link
            href="/dashboard"
            className="w-full flex justify-center py-3 px-4 rounded-lg text-label-md font-semibold bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors shadow-subtle hover:shadow-hover"
          >
            Sign In
          </Link>
        </form>

        {/* Divider */}
        <div className="my-stack-lg relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-surface-container-lowest text-body-sm text-on-surface-variant">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex justify-center items-center gap-2 py-2.5 px-4 border border-outline-variant rounded-lg text-label-md text-on-surface bg-surface hover:bg-surface-container-low transition-colors">
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                fill="#EA4335"
              />
              <path
                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                fill="#4285F4"
              />
              <path
                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                fill="#FBBC05"
              />
              <path
                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                fill="#34A853"
              />
            </svg>
            Google
          </button>
          <button className="flex justify-center items-center gap-2 py-2.5 px-4 border border-outline-variant rounded-lg text-label-md text-on-surface bg-surface hover:bg-surface-container-low transition-colors">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Apple
          </button>
        </div>

        <p className="text-center text-body-sm text-on-surface-variant mt-stack-lg">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary font-semibold hover:underline"
          >
            Sign up free
          </Link>
        </p>
      </main>
    </div>
  );
}
