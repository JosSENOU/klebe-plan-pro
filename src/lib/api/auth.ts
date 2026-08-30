import { apiFetch, mockDelay, USE_MOCK } from "./client";

export type DemoAccount = {
  email: string;
  password: string;
  role: string;
};

// À retirer dès que POST /api/auth/login (Bilal) est disponible : ces
// comptes ne doivent jamais suivre le code jusqu'en production.
export const demoAccounts: DemoAccount[] = [
  { email: "josephine@klebe.pro", password: "klebe2026", role: "Administratrice" },
  { email: "shalom@klebe.pro", password: "klebe2026", role: "Éditrice" },
  { email: "keira@klebe.pro", password: "klebe2026", role: "Éditrice" },
];

export type LoginResult = {
  email: string;
  role: string;
};

export async function login(email: string, password: string): Promise<LoginResult> {
  const normalizedEmail = email.trim().toLowerCase();

  if (USE_MOCK) {
    await mockDelay();
    const account = demoAccounts.find(
      (item) => item.email === normalizedEmail && item.password === password,
    );
    if (!account) {
      throw new Error("Identifiants incorrects. Utilisez un compte de démonstration ci-dessous.");
    }
    return { email: account.email, role: account.role };
  }

  return apiFetch<LoginResult>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: normalizedEmail, password }),
  });
}