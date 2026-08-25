import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Mail,
  LayoutDashboard,
  MapPin,
  Menu,
  MessageCircleMore,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord | Klébé Plan Pro" },
      {
        name: "description",
        content: "Pilotez les rendez-vous de votre direction et les rappels WhatsApp depuis Klébé Plan Pro.",
      },
      { property: "og:title", content: "Tableau de bord | Klébé Plan Pro" },
      {
        property: "og:description",
        content: "Agenda, statuts et rappels WhatsApp réunis dans un tableau de bord clair.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

type AppointmentStatus = "À venir" | "Confirmé" | "En attente" | "Terminé";

type Appointment = {
  id: number;
  title: string;
  contact: string;
  initials: string;
  dateLabel: string;
  dateGroup: "Aujourd’hui" | "Demain" | "Cette semaine";
  time: string;
  location: string;
  status: AppointmentStatus;
  reminder: string;
  tone: "emerald" | "amber" | "coral" | "blue";
};

const initialAppointments: Appointment[] = [
  {
    id: 1,
    title: "Conseil d’administration",
    contact: "Groupe Novia",
    initials: "GN",
    dateLabel: "Aujourd’hui",
    dateGroup: "Aujourd’hui",
    time: "09:30 — 10:30",
    location: "Salle Horizon, Siège",
    status: "Confirmé",
    reminder: "Dernier rappel envoyé à 08:00",
    tone: "emerald",
  },
  {
    id: 2,
    title: "Point partenariat stratégique",
    contact: "Aïcha Mensah · AfriCapital",
    initials: "AM",
    dateLabel: "Aujourd’hui",
    dateGroup: "Aujourd’hui",
    time: "14:00 — 15:00",
    location: "Visioconférence",
    status: "À venir",
    reminder: "Prochain rappel dans 1 h 45",
    tone: "coral",
  },
  {
    id: 3,
    title: "Déjeuner avec les investisseurs",
    contact: "Koffi Adandé · Hélios Partners",
    initials: "KA",
    dateLabel: "Demain · 26 août",
    dateGroup: "Demain",
    time: "12:30 — 14:00",
    location: "Restaurant Le Toit, Cotonou",
    status: "En attente",
    reminder: "Rappel prévu aujourd’hui à 18:00",
    tone: "amber",
  },
  {
    id: 4,
    title: "Revue des objectifs trimestriels",
    contact: "Comité de direction",
    initials: "CD",
    dateLabel: "Jeudi · 27 août",
    dateGroup: "Cette semaine",
    time: "10:00 — 11:30",
    location: "Salle Baobab",
    status: "À venir",
    reminder: "Premier rappel demain à 18:00",
    tone: "blue",
  },
];

const navItems = [
  { id: "overview", label: "Vue d’ensemble", icon: LayoutDashboard },
  { id: "appointments", label: "Rendez-vous", icon: CalendarDays },
  { id: "team", label: "Équipe", icon: Users },
  { id: "messages", label: "Messages", icon: MessageCircleMore },
];

type DashboardView = (typeof navItems)[number]["id"];

function Dashboard() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeView, setActiveView] = useState<DashboardView>("overview");

  const visibleAppointments = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr");
    return appointments.filter((appointment) => {
      const matchesQuery =
        !normalizedQuery ||
        `${appointment.title} ${appointment.contact} ${appointment.location}`
          .toLocaleLowerCase("fr")
          .includes(normalizedQuery);
      const matchesFilter = activeFilter === "Tous" || appointment.status === activeFilter;
      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, appointments, query]);

  const completeAppointment = (id: number) => {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id ? { ...appointment, status: "Terminé" } : appointment,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-24 items-center justify-between px-7">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-brand">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold leading-none">Klébé</p>
              <p className="mt-1 text-[10px] font-semibold uppercase text-sidebar-muted">Plan Pro</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Fermer le menu"
          >
            <X />
          </Button>
        </div>

        <nav className="flex-1 px-4 pt-8" aria-label="Navigation principale">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase text-sidebar-muted">Espace de travail</p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setActiveView(item.id);
                    setMobileNavOpen(false);
                  }}
                  className={`group flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors ${activeView === item.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
                >
                  <Icon className={`size-[18px] ${activeView === item.id ? "text-sidebar-primary" : ""}`} />
                  {item.label}
                  {item.label === "Messages" && (
                    <span className="ml-auto rounded-full bg-sidebar-primary px-2 py-0.5 text-[10px] font-bold text-sidebar-primary-foreground">
                      3
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="mx-4 mb-4 rounded-lg border border-sidebar-border bg-sidebar-panel p-4">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="text-sidebar-muted">Messages restants</span>
            <span className="font-semibold">368 / 500</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-sidebar-border">
            <div className="h-full w-[74%] rounded-full bg-sidebar-primary" />
          </div>
          <button className="mt-4 text-xs font-semibold text-sidebar-primary transition-opacity hover:opacity-80">
            Gérer mon forfait →
          </button>
        </div>

        <div className="flex items-center gap-3 border-t border-sidebar-border p-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-avatar text-sm font-semibold text-avatar-foreground">
            JS
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Josephine Senou</p>
            <p className="truncate text-xs text-sidebar-muted">Assistante de direction</p>
          </div>
          <Button variant="ghost" size="icon" className="text-sidebar-muted hover:bg-sidebar-accent" aria-label="Paramètres">
            <Settings />
          </Button>
        </div>
      </aside>

      {mobileNavOpen && (
        <button
          className="fixed inset-0 z-30 bg-overlay lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Fermer la navigation"
        />
      )}

      <main className="lg:pl-64">
        <header className="flex h-20 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur md:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Ouvrir le menu">
              <Menu />
            </Button>
            <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
              <span>Direction générale</span>
              <span>·</span>
              <span className="font-medium text-foreground">
                {navItems.find((item) => item.id === activeView)?.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell />
              <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-background bg-notification" />
            </Button>
            <Button className="h-10 shadow-brand" onClick={() => window.alert("Le formulaire de création sera intégré par Shalom.")}>
              <Plus />
              <span className="hidden sm:inline">Nouveau rendez-vous</span>
              <span className="sm:hidden">Ajouter</span>
            </Button>
          </div>
        </header>

        {activeView === "team" ? (
          <TeamView />
        ) : activeView === "messages" ? (
          <MessagesView />
        ) : (
        <div className="mx-auto max-w-[1480px] px-5 py-8 md:px-8 lg:px-12 lg:py-10">
          <section className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-primary">
                <span className="size-1.5 rounded-full bg-primary" />
                Mardi 25 août 2026
              </p>
              <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">Bonjour Josephine.</h1>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Voici ce qui mérite votre attention aujourd’hui.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-success-border bg-success-soft px-3 py-2 text-xs font-medium text-success-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-50" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              Rappels WhatsApp opérationnels
            </div>
          </section>

          <section className="mb-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Résumé des rendez-vous">
            <MetricCard label="Aujourd’hui" value="02" detail="Prochain à 09:30" icon={CalendarDays} tone="primary" />
            <MetricCard label="À venir" value="08" detail="Sur les 7 prochains jours" icon={Clock3} tone="blue" />
            <MetricCard label="Confirmés" value="06" detail="75% de confirmation" icon={Check} tone="success" />
            <MetricCard label="À confirmer" value="02" detail="Une relance programmée" icon={Bell} tone="amber" />
          </section>

          <section id="rendez-vous" className="overflow-hidden rounded-lg border border-border bg-card shadow-surface">
            <div className="border-b border-border p-5 md:p-6">
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div>
                  <h2 className="font-display text-xl font-semibold text-card-foreground">Rendez-vous</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Suivez les prochains temps forts du DG.</p>
                </div>
                <div className="relative w-full lg:w-72">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Rechercher un rendez-vous"
                    className="h-10 bg-muted/50 pl-9 shadow-none"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-1 overflow-x-auto" role="tablist" aria-label="Filtrer les rendez-vous">
                {["Tous", "À venir", "Confirmé", "En attente", "Terminé"].map((filter) => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveFilter(filter)}
                    className={activeFilter === filter ? "text-foreground" : "text-muted-foreground"}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-border">
              {visibleAppointments.length > 0 ? (
                visibleAppointments.map((appointment) => (
                  <AppointmentRow key={appointment.id} appointment={appointment} onComplete={completeAppointment} />
                ))
              ) : (
                <div className="py-16 text-center">
                  <Search className="mx-auto mb-3 size-6 text-muted-foreground" />
                  <p className="font-medium">Aucun rendez-vous trouvé</p>
                  <p className="mt-1 text-sm text-muted-foreground">Modifiez votre recherche ou le filtre sélectionné.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border bg-muted/30 px-5 py-4 text-xs text-muted-foreground md:px-6">
              <span>{visibleAppointments.length} rendez-vous affichés</span>
              <button className="flex items-center gap-1 font-semibold text-foreground hover:text-primary">
                Voir l’agenda complet <ChevronDown className="size-3.5 -rotate-90" />
              </button>
            </div>
          </section>
        </div>
        )}
      </main>
    </div>
  );
}

const teamMembers = [
  { name: "Josephine Senou", role: "Lead front-end", initials: "JS", access: "Administratrice", tone: "emerald" },
  { name: "Shalom Ahouandjinou", role: "Formulaire RDV", initials: "SA", access: "Éditrice", tone: "blue" },
  { name: "Keira Dossou", role: "Connexion, équipe & quota", initials: "KD", access: "Éditrice", tone: "amber" },
];

function TeamView() {
  return (
    <div className="mx-auto max-w-[1480px] px-5 py-8 md:px-8 lg:px-12 lg:py-10">
      <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-primary">Administration</p>
          <h1 className="font-display text-3xl font-semibold md:text-4xl">Équipe</h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">Gérez les assistantes et leurs niveaux d’accès.</p>
        </div>
        <Button onClick={() => window.alert("L’invitation d’une assistante sera reliée à l’API équipe.")}>
          <Plus /> Inviter une assistante
        </Button>
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-surface">
        <div className="flex items-center justify-between border-b border-border p-5 md:p-6">
          <div>
            <h2 className="font-display text-xl font-semibold">Membres actifs</h2>
            <p className="mt-1 text-sm text-muted-foreground">3 membres disposent actuellement d’un accès.</p>
          </div>
          <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success-foreground">3 / 5 places</span>
        </div>
        <div className="divide-y divide-border">
          {teamMembers.map((member) => (
            <article key={member.name} className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center md:px-6">
              <div className={`avatar avatar-${member.tone}`}>{member.initials}</div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold">{member.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{member.role}</p>
              </div>
              <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{member.access}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={`Gérer ${member.name}`}><MoreHorizontal /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Modifier l’accès</DropdownMenuItem>
                  <DropdownMenuItem>Retirer de l’équipe</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

const messageTemplates = [
  { title: "Rappel — veille du rendez-vous", timing: "Envoyé la veille à 18:00", preview: "Bonsoir, rappel de votre rendez-vous prévu demain…", status: "Actif" },
  { title: "Rappel — matin du rendez-vous", timing: "Envoyé le jour J à 08:00", preview: "Bonjour, vous avez un rendez-vous aujourd’hui…", status: "Actif" },
  { title: "Rappel — imminent", timing: "Envoyé 15 minutes avant", preview: "Votre rendez-vous commence dans 15 minutes…", status: "Actif" },
];

function MessagesView() {
  return (
    <div className="mx-auto max-w-[1480px] px-5 py-8 md:px-8 lg:px-12 lg:py-10">
      <section className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase text-primary">WhatsApp</p>
        <h1 className="font-display text-3xl font-semibold md:text-4xl">Messages</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">Contrôlez les rappels automatiques envoyés au DG.</p>
      </section>

      <section className="mb-6 grid gap-3 sm:grid-cols-3">
        <MetricCard label="Envoyés ce mois" value="132" detail="Sur 500 messages inclus" icon={MessageCircleMore} tone="success" />
        <MetricCard label="Livrés" value="129" detail="Taux de livraison de 97,7%" icon={Check} tone="primary" />
        <MetricCard label="En attente" value="03" detail="Pour les prochains rendez-vous" icon={Clock3} tone="amber" />
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-surface">
        <div className="border-b border-border p-5 md:p-6">
          <h2 className="font-display text-xl font-semibold">Séquence de rappels</h2>
          <p className="mt-1 text-sm text-muted-foreground">Les trois messages programmés pour chaque rendez-vous.</p>
        </div>
        <div className="divide-y divide-border">
          {messageTemplates.map((message, index) => (
            <article key={message.title} className="grid gap-4 px-5 py-5 md:grid-cols-[auto_1fr_auto] md:items-center md:px-6">
              <div className="grid size-11 place-items-center rounded-md bg-success-soft text-success-foreground">
                {index === 2 ? <Bell className="size-5" /> : <Mail className="size-5" />}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold">{message.title}</h3>
                  <span className="rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-semibold text-success-foreground">{message.status}</span>
                </div>
                <p className="mt-1 text-xs font-medium text-muted-foreground">{message.timing}</p>
                <p className="mt-2 text-sm text-foreground">{message.preview}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.alert(`Modification de « ${message.title} »`)}>Modifier</Button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof CalendarDays;
  tone: "primary" | "blue" | "success" | "amber";
}) {
  return (
    <article className="group rounded-lg border border-border bg-card p-5 shadow-surface transition-transform duration-200 hover:-translate-y-0.5">
      <div className="mb-5 flex items-start justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={`metric-icon metric-icon-${tone}`}>
          <Icon className="size-[18px]" />
        </span>
      </div>
      <p className="font-display text-3xl font-semibold text-card-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </article>
  );
}

function AppointmentRow({ appointment, onComplete }: { appointment: Appointment; onComplete: (id: number) => void }) {
  return (
    <article className="grid gap-4 px-5 py-5 transition-colors hover:bg-muted/25 md:px-6 xl:grid-cols-[minmax(250px,1.35fr)_minmax(190px,.8fr)_minmax(160px,.7fr)_minmax(175px,.8fr)_auto] xl:items-center">
      <div className="flex min-w-0 items-center gap-4">
        <div className={`avatar avatar-${appointment.tone}`}>{appointment.initials}</div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-card-foreground">{appointment.title}</h3>
          <p className="mt-1 truncate text-xs text-muted-foreground">{appointment.contact}</p>
        </div>
      </div>
      <div className="flex items-start gap-2.5 text-sm">
        <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div>
          <p className="font-medium">{appointment.dateLabel}</p>
          <p className="mt-1 text-xs text-muted-foreground">{appointment.time}</p>
        </div>
      </div>
      <div className="flex items-start gap-2.5 text-sm">
        <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <span className="text-muted-foreground">{appointment.location}</span>
      </div>
      <div>
        <StatusBadge status={appointment.status} />
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <MessageCircleMore className="size-3.5 text-success" />
          {appointment.reminder}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="justify-self-end" aria-label={`Actions pour ${appointment.title}`}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => window.alert(`Ouverture de « ${appointment.title} »`)}>Voir les détails</DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.alert("Modification déléguée au module formulaire.")}>Modifier</DropdownMenuItem>
          <DropdownMenuItem disabled={appointment.status === "Terminé"} onClick={() => onComplete(appointment.id)}>
            Marquer comme terminé
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </article>
  );
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const statusClass = {
    "À venir": "status-upcoming",
    Confirmé: "status-confirmed",
    "En attente": "status-pending",
    Terminé: "status-completed",
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}