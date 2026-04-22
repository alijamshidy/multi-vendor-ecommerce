import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
// "use client"; // این خط رو حتماً اضافه کن چون کامپوننت ما باید Client-Side Rendering داشته باشه

// import { createContext, useContext, useEffect, useState } from "react";

// interface ThemeContextProps {
//   theme: "light" | "dark" | "system";
//   toggleTheme: () => void;
// }

// const ThemeContext = createContext<ThemeContextProps>({
//   theme: "light",
//   toggleTheme: () => {},
// });

// export default function ThemeProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [theme, setTheme] = useState(() => {
//     // بررسی اینکه آیا تم در localStorage وجود دارد یا خیر
//     if (typeof window !== "undefined" && localStorage.getItem("theme")) {
//       return localStorage.getItem("theme") as "light" | "dark" | "system";
//     }
//     return "system"; // حالت پیش‌فرض
//   });

//   const toggleTheme = () => {
//     setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
//   };

//   useEffect(() => {
//     // ذخیره تم در localStorage
//     if (typeof window !== "undefined") {
//       localStorage.setItem("theme", theme);
//     }
//   }, [theme]);

//   const value: ThemeContextProps = {
//     theme,
//     toggleTheme,
//   };

//   return (
//     <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
//   );
// }

// export function useTheme() {
//   return useContext(ThemeContext);
// }
