"use client";

import { SessionProvider } from "next-auth/react";

export default function Test() {
  return (
    <SessionProvider>
      <TestPage />
    </SessionProvider>
  );
}

function TestPage() {
  return (
    <div className="bg-[#F9F9FA]">
      <div className="flex justify-between container mx-auto">
        <p className="font-Bold text-red-600 text-9xl py-72">ГОЙДА</p>
      </div>
    </div>
  );
}
