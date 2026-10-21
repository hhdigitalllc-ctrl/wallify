export default function Loading() {
  return (
    <main className="animate-pulse" aria-busy="true">
      <div className="h-10 w-56 rounded-xl bg-line" />
      <div className="mt-3 h-4 w-80 max-w-full rounded bg-line" />
      <div className="mt-8 h-32 rounded-2xl bg-line/70" />
      <div className="mt-6 h-24 rounded-2xl bg-line/70" />
      <div className="mt-6 h-44 rounded-2xl bg-line/70" />
    </main>
  );
}
