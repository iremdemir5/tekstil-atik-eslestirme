/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginErrors = Partial<Record<"email" | "password" | "form", string>>;

function isValidEmail(email: string) {
  // Basit client-side doğrulama (backend kesin doğrulama yapmalı)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </React.Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/upload";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const [errors, setErrors] = React.useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validate = (): boolean => {
    const nextErrors: LoginErrors = {};
    if (!isValidEmail(email)) nextErrors.email = "Geçerli bir e-posta girin.";
    if (password.trim().length < 8)
      nextErrors.password = "Şifre en az 8 karakter olmalıdır.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    // Backend auth henüz bağlı değil: frontend deneyimi için kısa simülasyon
    await new Promise((r) => setTimeout(r, 900));

    // MVP auth: demo oturum bayrağı (gerçek auth entegrasyonu gelince kaldırılacak)
    try {
      window.localStorage?.setItem("tae_demo_authed", "1");
    } catch {
      // localStorage kapalı olabilir; sessizce devam
    }

    router.push(redirect);
  };

  return (
    <div className="relative mx-auto max-w-6xl px-4 pb-12">
      <div className="absolute inset-0 -z-10">
        <div className="heroGradient h-full w-full" />
        <div className="heroTexture h-full w-full" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/50 bg-white/35 p-6 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/15">
                <ShieldCheck className="h-6 w-6 text-emerald-700" />
              </span>
              <div>
                <h2 className="text-lg font-semibold">Hoş geldiniz</h2>
                <p className="mt-1 text-sm text-foreground/70">
                  E-posta ve şifrenizle giriş yaparak analiz ve eşleşmelere
                  devam edin.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />
                <div>
                  <div className="font-medium">Güvenli oturum</div>
                  <div className="text-foreground/70">
                    PRD’ye göre Supabase Auth ile session yönetilecek.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
                <div>
                  <div className="font-medium">Rol bazlı yönlendirme</div>
                  <div className="text-foreground/70">
                    Producer / buyer / admin akışı middleware ile yönetilecek.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/50 bg-white/25 p-6 shadow-sm backdrop-blur-md">
            <div className="text-sm font-medium">Hesabınız yok mu?</div>
            <p className="mt-1 text-sm text-foreground/70">
              Ücretsiz kayıt olun, üretici ya da alıcı ihtiyaç profilinizi
              oluşturun.
            </p>
            <div className="mt-4">
              <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Kayıt Ol
              </Link>
            </div>
          </div>
        </aside>

        <main className="space-y-4">
          <Card className="rounded-3xl border-white/50 bg-white/40 backdrop-blur-md shadow-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl">Giriş Yap</CardTitle>
              <CardDescription>
                Giriş yaptıktan sonra otomatik olarak doğru sayfaya
                yönlendirilirsiniz.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="ornek@firma.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    className="h-11 rounded-xl bg-white/60"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Şifre</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-invalid={!!errors.password}
                      className="h-11 rounded-xl bg-white/60 pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-9 w-9 rounded-xl p-0"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                {errors.form && (
                  <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                    {errors.form}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl bg-emerald-600 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Giriş Yapılıyor...
                    </>
                  ) : (
                    "Giriş Yap"
                  )}
                </Button>

                <div className="flex flex-col gap-2 text-sm text-foreground/70 sm:flex-row sm:items-center sm:justify-between">
                  <Link href="/register" className="hover:text-foreground">
                    Kayıt Ol
                  </Link>
                  <a
                    href="#"
                    className="hover:text-foreground"
                    onClick={(ev) => ev.preventDefault()}
                    aria-disabled
                  >
                    Şifremi unuttum
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="rounded-3xl border border-white/50 bg-white/25 p-5 text-sm text-foreground/70 backdrop-blur-md">
            Not: Bu aşamada auth submit’i backend’e bağlı değil. Butona basınca
            (geçerli form varsa) ilgili sayfaya yönlendirilirsiniz.
          </div>
        </main>
      </div>
    </div>
  );
}

function LoginPageFallback() {
  return (
    <div className="relative mx-auto max-w-6xl px-4 pb-12">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
        <main className="space-y-4 lg:col-start-2">
          <Card className="rounded-3xl border-white/50 bg-white/40 shadow-sm backdrop-blur-md">
            <CardContent className="flex min-h-64 items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sayfa yukleniyor...
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

