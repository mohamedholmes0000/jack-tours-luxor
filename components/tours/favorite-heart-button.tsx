"use client";

import { useState } from "react";

export function FavoriteHeartButton({ className = "" }: { className?: string }) {
  const [active, setActive] = useState(false);

  return (
    <button
      type="button"
      aria-label={active ? "Remove tour from favorites" : "Save tour to favorites"}
      aria-pressed={active}
      className={`grid size-7 place-items-center rounded-full bg-black/10 text-white drop-shadow-[0_1px_6px_rgb(0_0_0_/_65%)] transition duration-300 hover:scale-105 hover:bg-black/20 hover:text-[var(--color-gold-light)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${className} ${
        active ? "text-[var(--color-gold-light)]" : ""
      }`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setActive((current) => !current);
      }}
    >
      <svg
        aria-hidden="true"
        className="size-[20px]"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
      >
        <path
          d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
