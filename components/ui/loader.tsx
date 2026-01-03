"use client";

import Image from "next/image";

export default function Loader() {
  return (
    <div className="w-full flex justify-center items-center py-10">
      <div className="loader border-4 border-gray-300 border-t-primary rounded-full w-10 h-10 animate-spin"></div>
    </div>
  );
}

export function PESOLoader({
    text = "Loading, please wait...",
}: {
    text?: string;
}) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            {/* Logo */}
            <div className="animate-pulse">
                <Image
                    src="/images/peso-mendez.png"   // 🔴 CHANGE THIS TO YOUR BUSINESS LOGO PATH
                    alt="Loading"
                    width={120}
                    height={120}
                    priority
                />
            </div>

            {/* Text */}
            <p className="mt-4 text-sm font-medium text-gray-600">
                {text}
            </p>
        </div>
    );
}

export function SectionLoader({
    text = "Loading...",
    showLogo = false,
}: {
    text?: string;
    showLogo?: boolean;
}) {
    return (
        <div className="w-full flex flex-col items-center justify-center py-8">
            {showLogo ? (
                <div className="animate-pulse mb-3">
                    <Image
                        src="/images/peso-mendez.png"
                        alt="Loading"
                        width={60}
                        height={60}
                    />
                </div>
            ) : (
                <div className="h-8 w-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-3" />
            )}

            <p className="text-sm text-gray-500">{text}</p>
        </div>
    );
}