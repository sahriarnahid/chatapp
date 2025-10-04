import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme) => {
    console.log("Setting theme to:", theme); // debug
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
