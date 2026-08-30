import { apiFetch, mockDelay, USE_MOCK } from "./client";

export type Access = "Administratrice" | "Éditrice" | "Lecture seule";

export type Member = {
  id: number;
  name: string;
  email: string;
  role: string;
  initials: string;
  access: Access;
  tone: "emerald" | "amber" | "coral" | "blue";
};

export const SEAT_LIMIT = 5;

const tones = ["emerald", "amber", "coral", "blue"] as const;

// Store en mémoire tenant lieu de base de données tant que l'API équipe
// (Pinel, 26–28/08) n'existe pas. Réinitialisé à chaque rechargement.
let mockMembers: Member[] = [
  {
    id: 1,
    name: "Josephine Senou",
    email: "josephine@klebe.pro",
    role: "Assistante de direction",
    initials: "JS",
    access: "Administratrice",
    tone: "emerald",
  },
  {
    id: 2,
    name: "Shalom Ahouandjinou",
    email: "shalom@klebe.pro",
    role: "Assistante rendez-vous",
    initials: "SA",
    access: "Éditrice",
    tone: "blue",
  },
  {
    id: 3,
    name: "Keira Dossou",
    email: "keira@klebe.pro",
    role: "Assistante accès & quota",
    initials: "KD",
    access: "Éditrice",
    tone: "amber",
  },
];

function toInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("fr") ?? "")
    .join("");
}

export async function listMembers(): Promise<Member[]> {
  if (USE_MOCK) {
    await mockDelay();
    return [...mockMembers];
  }
  return apiFetch<Member[]>("/api/team");
}

export async function inviteMember(input: {
  name: string;
  email: string;
  access: Access;
}): Promise<Member> {
  if (input.name.trim().length < 3 || !input.email.includes("@")) {
    throw new Error("Renseignez un nom complet et une adresse e-mail valide.");
  }

  if (USE_MOCK) {
    await mockDelay();
    if (mockMembers.length >= SEAT_LIMIT) {
      throw new Error("Toutes les places de votre forfait sont occupées.");
    }
    const member: Member = {
      id: Date.now(),
      name: input.name.trim(),
      email: input.email.trim(),
      role: "Assistante",
      initials: toInitials(input.name),
      access: input.access,
      tone: tones[mockMembers.length % tones.length]!,
    };
    mockMembers = [...mockMembers, member];
    return member;
  }

  return apiFetch<Member>("/api/team", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function removeMember(id: number): Promise<void> {
  if (USE_MOCK) {
    await mockDelay();
    mockMembers = mockMembers.filter((member) => member.id !== id);
    return;
  }
  await apiFetch<void>(`/api/team/${id}`, { method: "DELETE" });
}

export async function updateMemberAccess(id: number, access: Access): Promise<void> {
  if (USE_MOCK) {
    await mockDelay();
    mockMembers = mockMembers.map((member) => (member.id === id ? { ...member, access } : member));
    return;
  }
  await apiFetch<void>(`/api/team/${id}/access`, {
    method: "PATCH",
    body: JSON.stringify({ access }),
  });
}