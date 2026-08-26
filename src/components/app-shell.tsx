import { Link, useLocation } from "@tanstack/react-router";
import {
  Bell,
  Gauge,
  LayoutDashboard,
  Menu,
  MessageCircleMore,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Rendez-vous", icon: LayoutDashboard },
  { to: "/messages", label: "Messages", icon: MessageCircleMore },
  { to: "/equipe", label: "Équipe", icon: Users },
  { to: "/quota", label: "Quota", icon: Gauge },
] as const;


export function AppShell({
  breadcrumb,
  actions,
  children,
}: {
  breadcrumb: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-24 items-center justify-between px-7">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-brand">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold leading-none">Klébé</p>
              <p className="mt-1 text-[10px] font-semibold uppercase text-sidebar-muted">Plan Pro</p>
            </div>
          </Link>
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
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase text-sidebar-muted">
            Espace de travail
          </p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
                >
                  <Icon className={`size-[18px] ${active ? "text-sidebar-primary" : ""}`} />
                  {item.label}
                </Link>
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
          <Link
            to="/quota"
            className="mt-4 inline-block text-xs font-semibold text-sidebar-primary transition-opacity hover:opacity-80"
          >
            Gérer mon forfait →
          </Link>
        </div>

        <div className="flex items-center gap-3 border-t border-sidebar-border p-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-avatar text-sm font-semibold text-avatar-foreground">
            JS
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Josephine Senou</p>
            <p className="truncate text-xs text-sidebar-muted">Assistante de direction</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-muted hover:bg-sidebar-accent"
            aria-label="Paramètres"
          >
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
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu />
            </Button>
            <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
              <span>Direction générale</span>
              <span>·</span>
              <span className="font-medium text-foreground">{breadcrumb}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell />
              <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-background bg-notification" />
            </Button>
            {actions}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
