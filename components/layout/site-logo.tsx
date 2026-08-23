"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { safeImageSrc } from "@/lib/images";

function UploadedSiteLogo({
  alt,
  children,
  className,
  height,
  imageSrc,
  sizes,
  width,
}: {
  alt: string;
  children: ReactNode;
  className: string;
  height: number;
  imageSrc: string;
  sizes: string;
  width: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageFailed) {
    return <>{children}</>;
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      unoptimized
      className={className}
      onError={() => setImageFailed(true)}
    />
  );
}

export function SiteLogo({
  alt,
  children,
  className,
  height,
  logoImage,
  sizes,
  width,
}: {
  alt: string;
  children: ReactNode;
  className: string;
  height: number;
  logoImage: string | null | undefined;
  sizes: string;
  width: number;
}) {
  const imageSrc = safeImageSrc(logoImage, "");
  if (!imageSrc) {
    return <>{children}</>;
  }

  return (
    <UploadedSiteLogo
      key={imageSrc}
      imageSrc={imageSrc}
      alt={alt}
      sizes={sizes}
      className={className}
      width={width}
      height={height}
    >
      {children}
    </UploadedSiteLogo>
  );
}
