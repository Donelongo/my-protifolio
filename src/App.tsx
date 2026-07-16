import { useCallback, useRef, useState } from "react";
import {
  BackToTop,
  CustomCursor,
  FloatingSocials,
  Footer,
  LoadingScreen,
  Navbar,
  NotFound,
  ScrollProgress,
  Toast,
} from "./components/SiteChrome";
import {
  About,
  Contact,
  CurrentWork,
  Experience,
  Hero,
  Projects,
  Skills,
  WhyWorkWithMe,
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
      <main id="main-content">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <CurrentWork />
        <WhyWorkWithMe />
        <Contact notify={notify} />
      </main>
      <Footer />
      <BackToTop />
      <Toast message={toast} />
    </>
  );
}
