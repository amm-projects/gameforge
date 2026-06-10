import { translations } from "@/lib/i18n";
import { useLocaleStore } from "@/stores/localeStore";

export function useT() {
  const locale = useLocaleStore((s) => s.locale);
  return (key: string, params?: Record<string, string | number>): string => {
    let text = translations[key]?.[locale];
    if (text === undefined) return key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{{${k}}}`, String(v));
      }
    }
    return text;
  };
}
