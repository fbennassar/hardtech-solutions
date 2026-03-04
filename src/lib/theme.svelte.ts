export const themeState = $state({ current: "maintree" });

export function initTheme() {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme") || "maintree";
    document.documentElement.setAttribute("data-theme", savedTheme);
    themeState.current = savedTheme;
  }
}

export function toggleTheme() {
  // Check if event parameter is passed to prevent errors from onchange event
  const newTheme = themeState.current === "maintree" ? "daisymax" : "maintree";
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeState.current = newTheme;
  }
}
