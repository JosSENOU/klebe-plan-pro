import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check, Clock3, Mail, MessageCircleMore } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Rappels WhatsApp | Klébé Plan Pro" },
      {
        name: "description",
        content:
          "Contrôlez la séquence de rappels WhatsApp envoyés avant chaque rendez-vous du DG.",
      },
      { property: "og:title", content: "Rappels WhatsApp | Klébé Plan Pro" },
      {
        property: "og:description",
        content: "Trois rappels automatiques programmés pour chaque rendez-vous.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MessagesPage,
});

const messageTemplates = [
  {
    title: "Rappel — veille du rendez-vous",
    timing: "Envoyé la veille à 18:00",
    preview: "Bonsoir, rappel de votre rendez-vous prévu demain…",
    status: "Actif",
  },
  {
    title: "Rappel — matin du rendez-vous",
    timing: "Envoyé le jour J à 08:00",
    preview: "Bonjour, vous avez un rendez-vous aujourd’hui…",
    status: "Actif",
  },
  {
    title: "Rappel — imminent",
    timing: "Envoyé 15 minutes avant",
    preview: "Votre rendez-vous commence dans 15 minutes…",
    status: "Actif",
  },
];

function MessagesPage() {
  return (
    <AppShell breadcrumb="Messages">
      <div className="mx-auto max-w-[1480px] px-5 py-8 md:px-8 lg:px-12 lg:py-10">
        <section className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase text-primary">WhatsApp</p>
          <h1 className="font-display text-3xl font-semibold md:text-4xl">Messages</h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Contrôlez les rappels automatiques envoyés au DG.
          </p>
        </section>

        <section className="mb-6 grid gap-3 sm:grid-cols-3">
          <MetricCard
            label="Envoyés ce mois"
            value="132"
            detail="Sur 500 messages inclus"
            icon={MessageCircleMore}
            tone="success"
          />
          <MetricCard
            label="Livrés"
            value="129"
            detail="Taux de livraison de 97,7%"
            icon={Check}
            tone="primary"
          />
          <MetricCard
            label="En attente"
            value="03"
            detail="Pour les prochains rendez-vous"
            icon={Clock3}
            tone="amber"
          />
        </section>

        <section className="overflow-hidden rounded-lg border border-border bg-card shadow-surface">
          <div className="border-b border-border p-5 md:p-6">
            <h2 className="font-display text-xl font-semibold">Séquence de rappels</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Les trois messages programmés pour chaque rendez-vous.
            </p>
          </div>
          <div className="divide-y divide-border">
            {messageTemplates.map((message, index) => (
              <article
                key={message.title}
                className="grid gap-4 px-5 py-5 md:grid-cols-[auto_1fr_auto] md:items-center md:px-6"
              >
                <div className="grid size-11 place-items-center rounded-md bg-success-soft text-success-foreground">
                  {index === 2 ? <Bell className="size-5" /> : <Mail className="size-5" />}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold">{message.title}</h3>
                    <span className="rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-semibold text-success-foreground">
                      {message.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">{message.timing}</p>
                  <p className="mt-2 text-sm text-foreground">{message.preview}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.alert(`Modification de « ${message.title} »`)}
                >
                  Modifier
                </Button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
