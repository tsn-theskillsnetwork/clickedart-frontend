"use client"

import { useParams } from "next/navigation";
import React from "react";

export default function SingleBlogPage() {
  const id = useParams().slug;
  return <div>
    <h1>Single Blog Page</h1>
    <p>Blog ID: {id}</p>
  </div>;
}
