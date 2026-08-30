import { apiFetch, mockDelay, USE_MOCK } from "./client";

export type QuotaBreakdownItem = {
  label: string;
  count: number;
  tone: "primary" | "blue" | "amber" | "success";
};

export type QuotaPack = {
  name: string;
  price: string;
  detail: string;
  highlight?: boolean;
};

export type QuotaSummary = {
  included: number;
  used: number;
  deliveredCount: number;
  scheduledNext7Days: number;
  breakdown: QuotaBreakdownItem[];
  packs: QuotaPack[];
};

// En attente du système de comptage/blocage de Bilal (26–28/08).
const mockSummary: QuotaSummary = {
  included: 500,
  used: 132,
  deliveredCount: 129,
  scheduledNext7Days: 14,
  breakdown: [
    { label: "Rappels la veille (18:00)", count: 54, tone: "primary" },
    { label: "Rappels du jour J (08:00)", count: 51, tone: "blue" },
    { label: "Rappels imminents (15 min avant)", count: 24, tone: "amber" },
    { label: "Confirmations reçues", count: 3, tone: "success" },
  ],
  packs: [
    { name: "Pack 250 messages", price: "15 000 FCFA", detail: "Idéal pour un mois chargé" },
    { name: "Pack 500 messages", price: "27 000 FCFA", detail: "Le plus utilisé", highlight: true },
    { name: "Pack 1 000 messages", price: "48 000 FCFA", detail: "Pour plusieurs DG" },
  ],
};

export async function getQuotaSummary(): Promise<QuotaSummary> {
  if (USE_MOCK) {
    await mockDelay();
    return mockSummary;
  }
  return apiFetch<QuotaSummary>("/api/quota");
}