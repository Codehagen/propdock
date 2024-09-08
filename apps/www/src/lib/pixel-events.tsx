"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect } from "react";

export const FacebookPixelEvents: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    import("react-facebook-pixel")
      .then(x => x.default)
      .then(ReactPixel => {
        ReactPixel.init("1442315969659116"); //don't
        ReactPixel.pageView();
      });
  }, [pathname, searchParams]);

  return null;
};
