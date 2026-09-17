// Edit these tokens once to update the entire interface.
export const themeConfig = {
  primary: "#2456a6",
  primaryDark: "#183d78",
  primarySoft: "#edf3fc",
  sidebar: "#102a50",
  surface: "#ffffff",
  background: "#f4f6fa",
  text: "#192b44",
  muted: "#64748b",
  border: "#dfe5ee",
  borderRadius: "12px",
  sidebarWidth: "248px",
};
export function applyTheme() {
  Object.entries(themeConfig).forEach(([key, value]) => {
    document.documentElement.style.setProperty(
      "--" + key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()),
      value,
    );
  });
}
