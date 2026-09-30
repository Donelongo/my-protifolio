import { useEffect, useState } from "react";
import {
  defaultProfile,
  projects as defaultProjects,
  type PortfolioProfile,
  type Project,
  skillGroups as defaultSkillGroups,
  type SkillGroup,
} from "../data/portfolio";
import { firebaseConfigured, getFirebaseServices } from "./firebase";

const normalizeProjects = (items: Project[]) =>
  items.filter((project) => project.published !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
const sortProjects = (items: Project[]) => [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

// Firestore rejects `undefined`, while optional form fields naturally produce it.
// Strip those values at the persistence boundary so every admin save is valid.
const withoutUndefined = <T extends object>(value: T): T =>
  Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined),
  ) as T;

export function usePortfolioContent() {
  const [profile, setProfile] = useState<PortfolioProfile>(defaultProfile);
  const [projects, setProjects] = useState<Project[]>(normalizeProjects(defaultProjects));
  const [allProjects, setAllProjects] = useState<Project[]>(sortProjects(defaultProjects));
  const [loading, setLoading] = useState(firebaseConfigured);
  const [hasRemoteProjects, setHasRemoteProjects] = useState(false);
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(defaultSkillGroups);

  useEffect(() => {
    if (!firebaseConfigured) return;
    let active = true;
    let stopProfile: (() => void) | undefined;
    let stopProjects: (() => void) | undefined;
    let stopToolkit: (() => void) | undefined;
    let profileReady = false;
    let projectsReady = false;
    let toolkitReady = false;
    const finish = () => profileReady && projectsReady && toolkitReady && active && setLoading(false);

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
      stopToolkit = firestore.onSnapshot(
        firestore.doc(db, "portfolio", "toolkit"),
        (snapshot) => {
          const groups = snapshot.data()?.groups;
          if (Array.isArray(groups) && groups.length) setSkillGroups(groups as SkillGroup[]);
          toolkitReady = true;
          finish();
        },
        () => { toolkitReady = true; finish(); },
      );
    });

    return () => {
      active = false;
      stopProfile?.();
      stopProjects?.();
      stopToolkit?.();
    };
  }, []);

  return { profile, projects, allProjects, skillGroups, loading, configured: firebaseConfigured, hasRemoteProjects };
}

export async function saveProfile(profile: PortfolioProfile) {
  const services = await getFirebaseServices();
  if (!services) throw new Error("Firebase is not configured.");
  await services.firestore.setDoc(
    services.firestore.doc(services.db, "portfolio", "profile"),
    withoutUndefined(profile),
  );
}

export async function saveProject(project: Project) {
  const services = await getFirebaseServices();
  if (!services) throw new Error("Firebase is not configured.");
  await services.firestore.setDoc(
    services.firestore.doc(services.db, "projects", project.id),
    withoutUndefined(project),
  );
  await addTechnologiesToToolkit(project.technologies);
}

export async function saveToolkit(groups: SkillGroup[]) {
  const services = await getFirebaseServices();
  if (!services) throw new Error("Firebase is not configured.");
  const cleaned = groups
    .map((group) => ({
      title: group.title.trim(),
      skills: group.skills.map((skill) => skill.trim()).filter(Boolean),
    }))
    .filter((group) => group.title && group.skills.length);
  await services.firestore.setDoc(
    services.firestore.doc(services.db, "portfolio", "toolkit"),
    { groups: cleaned },
  );
}

async function addTechnologiesToToolkit(technologies: string[]) {
  if (!technologies.length) return;
  const services = await getFirebaseServices();
  if (!services) throw new Error("Firebase is not configured.");
  const toolkitRef = services.firestore.doc(services.db, "portfolio", "toolkit");
  await services.firestore.runTransaction(services.db, async (transaction) => {
    const snapshot = await transaction.get(toolkitRef);
    const groups = (snapshot.data()?.groups as SkillGroup[] | undefined) ?? defaultSkillGroups;
    const known = new Set(groups.flatMap((group) => group.skills).map((skill) => skill.toLocaleLowerCase()));
    const additions = technologies.filter((technology) => !known.has(technology.toLocaleLowerCase()));
    if (!snapshot.exists() || additions.length) {
      const next = groups.map((group) => ({ ...group, skills: [...group.skills] }));
      if (additions.length) {
        const projectStack = next.find((group) => group.title === "Project stack");
        if (projectStack) projectStack.skills.push(...additions);
        else next.push({ title: "Project stack", skills: additions });
      }
      transaction.set(toolkitRef, { groups: next });
    }
  });
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
  batch.set(firestore.doc(db, "portfolio", "profile"), withoutUndefined(defaultProfile));
  const projectTechnologies = defaultProjects.flatMap((project) => project.technologies);
  const knownSkills = new Set(defaultSkillGroups.flatMap((group) => group.skills).map((skill) => skill.toLocaleLowerCase()));
  const projectStack = [...new Set(projectTechnologies.filter((skill) => !knownSkills.has(skill.toLocaleLowerCase())))];
  batch.set(firestore.doc(db, "portfolio", "toolkit"), {
    groups: projectStack.length ? [...defaultSkillGroups, { title: "Project stack", skills: projectStack }] : defaultSkillGroups,
  });
  defaultProjects.forEach((project, index) => batch.set(
    firestore.doc(db, "projects", project.id),
    withoutUndefined({ ...project, order: index, published: true }),
  ));
  await batch.commit();
}
