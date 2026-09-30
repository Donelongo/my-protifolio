import { lazy, Suspense, useCallback, useRef, useState } from "react";
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
import { usePortfolioContent } from "./lib/content";

const AdminPage = lazy(() => import("./components/AdminPage").then((module) => ({ default: module.AdminPage })));

export function App() {
  const content = usePortfolioContent();
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const validPath = ["/", "/index.html", "/admin"].includes(path);

  const notify = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(""), 3600);
  }, []);

  if (!validPath) return <NotFound />;
  if (path === "/admin") return <Suspense fallback={<div className="admin-loading">Opening Portfolio Studio…</div>}><AdminPage /></Suspense>;

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <LoadingScreen />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <FloatingSocials github={content.profile.github} linkedin={content.profile.linkedin} />
      <main id="main-content" className="portfolio-layout">
        <aside className="portfolio-intro">
          <Hero profile={content.profile} />
        </aside>
        <div className="portfolio-content">
          <About profile={content.profile} />
          <Projects projects={content.projects} />
          <Experience />
          <Skills groups={content.skillGroups} />
          <Contact notify={notify} profile={content.profile} />
        </div>
      </main>
      <BackToTop />
      <Toast message={toast} />
    </>
  );
}
