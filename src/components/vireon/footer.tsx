"use client";

import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#1a2540] bg-[#060d1b] backdrop-blur-sm py-4 px-6 text-center mt-auto">
      <div className="flex items-center justify-center gap-2">
        <Sparkles size={14} className="text-[#3b6dfa]/60" />
        <p className="text-sm text-[#6b7fa3]">
          Developed By{" "}
          <span className="font-semibold text-[#c8d3e8]">
            Arefin Siddiqui
          </span>
        </p>
        <Sparkles size={14} className="text-[#3b6dfa]/60" />
      </div>
    </footer>
  );
}
