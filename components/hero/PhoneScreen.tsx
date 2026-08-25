"use client";

import { Star, CheckCircle, Menu } from "lucide-react";

export default function PhoneScreen() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[34px] bg-white text-black">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
        <h2 className="text-[18px] font-bold tracking-tight">
          <span className="text-[#4285F4]">Google</span> Reviews
        </h2>

        <Menu size={20} className="text-neutral-500" />
      </div>

      {/* Business */}
      <div className="px-5 pt-5">
        <h3 className="text-[26px] font-bold leading-none">
          Project X99
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-[34px] font-bold leading-none">
            4.9
          </span>

          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className="fill-[#FBBC05] text-[#FBBC05]"
              />
            ))}
          </div>

          <span className="text-sm text-neutral-500">
            (1,248)
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm font-medium text-green-600">
          <CheckCircle size={15} />
          Verified by Google
        </div>
      </div>

      {/* Reviews */}
      <div className="flex-1 space-y-3 overflow-hidden px-4 pt-5">

        <ReviewCard
          name="John D."
          time="2 days ago"
          text="Amazing service. Super easy to leave a review with one tap."
        />

        <ReviewCard
          name="Sarah M."
          time="5 days ago"
          text="Great product! Our reviews increased instantly."
        />

      </div>

      {/* CTA */}
      <div className="border-t border-neutral-200 bg-white px-4 py-4">

        <button className="w-full rounded-2xl bg-[#4285F4] py-3 text-[15px] font-semibold text-white transition hover:bg-[#357AE8]">
          Leave a Google Review
        </button>

        <p className="mt-2 text-center text-[11px] text-neutral-500">
          📱 Tap your phone to review
        </p>

      </div>

    </div>
  );
}

function ReviewCard({
  name,
  time,
  text,
}: {
  name: string;
  time: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-neutral-100 p-3">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-[15px] font-semibold">
            {name}
          </p>

          <div className="mt-1 flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                className="fill-[#FBBC05] text-[#FBBC05]"
              />
            ))}
          </div>
        </div>

        <span className="text-[11px] text-neutral-500">
          {time}
        </span>

      </div>

      <p className="mt-2 text-[13px] leading-5 text-neutral-600">
        {text}
      </p>

    </div>
  );
}