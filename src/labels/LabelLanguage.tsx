import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

export type LabelLanguage = "en" | "de";

interface LabelLanguageContextValue {
  language: LabelLanguage;
  setLanguage: (language: LabelLanguage) => void;
}

const LabelLanguageContext = createContext<LabelLanguageContextValue | undefined>(
  undefined,
);

export function LabelLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LabelLanguage>("en");

  const value = useMemo(
    () => ({
      language,
      setLanguage,
    }),
    [language],
  );

  return (
    <LabelLanguageContext.Provider value={value}>
      {children}
    </LabelLanguageContext.Provider>
  );
}

export function useLabelLanguage(): LabelLanguageContextValue {
  const ctx = useContext(LabelLanguageContext);
  if (!ctx) {
    throw new Error(
      "useLabelLanguage must be used within a LabelLanguageProvider",
    );
  }
  return ctx;
}

