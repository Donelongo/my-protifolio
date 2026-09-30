import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Eye,
  EyeOff,
  LayoutDashboard,
  LogOut,
  Pencil,
  Plus,
  Save,
  Settings2,
  Trash2,
  Upload,
} from "lucide-react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { firebaseConfigured, getFirebaseServices } from "../lib/firebase";
import {
  removeProject,
  saveProfile,
  saveProject,
  seedPortfolio,
  usePortfolioContent,
} from "../lib/content";
import { projects as defaultProjects, type PortfolioProfile, type Project } from "../data/portfolio";

type Tab = "projects" | "profile";

const blankProject = (order: number): Project => ({
  id: `project-${Date.now()}`,
  title: "Untitled project",
  category: "Web",
  description: "",
  role: "",
  challenge: "",
  solution: "",
  technologies: [],
  visualTone: "emerald",
  icon: "team",
  published: false,
  order,
});

export function AdminPage() {
  const content = usePortfolioContent();
  const [user, setUser] = useState<User | null>(null);
  const [firebaseAuth, setFirebaseAuth] = useState<import("firebase/auth").Auth | null>(null);
  const [authReady, setAuthReady] = useState(!firebaseConfigured);
  const [email, setEmail] = useState("dagmawieliaswork@gmail.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("projects");
  const [profileDraft, setProfileDraft] = useState<PortfolioProfile>(content.profile);
  const [projectDrafts, setProjectDrafts] = useState<Project[]>(defaultProjects);
  const [editingId, setEditingId] = useState<string | null>(defaultProjects[0]?.id ?? null);

  useEffect(() => {
    const meta = document.querySelector('meta[name="robots"]');
    const previous = meta?.getAttribute("content");
    meta?.setAttribute("content", "noindex, nofollow");
    document.title = "Portfolio Studio · Dagmawi Elias Lewi";
    return () => {
      if (meta && previous) meta.setAttribute("content", previous);
      document.title = "Dagmawi Elias Lewi · Full Stack Software Engineer";
    };
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    void getFirebaseServices().then((services) => {
      if (!services) return;
      setFirebaseAuth(services.auth);
      unsubscribe = onAuthStateChanged(services.auth, (nextUser) => {
        setUser(nextUser);
        setAuthReady(true);
      });
    });
    return () => unsubscribe?.();
  }, []);

  useEffect(() => setProfileDraft(content.profile), [content.profile]);
  useEffect(() => {
    if (!content.loading) setProjectDrafts(content.allProjects.length ? content.allProjects : defaultProjects);
  }, [content.loading, content.allProjects]);

  const currentProject = useMemo(
    () => projectDrafts.find((project) => project.id === editingId) ?? null,
    [editingId, projectDrafts],
  );

  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3600);
  };

  const login = async (event: FormEvent) => {
    event.preventDefault();
    if (!firebaseAuth) return;
    setBusy(true);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      setPassword("");
    } catch {
      notify("Sign-in failed. Check the email, password, and Firebase Authentication setup.");
    } finally {
      setBusy(false);
    }
  };

  const updateProject = (patch: Partial<Project>) => {
    if (!currentProject) return;
    setProjectDrafts((items) =>
      items.map((project) => (project.id === currentProject.id ? { ...project, ...patch } : project)),
    );
  };

  const persistProject = async () => {
    if (!currentProject) return;
    if (!currentProject.title.trim() || !currentProject.id.trim()) {
      notify("Project title and ID are required.");
      return;
    }
    setBusy(true);
    try {
      await saveProject(currentProject);
      notify("Project saved and synced to the portfolio.");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Project could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const deleteProject = async () => {
    if (!currentProject || !window.confirm(`Remove “${currentProject.title}” from the portfolio?`)) return;
    setBusy(true);
    try {
      await removeProject(currentProject.id);
      const remaining = projectDrafts.filter((item) => item.id !== currentProject.id);
      setProjectDrafts(remaining);
      setEditingId(remaining[0]?.id ?? null);
      notify("Project removed.");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Project could not be removed.");
    } finally {
      setBusy(false);
    }
  };

  const moveProject = async (direction: -1 | 1) => {
    if (!currentProject) return;
    const index = projectDrafts.findIndex((project) => project.id === currentProject.id);
    const target = index + direction;
    if (target < 0 || target >= projectDrafts.length) return;
    const reordered = [...projectDrafts];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const normalized = reordered.map((project, order) => ({ ...project, order }));
    setProjectDrafts(normalized);
    try {
      await Promise.all(normalized.map(saveProject));
      notify("Project order updated.");
    } catch {
      notify("The new order could not be saved.");
    }
  };

  if (!firebaseConfigured) return <FirebaseSetup />;
  if (!authReady) return <div className="admin-loading">Opening Portfolio Studio…</div>;
  if (!user) {
    return (
      <main className="admin-auth-shell">
        <a href="/" className="admin-back"><ArrowLeft size={16} /> Back to portfolio</a>
        <form className="admin-auth-card" onSubmit={login}>
          <p className="eyebrow">Private workspace</p>
          <h1>Portfolio Studio<span>.</span></h1>
          <p>Sign in to manage your profile and selected work.</p>
          <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          <button className="admin-primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
          {message ? <div className="admin-message" role="status">{message}</div> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div><a className="wordmark" href="/">DEL<span>.</span></a><p>Portfolio Studio</p></div>
        <nav aria-label="Admin navigation">
          <button className={tab === "projects" ? "active" : ""} onClick={() => setTab("projects")}><LayoutDashboard size={17} /> Selected work</button>
          <button className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")}><Settings2 size={17} /> Profile & contact</button>
        </nav>
        <div className="admin-sidebar__footer">
          <a href="/" target="_blank"><Eye size={16} /> View portfolio</a>
          <button onClick={() => firebaseAuth && signOut(firebaseAuth)}><LogOut size={16} /> Sign out</button>
        </div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-header">
          <div><p className="eyebrow">Content management</p><h1>{tab === "projects" ? "Selected work" : "Profile & contact"}</h1></div>
          <span>{user.email}</span>
        </header>

        {tab === "projects" ? (
          <>
          {!content.hasRemoteProjects ? <div className="admin-seed-banner"><div><strong>Load the current portfolio into Firestore</strong><span>This creates editable copies of the five real projects and your current profile.</span></div><button className="admin-primary" disabled={busy} onClick={async () => { setBusy(true); try { await seedPortfolio(); notify("Existing portfolio loaded into the admin workspace."); } catch (error) { notify(error instanceof Error ? error.message : "Could not initialize the portfolio."); } finally { setBusy(false); } }}>Initialize existing content</button></div> : null}
          <div className="admin-project-layout">
            <div className="admin-project-list">
              <div className="admin-list-heading"><span>{projectDrafts.length} projects</span><button onClick={() => { const item = blankProject(projectDrafts.length); setProjectDrafts((items) => [...items, item]); setEditingId(item.id); }}><Plus size={15} /> Add project</button></div>
              {projectDrafts.map((project, index) => (
                <button key={project.id} className={editingId === project.id ? "active" : ""} onClick={() => setEditingId(project.id)}>
                  <span>{String(index + 1).padStart(2, "0")}</span><div><strong>{project.title}</strong><small>{project.category} · {project.published === false ? "Draft" : "Published"}</small></div><Pencil size={14} />
                </button>
              ))}
            </div>
            {currentProject ? (
              <ProjectEditor project={currentProject} update={updateProject} save={persistProject} remove={deleteProject} move={moveProject} busy={busy} />
            ) : <div className="admin-empty">Add a project to begin.</div>}
          </div></>
        ) : (
          <ProfileEditor
            profile={profileDraft}
            update={(key, value) => setProfileDraft((current) => ({ ...current, [key]: value }))}
            save={async () => { setBusy(true); try { await saveProfile(profileDraft); notify("Profile saved and synced to the portfolio."); } catch (error) { notify(error instanceof Error ? error.message : "Profile could not be saved."); } finally { setBusy(false); } }}
            busy={busy}
          />
        )}
        {message ? <div className="admin-toast" role="status"><Check size={15} /> {message}</div> : null}
      </section>
    </main>
  );
}

function ProjectEditor({ project, update, save, remove, move, busy }: { project: Project; update: (patch: Partial<Project>) => void; save: () => void; remove: () => void; move: (direction: -1 | 1) => void; busy: boolean }) {
  return (
    <div className="admin-editor">
      <div className="admin-editor__bar"><div><button title="Move up" onClick={() => move(-1)}><ArrowUp size={16} /></button><button title="Move down" onClick={() => move(1)}><ArrowDown size={16} /></button></div><label className="admin-switch"><input type="checkbox" checked={project.published !== false} onChange={(event) => update({ published: event.target.checked })} />{project.published !== false ? <Eye size={15} /> : <EyeOff size={15} />}{project.published !== false ? "Published" : "Draft"}</label></div>
      <div className="admin-form-grid">
        <Field label="Project title" value={project.title} onChange={(value) => update({ title: value })} wide />
        <Field label="Project ID" value={project.id} onChange={(value) => update({ id: value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} />
        <Select label="Category" value={project.category} options={["Web", "Mobile", "GIS", "Team"]} onChange={(value) => update({ category: value as Project["category"] })} />
        <Field label="Role" value={project.role} onChange={(value) => update({ role: value })} wide />
        <TextArea label="Short description" value={project.description} onChange={(value) => update({ description: value })} wide />
        <TextArea label="Challenge" value={project.challenge} onChange={(value) => update({ challenge: value })} />
        <TextArea label="Solution" value={project.solution} onChange={(value) => update({ solution: value })} />
        <Field label="Technologies (comma separated)" value={project.technologies.join(", ")} onChange={(value) => update({ technologies: value.split(",").map((item) => item.trim()).filter(Boolean) })} wide />
        <Field label="Website URL" value={project.liveUrl ?? ""} onChange={(value) => update({ liveUrl: value || undefined })} />
        <Field label="Google Play URL" value={project.googlePlayUrl ?? ""} onChange={(value) => update({ googlePlayUrl: value || undefined })} />
        <Field label="App Store URL" value={project.appStoreUrl ?? ""} onChange={(value) => update({ appStoreUrl: value || undefined })} />
        <Field label="Collaboration note" value={project.collaboration ?? ""} onChange={(value) => update({ collaboration: value || undefined })} />
        <ImageUpload label="Project image or logo" value={project.imageUrl ?? ""} path={`projects/${project.id}`} onChange={(value) => update({ imageUrl: value || undefined, assetKey: undefined })} wide />
        <Select label="Existing logo" value={project.assetKey ?? ""} options={["", "catholic-mezmur", "ore-mechanical", "dentrace"]} onChange={(value) => update({ assetKey: (value || undefined) as Project["assetKey"] })} />
        <Select label="Visual tone" value={project.visualTone} options={["emerald", "blue", "orange", "cyan", "violet"]} onChange={(value) => update({ visualTone: value as Project["visualTone"] })} />
        <Select label="Fallback icon" value={project.icon} options={["music", "mobile", "mechanical", "map", "team"]} onChange={(value) => update({ icon: value as Project["icon"] })} />
      </div>
      <div className="admin-editor__actions"><button className="admin-danger" onClick={remove}><Trash2 size={16} /> Delete</button><button className="admin-primary" onClick={save} disabled={busy}><Save size={16} /> {busy ? "Saving…" : "Save project"}</button></div>
    </div>
  );
}

function ProfileEditor({ profile, update, save, busy }: { profile: PortfolioProfile; update: (key: keyof PortfolioProfile, value: string) => void; save: () => void; busy: boolean }) {
  return (
    <div className="admin-editor admin-profile-editor"><div className="admin-form-grid">
      <Field label="Full name" value={profile.name} onChange={(value) => update("name", value)} />
      <Field label="Professional role" value={profile.role} onChange={(value) => update("role", value)} />
      <Field label="Location" value={profile.location} onChange={(value) => update("location", value)} />
      <Field label="Email" type="email" value={profile.email} onChange={(value) => update("email", value)} />
      <Field label="Phone" value={profile.phone} onChange={(value) => update("phone", value)} />
      <Field label="GitHub URL" value={profile.github} onChange={(value) => update("github", value)} />
      <Field label="LinkedIn URL" value={profile.linkedin} onChange={(value) => update("linkedin", value)} wide />
      <ImageUpload label="Profile portrait" value={profile.portraitUrl ?? ""} path="profile" onChange={(value) => update("portraitUrl", value)} wide />
      <Field label="Hero headline" value={profile.headline} onChange={(value) => update("headline", value)} wide />
      <TextArea label="Hero summary" value={profile.summary} onChange={(value) => update("summary", value)} wide />
      <Field label="About section title" value={profile.aboutTitle} onChange={(value) => update("aboutTitle", value)} wide />
      <TextArea label="About introduction" value={profile.aboutLead} onChange={(value) => update("aboutLead", value)} wide />
    </div><div className="admin-editor__actions admin-editor__actions--right"><button className="admin-primary" onClick={save} disabled={busy}><Save size={16} /> {busy ? "Saving…" : "Save profile"}</button></div></div>
  );
}

function Field({ label, value, onChange, wide, type = "text" }: { label: string; value: string; onChange: (value: string) => void; wide?: boolean; type?: string }) { return <label className={wide ? "wide" : ""}>{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>; }

function ImageUpload({ label, value, path, onChange, wide }: { label: string; value: string; path: string; onChange: (value: string) => void; wide?: boolean }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadImage = async (file?: File) => {
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Choose a PNG, JPG, WebP, GIF, or SVG image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("The image must be smaller than 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const services = await getFirebaseServices();
      if (!services) throw new Error("Firebase is not connected.");
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
      const imageRef = services.storageModule.ref(services.storage, `portfolio-media/${path}/${Date.now()}-${safeName}`);
      await services.storageModule.uploadBytes(imageRef, file, { contentType: file.type });
      onChange(await services.storageModule.getDownloadURL(imageRef));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "The image could not be uploaded.");
    } finally {
      setUploading(false);
    }
  };

  return <div className={`admin-image-upload${wide ? " wide" : ""}`}>
    <span>{label}</span>
    <div className="admin-image-upload__content">
      {value ? <img src={value} alt="Current upload preview" /> : <div className="admin-image-upload__placeholder"><Upload size={22} /><small>No image selected</small></div>}
      <div>
        <label className="admin-upload-button"><Upload size={15} /> {uploading ? "Uploading…" : value ? "Replace image" : "Choose image"}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" disabled={uploading} onChange={(event) => { void uploadImage(event.target.files?.[0]); event.target.value = ""; }} /></label>
        {value ? <button type="button" className="admin-remove-image" onClick={() => onChange("")}>Remove image</button> : null}
        <small>PNG, JPG, WebP, GIF or SVG · maximum 5 MB</small>
        {error ? <small className="admin-upload-error">{error}</small> : null}
      </div>
    </div>
  </div>;
}
function TextArea({ label, value, onChange, wide }: { label: string; value: string; onChange: (value: string) => void; wide?: boolean }) { return <label className={wide ? "wide" : ""}>{label}<textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} /></label>; }
function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label>{label}<select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option || "none"} value={option}>{option || "None"}</option>)}</select></label>; }

function FirebaseSetup() {
  return <main className="admin-setup"><div><p className="eyebrow">One-time setup</p><h1>Connect Firebase<span>.</span></h1><p>The admin workspace is built, but it needs your Firebase web-app configuration before sign-in and saving can work.</p><ol><li>Create or open a Firebase project.</li><li>Enable Email/Password in Authentication and create your admin user.</li><li>Create Firestore and publish the included <code>firestore.rules</code>.</li><li>Copy <code>.env.example</code> to <code>.env.local</code> and add your Firebase web configuration.</li><li>Restart the local server or redeploy Vercel with the same environment variables.</li></ol><button className="admin-primary" onClick={async () => { try { await seedPortfolio(); } catch { /* setup state */ } }} disabled>Initialize existing portfolio after connection</button><a href="/"><ArrowLeft size={15} /> Return to portfolio</a></div></main>;
}
