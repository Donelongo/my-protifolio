export type ProjectCategory = "Web" | "Mobile" | "GIS" | "Team";

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  role: string;
  challenge: string;
  solution: string;
  technologies: string[];
  liveUrl?: string;
  googlePlayUrl?: string;
  appStoreUrl?: string;
  collaboration?: string;
  visualTone: "emerald" | "blue" | "orange" | "cyan" | "violet";
  icon: "music" | "mobile" | "mechanical" | "map" | "team";
};

export const projects: Project[] = [
  {
    id: "catholic-mezmur",
    title: "Catholic Mezmur",
    category: "Web",
    description:
      "A digital platform providing Ethiopian Catholic hymns through an organized, searchable, and responsive experience.",
    role: "Web development",
    challenge:
      "Make a growing hymn collection easy to discover and comfortable to use across devices.",
    solution:
      "A clear information structure, responsive interface, focused search, and performance-conscious presentation.",
    technologies: ["Responsive Design", "Search", "Performance", "Clean UI"],
    liveUrl: "https://catholicmezmur.cushtech.co/",
    visualTone: "violet",
    icon: "music",
  },
  {
    id: "catholic-mezmur-mobile",
    title: "Catholic Mezmur Mobile",
    category: "Mobile",
    description:
      "A cross-platform mobile application extending the Catholic Mezmur experience to Android users.",
    role: "Mobile app development",
    challenge:
      "Carry the core Mezmur experience into a focused mobile format for Android users.",
    solution:
      "A Flutter-based cross-platform application designed around simple navigation and dependable access.",
    technologies: ["Flutter", "Android", "Cross-platform"],
    googlePlayUrl:
      "https://play.google.com/store/search?q=catholic+mezmur+app&c=apps&hl=en",
    visualTone: "blue",
    icon: "mobile",
  },
  {
    id: "ore-mechanical",
    title: "Ore Mechanical Engineering",
    category: "Web",
    description:
      "A professional corporate website with a clean responsive interface focused on engineering services and company information.",
    role: "Web development",
    challenge:
      "Present technical engineering services in a way that feels clear, credible, and approachable.",
    solution:
      "A responsive company website with direct navigation, structured service content, and confident visual hierarchy.",
    technologies: ["Responsive Web", "Corporate Website", "Firebase Hosting"],
    liveUrl: "https://ore-mechanical-enegineering.web.app/",
    visualTone: "orange",
    icon: "mechanical",
  },
  {
    id: "agro-climate",
    title: "Agro Climate Advisory System",
    category: "GIS",
    description:
      "A GIS platform supporting agricultural decision-making through interactive climate visualization and mapping technologies.",
    role: "Software Engineering Intern · ILRI",
    challenge:
      "Translate complex climate and geospatial data into understandable, decision-supporting map experiences.",
    solution:
      "Interactive risk and suitability maps, climate-data visualization, and responsive GIS interfaces.",
    technologies: [
      "React",
      "GeoNode",
      "GeoServer",
      "PostGIS",
      "Django",
      "Leaflet",
      "GeoTIFF",
    ],
    visualTone: "cyan",
    icon: "map",
  },
  {
    id: "dentrace",
    title: "Dentrace",
    category: "Team",
    description:
      "Currently contributing as part of the engineering team developing and improving a modern software platform.",
    role: "Software Engineer · Engineering team",
    challenge:
      "Contribute dependable product improvements within an active collaborative engineering environment.",
    solution:
      "Support feature development, refinement, and shared delivery as a contributing member of the team.",
    technologies: ["Team Engineering", "Product Development", "Collaboration"],
    liveUrl: "https://www.dentrace.io/",
    collaboration: "Collaborative work · Engineering team contribution",
    visualTone: "emerald",
    icon: "team",
  },
];

export const experience = [
  {
    status: "Current",
    company: "Dentrace",
    role: "Software Engineer",
    description:
      "Currently contributing as part of the engineering team building and improving modern software solutions.",
    highlights: ["Collaborative delivery", "Product development", "Engineering teamwork"],
  },
  {
    status: "Internship",
    company: "ILRI",
    role: "Software Engineering Intern",
    description:
      "Worked on the Agro Climate Advisory System, contributing responsive frontend development and interactive geospatial experiences.",
    highlights: [
      "Interactive GIS maps",
      "Risk and suitability maps",
      "Climate data visualization",
      "Responsive frontend development",
    ],
  },
  {
    status: "Previous",
    company: "Software project support",
    role: "Assistant Web Developer · Data Encoder",
    description:
      "Supported software projects, web development tasks, and accurate data-entry workflows.",
    highlights: ["Web development support", "Project support", "Data accuracy"],
  },
];

export const skillGroups = [
  {
    title: "Frontend",
    skills: [
      "React",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "TailwindCSS",
      "Bootstrap",
      "Responsive Design",
    ],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express", "Django", "REST APIs"],
  },
  {
    title: "Databases",
    skills: ["PostgreSQL", "PostGIS", "MySQL", "Firebase"],
  },
  {
    title: "GIS",
    skills: ["GeoServer", "GeoNode", "Leaflet", "OpenLayers", "GeoTIFF"],
  },
  {
    title: "Mobile",
    skills: ["Flutter"],
  },
  {
    title: "Tools",
    skills: ["Git", "GitHub", "Docker", "VS Code", "Figma"],
  },
];

export const socialLinks = {
  github: "http://github.com/donelongo/",
  linkedin: "https://www.linkedin.com/in/dagmawi-elias-lewi-842699242/",
};

export const contactDetails = {
  email: "dagmawieliaswork@gmail.com",
  phone: "+251911110650",
};
