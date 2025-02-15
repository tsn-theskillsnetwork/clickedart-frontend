import React from "react";

export default function SpinLoader({ size }) {
  return (
    <div
      style={{ width: size ? size : "1rem", height: size ? size : "1rem" }}
      className={`border-2 border-t-blue-500 border-gray-300 rounded-full animate-spin`}
    />
  );
}
