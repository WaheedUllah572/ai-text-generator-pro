import { useState } from "react";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <Component {...pageProps} darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}
