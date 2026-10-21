import { notFound } from "next/navigation";
import { signup } from "@/app/auth/actions";
import { AuthForm } from "@/components/auth-form";
import { isLocale } from "@/i18n/config";

export default async function SignupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <AuthForm mode="signup" locale={locale} action={signup} />;
}
