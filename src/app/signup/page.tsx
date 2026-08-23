"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center p-4 md:p-margin-desktop relative overflow-hidden">
      {/* Gradient blobs */}
      <div className="gradient-blob bg-secondary-container w-[450px] h-[450px] top-[-100px] right-[-80px] animate-float-slow" />
      <div className="gradient-blob bg-primary-container w-[350px] h-[350px] bottom-[-100px] left-[-80px] animate-float-delayed" />
      <div className="gradient-blob bg-tertiary-fixed w-[250px] h-[250px] top-[30%] left-[5%] animate-float" />

      <main className="w-full max-w-[480px] bg-surface-container-lowest rounded-xl border border-outline-variant shadow-subtle p-8 z-10 relative animate-fade-in">
        {/* Header */}
        <div className="text-center mb-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 text-headline-lg font-bold text-primary mb-2"
          >
            <span className="material-symbols-outlined icon-filled text-primary-container">
              how_to_vote
            </span>
            CivicVoice
          </Link>
          <h1 className="text-headline-sm font-semibold text-on-surface mt-2">
            Join your community
          </h1>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Create an account and start making a difference.
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                s <= step ? "bg-primary-container" : "bg-surface-container-high"
              }`}
            />
          ))}
        </div>

        <form className="flex flex-col gap-stack-md" onSubmit={(e) => e.preventDefault()}>
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-md text-on-surface mb-1">
                    First name
                  </label>
                  <input
                    className="block w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface text-body-sm placeholder:text-on-surface-variant/50"
                    placeholder="Jane"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-label-md text-on-surface mb-1">
                    Last name
                  </label>
                  <input
                    className="block w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface text-body-sm placeholder:text-on-surface-variant/50"
                    placeholder="Doe"
                    type="text"
                  />
                </div>
              </div>
              <div>
                <label className="block text-label-md text-on-surface mb-1">
                  Email address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    mail
                  </span>
                  <input
                    className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface text-body-sm placeholder:text-on-surface-variant/50"
                    placeholder="jane@example.com"
                    type="email"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 px-4 rounded-lg text-label-md font-semibold bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors shadow-subtle mt-2"
              >
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-label-md text-on-surface mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    lock
                  </span>
                  <input
                    className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface text-body-sm placeholder:text-on-surface-variant/50"
                    placeholder="Min. 8 characters"
                    type="password"
                  />
                </div>
              </div>
              <div>
                <label className="block text-label-md text-on-surface mb-1">
                  Confirm password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    lock_reset
                  </span>
                  <input
                    className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface text-body-sm placeholder:text-on-surface-variant/50"
                    placeholder="Repeat password"
                    type="password"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 rounded-lg text-label-md font-semibold border border-outline-variant text-on-surface hover:bg-surface-container transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 px-4 rounded-lg text-label-md font-semibold bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors shadow-subtle"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="block text-label-md text-on-surface mb-1">
                  Your district / ZIP code
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    location_on
                  </span>
                  <input
                    className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-lg bg-surface text-on-surface text-body-sm placeholder:text-on-surface-variant/50"
                    placeholder="e.g. District 9 or 90210"
                    type="text"
                  />
                </div>
              </div>

              <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/30">
                <p className="text-label-md text-on-surface mb-2">
                  I&apos;m interested in: (optional)
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Road Safety",
                    "Parks",
                    "Public Transit",
                    "Education",
                    "Environment",
                    "Housing",
                  ].map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      className="text-label-sm px-3 py-1.5 rounded-full border border-outline-variant hover:bg-primary-fixed/30 hover:border-primary-container transition-colors text-on-surface-variant hover:text-primary"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input
                  className="h-4 w-4 mt-0.5 rounded border-outline-variant accent-primary"
                  id="terms"
                  type="checkbox"
                />
                <label className="text-body-sm text-on-surface-variant" htmlFor="terms">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 px-4 rounded-lg text-label-md font-semibold border border-outline-variant text-on-surface hover:bg-surface-container transition-colors"
                >
                  Back
                </button>
                <Link
                  href="/dashboard"
                  className="flex-1 py-3 px-4 rounded-lg text-label-md font-semibold bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors shadow-subtle text-center"
                >
                  Create Account
                </Link>
              </div>
            </>
          )}
        </form>

        <p className="text-center text-body-sm text-on-surface-variant mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </main>
    </div>
  );
}
