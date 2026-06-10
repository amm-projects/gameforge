"use client";

import { useLocaleStore } from "@/stores/localeStore";
import { useEffect } from "react";

export function LangSetter() {
  const locale = useLocaleStore((s) => s.locale);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
