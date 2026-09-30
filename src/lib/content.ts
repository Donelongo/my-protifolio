import { useEffect, useState } from "react";
import {
  defaultProfile,
  projects as defaultProjects,
  type PortfolioProfile,
  type Project,
} from "../data/portfolio";
import { firebaseConfigured, getFirebaseServices } from "./firebase";

const normalizeProjects = (items: Project[]) =>
  items.filter((project) => project.published !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
const sortProjects = (items: Project[]) => [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export function usePortfolioContent() {
  const [profile, setProfile] = useState<PortfolioProfile>(defaultProfile);
  const [projects, setProjects] = useState<Project[]>(normalizeProjects(defaultProjects));
  const [allProjects, setAllProjects] = useState<Project[]>(sortProjects(defaultProjects));
  const [loading, setLoading] = useState(firebaseConfigured);
  const [hasRemoteProjects, setHasRemoteProjects] = useState(false);

  useEffect(() => {
    if (!firebaseConfigured) return;
    let active = true;
    let stopProfile: (() => void) | undefined;
    let stopProjects: (() => void) | undefined;
    let profileReady = false;
    let projectsReady = false;
    const finish = () => profileReady && projectsReady && active && setLoading(false);

    void getFirebaseServices().then((services) => {
      if (!services || !active) return;
      const { db, firestore } = services;
      stopProfile = firestore.onSnapshot(
        firestore.doc(db, "portfolio", "profile"),
        (snapshot) => {
          if (snapshot.exists()) setProfile({ ...defaultProfile, ...snapshot.data() });
          profileReady = true;
          finish();
        },
        () => { profileReady = true; finish(); },
      );
      stopProjects = firestore.onSnapshot(
        firestore.collection(db, "projects"),
        (snapshot) => {
          setHasRemoteProjects(!snapshot.empty);
          if (!snapshot.empty) {
            const remoteProjects = snapshot.docs.map((item) => item.data() as Project);
            setAllProjects(sortProjects(remoteProjects));
            setProjects(normalizeProjects(remoteProjects));
          }
          projectsReady = true;
          finish();
        },
        () => { projectsReady = true; finish(); },
      );
    });

    return () => {
      active = false;
      stopProfile?.();
      stopProjects?.();
    };
  }, []);

  return { profile, projects, allProjects, loading, configured: firebaseConfigured, hasRemoteProjects };
}

export async function saveProfile(profile: PortfolioProfile) {
  const services = await getFirebaseServices();
  if (!services) throw new Error("Firebase is not configured.");
  await services.firestore.setDoc(services.firestore.doc(services.db, "portfolio", "profile"), profile, { merge: true });
}

export async function saveProject(project: Project) {
  const services = await getFirebaseServices();
  if (!services) throw new Error("Firebase is not configured.");
  await services.firestore.setDoc(services.firestore.doc(services.db, "projects", project.id), project);
}

export async function removeProject(id: string) {
  const services = await getFirebaseServices();
  if (!services) throw new Error("Firebase is not configured.");
  await services.firestore.deleteDoc(services.firestore.doc(services.db, "projects", id));
}

export async function seedPortfolio() {
  const services = await getFirebaseServices();
  if (!services) throw new Error("Firebase is not configured.");
  const { db, firestore } = services;
  const batch = firestore.writeBatch(db);
  batch.set(firestore.doc(db, "portfolio", "profile"), defaultProfile, { merge: true });
  defaultProjects.forEach((project, index) => batch.set(firestore.doc(db, "projects", project.id), { ...project, order: index, published: true }));
  await batch.commit();
}
