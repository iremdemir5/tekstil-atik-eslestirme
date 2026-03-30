/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Factory, Mail, ShieldCheck, Sparkles, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Role = "producer" | "buyer";

type RegisterErrors = Partial<Record<string, string>> & { form?: string };

const TAX_REGEX = /^\d{10,11}$/;
const PHONE_REGEX = /^(\+90|0)?[0-9]{10}$/;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function parseNumberOrNull(value: string): number | null {
  const n = Number(value);
  if (Number.isNaN(n)) return null;
  return n;
}

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = React.useState<Role>("producer");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [taxNumber, setTaxNumber] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [city, setCity] = React.useState("");
  const [district, setDistrict] = React.useState("");

  // Buyer özel
  const [factoryType, setFactoryType] = React.useState<"insulation" | "yarn_recycling" | "filling_material" | "other">("insulation");

  const [acceptedPolymers, setAcceptedPolymers] = React.useState<string[]>(["cotton"]);
  const [minCottonRatio, setMinCottonRatio] = React.useState("60");
  const [maxPolymerPurity, setMaxPolymerPurity] = React.useState("80");
  const [minQuantityKg, setMinQuantityKg] = React.useState("1000");
  const [maxQuantityKg, setMaxQuantityKg] = React.useState("5000");
  const [maxDistanceKm, setMaxDistanceKm] = React.useState("300");
  const [minRValue, setMinRValue] = React.useState("");

  const [consent, setConsent] = React.useState(false);

  const [errors, setErrors] = React.useState<RegisterErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const togglePolymer = (poly: string) => {
    setAcceptedPolymers((prev) => {
      if (prev.includes(poly)) return prev.filter((p) => p !== poly);
      return [...prev, poly];
    });
  };

  const validate = (): boolean => {
    const next: RegisterErrors = {};

    if (!isValidEmail(email)) next.email = "Geçerli bir e-posta girin.";
    if (password.trim().length < 8) next.password = "Şifre en az 8 karakter olmalıdır.";
    if (companyName.trim().length < 2) next.companyName = "Şirket adını girin (en az 2 karakter).";

    if (taxNumber.trim().length > 0 && !TAX_REGEX.test(taxNumber.trim())) {
      next.taxNumber = "Vergi numarası 10 veya 11 haneli olmalıdır.";
    }

    if (phone.trim().length > 0 && !PHONE_REGEX.test(phone.trim())) {
      next.phone = "Geçerli bir telefon numarası girin.";
    }

    if (!city.trim()) next.city = "Şehir seçin.";
    if (!district.trim()) next.district = "İlçe seçin.";

    if (!consent) next.consent = "Onay kutusunu işaretleyin.";

    if (role === "buyer") {
      if (acceptedPolymers.length < 1) next.acceptedPolymers = "En az 1 polimer seçin.";

      const minCotton = parseNumberOrNull(minCottonRatio);
      if (minCotton === null || minCotton < 0 || minCotton > 100) {
        next.minCottonRatio = "Pamuk oranı 0 ile 100 arasında olmalıdır.";
      }

      const maxPurity = parseNumberOrNull(maxPolymerPurity);
      if (maxPurity === null || maxPurity < 0 || maxPurity > 100) {
        next.maxPolymerPurity = "Saflık değeri 0 ile 100 arasında olmalıdır.";
      }

      const minQty = parseNumberOrNull(minQuantityKg);
      const maxQty = parseNumberOrNull(maxQuantityKg);
      if (minQty === null || minQty <= 0) next.minQuantityKg = "Min miktar 0'dan büyük olmalıdır.";
      if (maxQty === null || maxQty <= 0) next.maxQuantityKg = "Max miktar 0'dan büyük olmalıdır.";
      if (minQty !== null && maxQty !== null && maxQty < minQty) {
        next.maxQuantityKg = "Max miktar, Min miktardan küçük olamaz.";
      }

      const dist = parseNumberOrNull(maxDistanceKm);
      if (dist === null || dist < 10 || dist > 5000) {
        next.maxDistanceKm = "Maksimum mesafe 10-5000 km aralığında olmalıdır.";
      }

      if (minRValue.trim().length > 0) {
        const r = parseNumberOrNull(minRValue);
        if (r === null || r < 0) next.minRValue = "R değeri pozitif olmalıdır.";
      }
    }

    if (Object.keys(next).length > 0) {
      setErrors(next);
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

    // Backend auth henüz bağlı değil: frontend UX için simülasyon
    await new Promise((r) => setTimeout(r, 900));

    // PRD: e-posta doğrulama sonrası /upload'a yönlendirme.
    // Şimdilik kullanıcıyı giriş ekranına yönlendiriyoruz.
    router.push("/login?redirect=/upload");
  };

  return (
    <div className="relative mx-auto max-w-6xl px-4 pb-12">
      <div className="absolute inset-0 -z-10">
        <div className="heroGradient h-full w-full" />
        <div className="heroTexture h-full w-full" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
        <aside className="space-y-4">
          <Card className="rounded-3xl border-white/50 bg-white/35 shadow-sm backdrop-blur-md">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/15">
                  <Sparkles className="h-6 w-6 text-emerald-700" />
                </span>
                <div>
                  <CardTitle className="text-lg">Kayıt Ol</CardTitle>
                  <CardDescription>Üretici ya da alıcı profili oluşturun.</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 text-sm text-foreground/70">
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600/10">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                </span>
                <div>
                  <div className="font-medium text-foreground">Rol bazlı akış</div>
                  <div>Producer ve buyer için farklı onboarding adımları.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10">
                  <User className="h-4 w-4 text-amber-700" />
                </span>
                <div>
                  <div className="font-medium text-foreground">Şirket bilgileri</div>
                  <div>Şeffaf eşleşme için adres ve iletişim verileri.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10">
                  <Factory className="h-4 w-4 text-sky-700" />
                </span>
                <div>
                  <div className="font-medium text-foreground">Buyer ihtiyaç profili</div>
                  <div>Polimer ve lojistik gereksinimlerinizi tanımlayın.</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-3xl border border-white/50 bg-white/25 p-6 shadow-sm backdrop-blur-md">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/50">
                <Mail className="h-5 w-5 text-emerald-700" />
              </span>
              <div>
                <div className="font-medium">E-posta doğrulama</div>
                <div className="mt-1 text-sm text-foreground/70">
                  PRD’ye göre e-postanızı doğrulayınca doğru sayfaya
                  yönlendirilirsiniz.
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main>
          <Card className="rounded-3xl border-white/50 bg-white/40 shadow-sm backdrop-blur-md">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl">Kayıt Ol</CardTitle>
              <CardDescription>
                Hesabınızı oluşturarak analiz ve eşleşme akışını başlatın.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label>Rol</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className={`h-11 rounded-xl ${role === "producer" ? "bg-emerald-600 text-white border-emerald-600/20 hover:bg-emerald-700" : "bg-white/40 border-white/60 hover:bg-white/60"}`}
                      onClick={() => setRole("producer")}
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      Producer
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className={`h-11 rounded-xl ${role === "buyer" ? "bg-emerald-600 text-white border-emerald-600/20 hover:bg-emerald-700" : "bg-white/40 border-white/60 hover:bg-white/60"}`}
                      onClick={() => setRole("buyer")}
                    >
                      <Factory className="mr-2 h-4 w-4" />
                      Buyer
                    </Button>
                  </div>
                </div>

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
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Şifre</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="En az 8 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!errors.password}
                    className="h-11 rounded-xl bg-white/60"
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Şirket adı</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Örn: Tekstil A.Ş."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      aria-invalid={!!errors.companyName}
                      className="h-11 rounded-xl bg-white/60"
                    />
                    {errors.companyName && (
                      <p className="text-sm text-destructive">{errors.companyName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxNumber">Vergi no (opsiyonel)</Label>
                    <Input
                      id="taxNumber"
                      name="taxNumber"
                      placeholder="10 veya 11 hane"
                      value={taxNumber}
                      onChange={(e) => setTaxNumber(e.target.value)}
                      aria-invalid={!!errors.taxNumber}
                      className="h-11 rounded-xl bg-white/60"
                      inputMode="numeric"
                    />
                    {errors.taxNumber && <p className="text-sm text-destructive">{errors.taxNumber}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon (opsiyonel)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+90 5XX XXX XX XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    aria-invalid={!!errors.phone}
                    className="h-11 rounded-xl bg-white/60"
                    inputMode="tel"
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">Şehir</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Örn: İstanbul"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      aria-invalid={!!errors.city}
                      className="h-11 rounded-xl bg-white/60"
                    />
                    {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">İlçe</Label>
                    <Input
                      id="district"
                      name="district"
                      placeholder="Örn: Beylikdüzü"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      aria-invalid={!!errors.district}
                      className="h-11 rounded-xl bg-white/60"
                    />
                    {errors.district && (
                      <p className="text-sm text-destructive">{errors.district}</p>
                    )}
                  </div>
                </div>

                {role === "buyer" && (
                  <Accordion type="single" collapsible className="rounded-2xl border border-white/50 bg-white/20 px-4">
                    <AccordionItem value="requirements">
                      <AccordionTrigger className="py-3 text-sm font-semibold">
                        İhtiyaç profili (Buyer)
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Fabrika tipi</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                ["insulation", "Yalıtım Üreticisi"],
                                ["yarn_recycling", "İplik Geri Dönüşümü"],
                                ["filling_material", "Dolgu Malzemesi"],
                                ["other", "Diğer"],
                              ].map(([key, label]) => (
                                <Button
                                  key={key}
                                  type="button"
                                  variant="outline"
                                  className={`h-11 rounded-xl ${
                                    factoryType === key
                                      ? "bg-emerald-600 text-white border-emerald-600/20 hover:bg-emerald-700"
                                      : "bg-white/40 border-white/60 hover:bg-white/60"
                                  }`}
                                  onClick={() =>
                                    setFactoryType(
                                      key as "insulation" | "yarn_recycling" | "filling_material" | "other",
                                    )
                                  }
                                >
                                  {label}
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>İstenen polimerler</Label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                ["cotton", "Pamuk"],
                                ["polyester", "Polyester"],
                                ["nylon", "Naylon"],
                                ["acrylic", "Akrilik"],
                                ["other", "Karışık"],
                              ].map(([key, label]) => {
                                const selected = acceptedPolymers.includes(key);
                                return (
                                  <label
                                    key={key}
                                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                                      selected
                                        ? "border-emerald-600/30 bg-emerald-600/10 text-emerald-800"
                                        : "border-white/60 bg-white/30 text-foreground/70 hover:bg-white/40"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selected}
                                      onChange={() => togglePolymer(key)}
                                      className="h-4 w-4 accent-emerald-600"
                                    />
                                    {label}
                                  </label>
                                );
                              })}
                            </div>
                            {errors.acceptedPolymers && (
                              <p className="text-sm text-destructive">{errors.acceptedPolymers}</p>
                            )}
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="minCottonRatio">Min Pamuk Oranı (%)</Label>
                              <Input
                                id="minCottonRatio"
                                value={minCottonRatio}
                                onChange={(e) => setMinCottonRatio(e.target.value)}
                                inputMode="numeric"
                                aria-invalid={!!errors.minCottonRatio}
                                className="h-11 rounded-xl bg-white/60"
                              />
                              {errors.minCottonRatio && (
                                <p className="text-sm text-destructive">{errors.minCottonRatio}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="maxPolymerPurity">Maks. Saflık (%)</Label>
                              <Input
                                id="maxPolymerPurity"
                                value={maxPolymerPurity}
                                onChange={(e) => setMaxPolymerPurity(e.target.value)}
                                inputMode="numeric"
                                aria-invalid={!!errors.maxPolymerPurity}
                                className="h-11 rounded-xl bg-white/60"
                              />
                              {errors.maxPolymerPurity && (
                                <p className="text-sm text-destructive">{errors.maxPolymerPurity}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="minQuantityKg">Min Miktar (kg/ay)</Label>
                              <Input
                                id="minQuantityKg"
                                value={minQuantityKg}
                                onChange={(e) => setMinQuantityKg(e.target.value)}
                                inputMode="numeric"
                                aria-invalid={!!errors.minQuantityKg}
                                className="h-11 rounded-xl bg-white/60"
                              />
                              {errors.minQuantityKg && (
                                <p className="text-sm text-destructive">{errors.minQuantityKg}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="maxQuantityKg">Max Miktar (kg/ay)</Label>
                              <Input
                                id="maxQuantityKg"
                                value={maxQuantityKg}
                                onChange={(e) => setMaxQuantityKg(e.target.value)}
                                inputMode="numeric"
                                aria-invalid={!!errors.maxQuantityKg}
                                className="h-11 rounded-xl bg-white/60"
                              />
                              {errors.maxQuantityKg && (
                                <p className="text-sm text-destructive">{errors.maxQuantityKg}</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="maxDistanceKm">
                              Maksimum Mesafe (km): {maxDistanceKm}
                            </Label>
                            <input
                              id="maxDistanceKm"
                              type="range"
                              min={10}
                              max={5000}
                              step={10}
                              value={Number(maxDistanceKm)}
                              onChange={(e) => setMaxDistanceKm(e.target.value)}
                              className="w-full accent-emerald-600"
                            />
                            {errors.maxDistanceKm && (
                              <p className="text-sm text-destructive">{errors.maxDistanceKm}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="minRValue">Min R-Değeri (opsiyonel)</Label>
                            <Input
                              id="minRValue"
                              value={minRValue}
                              onChange={(e) => setMinRValue(e.target.value)}
                              placeholder="Örn: 2.5"
                              inputMode="decimal"
                              aria-invalid={!!errors.minRValue}
                              className="h-11 rounded-xl bg-white/60"
                            />
                            {errors.minRValue && (
                              <p className="text-sm text-destructive">{errors.minRValue}</p>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

                <div className="rounded-2xl border border-white/50 bg-white/20 p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-emerald-600"
                      aria-invalid={!!errors.consent}
                    />
                    <span className="text-sm text-foreground/70">
                      Bilgilerimin fabrikayla paylaşılmasını onaylıyorum.
                      <span className="block text-xs text-foreground/50 mt-1">
                        (MVP: yalnızca frontend demo onayıdır.)
                      </span>
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="mt-2 text-sm text-destructive">{errors.consent}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl bg-emerald-600 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white/90" />
                      Kayıt Oluşturuluyor...
                    </>
                  ) : (
                    "Kayıt Ol"
                  )}
                </Button>

                <div className="flex flex-col gap-2 text-sm text-foreground/70 sm:flex-row sm:items-center sm:justify-between">
                  <Link href="/login" className="hover:text-foreground">
                    Zaten hesabım var
                  </Link>
                  <a
                    href="#"
                    className="hover:text-foreground"
                    onClick={(ev) => ev.preventDefault()}
                    aria-disabled
                  >
                    Gizlilik & KVKK
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

