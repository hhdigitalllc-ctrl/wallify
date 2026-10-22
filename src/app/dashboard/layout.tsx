import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { asPlan } from "@/lib/billing";
import { createClient } from "@/lib/supabase/server";
import { dirOf } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocale } from "@/i18n/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const locale = await getLocale();
  if (!user) redirect(locale === "en" ? "/login" : `/${locale}/login`);
  const t = getDictionary(locale).dash;

  const [{ data: spaces }, { data: plan }] = await Promise.all([
    supabase.from("spaces").select("id, name").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.rpc("my_plan"),
  ]);

  return (
    <div
      lang={locale}
      dir={dirOf(locale)}
      className={`flex min-h-screen flex-col md:flex-row ${locale === "ar" ? "font-arabic" : ""}`}
    >
      <AppSidebar spaces={spaces ?? []} plan={asPlan(plan)} email={user.email ?? ""} locale={locale} t={t.nav} />
      <div className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-4xl px-5 py-8 md:px-10 md:py-12">{children}</div>
      </div>
    </div>
  );
}
