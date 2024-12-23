import Button2 from "@/components/button2";
import Link from "next/link";
import React from "react";

export default function NotFoundPage() {
  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
            Something&apos;s missing.
          </p>
          <p className="mb-4 text-lg font-medium text-gray-500">
            Sorry, we can&apos;t find that page.
          </p>
          <Link href="/" className="inline-block">
            <Button2 className="w-full md:w-auto">Back to Homepage</Button2>
          </Link>
        </div>
      </div>
    </section>
  );
}
