import { useCallback, useRef, useState } from "react";
import {
  BackToTop,
  CustomCursor,
  FloatingSocials,
  LoadingScreen,
  Navbar,
  NotFound,
  ScrollProgress,
  Toast,
} from "./components/SiteChrome";
import {
  About,
  Contact,
  Experience,
  Hero,
  Projects,
  Skills,
} from "./components/Sections";

export function App() {
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);
  const validPath = ["/", "/index.html"].includes(window.location.pathname);

  const notify = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(""), 3600);
  }, []);

  if (!validPath) return <NotFound />;

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <LoadingScreen />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <FloatingSocials />
      <main id="main-content" className="portfolio-layout">
        <aside className="portfolio-intro">
          <Hero />
        </aside>
        <div className="portfolio-content">
          <About />
          <Projects />
          <Experience />
          <Skills />
          <Contact notify={notify} />
        </div>
      </main>
      <BackToTop />
      <Toast message={toast} />
    </>
  );
}
