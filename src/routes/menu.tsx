import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/menu")({
  component: MenuPage,
  head: () => ({
    meta: [
      { title: "Menu — Tomoko's Toronto" },
      { name: "description", content: "Full menu coming soon." },
    ],
  }),
});

function MenuPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="mb-6 text-[0.65rem] uppercase tracking-[0.45em] text-amber-glow">
        Coming soon
      </p>
      <h1 className="font-display text-5xl font-light text-cream md:text-7xl">
        Full Menu
      </h1>
      <p className="mt-6 max-w-md text-cream/70">
        Our full menu will arrive closer to opening. In the meantime, explore featured dishes on the home page.
      </p>
      <Link
        to="/"
        className="mt-10 border border-amber-glow/60 px-6 py-3 text-[0.65rem] uppercase tracking-[0.3em] text-amber-glow transition hover:bg-amber-glow hover:text-charcoal"
      >
        ← Back home
      </Link>
    </main>
  );
}
