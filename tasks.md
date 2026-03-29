
PRD’deki tech stack, dosya yapısı, veritabanı, API’ler, auth, ekranlar, AI/eşleştirme ve MVP dışı maddeleri birleştirerek mantıklı bir sırayla checkbox’lı görev listesi hazırlıyorum.

---

## Akıllı Atık Eşleştirme — Geliştirme Görev Listesi

Aşağıdaki sıra: önce altyapı ve veri modeli, sonra güvenlik ve çekirdek kütüphaneler, ardından API’ler ve son olarak ekranlar / entegrasyonlar. Tamamladıkça `- [ ]` satırlarını `- [x]` yapabilirsiniz.

---

### Faz 1 — Proje ve ortam

- [ ] Node.js LTS ve paket yöneticisini (npm/pnpm) netleştir; repo kökünde `.gitignore` (`.env.local`, `.next`, `node_modules`) doğrula
- [ ] `create-next-app` ile **Next.js 14 (App Router) + TypeScript** projesi oluştur
- [ ] **Tailwind CSS** kur ve `tailwind.config` / `globals.css` temel tema (yeşil/bej tonları PRD ile uyumlu) ayarla
- [ ] **shadcn/ui** init; sık kullanılacak bileşenleri ekle (Button, Input, Card, Dialog, Select, Toast, Form, Accordion, vb.)
- [ ] PRD’deki **klasör yapısını** oluştur: `app/(auth)`, `app/(dashboard)`, `app/api`, `components/*`, `lib/*`, `prisma`, `types`
- [ ] `.env.local.example` dosyası oluştur (PRD Bölüm 16’daki tüm anahtarlar; gerçek değerleri commit etme)
- [ ] `NEXT_PUBLIC_APP_URL` ve ortam bazlı URL kullanımını (dev/prod) standartlaştır

---

### Faz 2 — Supabase ve veritabanı

- [ ] Supabase projesi aç; **PostgreSQL** ve **Auth** etkinleştir
- [ ] PRD **Bölüm 7** SQL şemasını uygula: enum’lar, tablolar, indeksler, `platform_stats` seed, `update_platform_stats` trigger (PostgreSQL’de `EXECUTE FUNCTION` yerine `EXECUTE PROCEDURE` / doğru sözdizimini Supabase sürümüne göre doğrula)
- [ ] **RLS** politikalarını PRD’deki gibi tanımla; `users` için INSERT/UPDATE (kayıt sonrası profil senkronu) ihtiyacını planla
- [ ] **Supabase Storage** bucket `waste-images` ve PRD **Bölüm 9** politikalarını uygula
- [ ] **Prisma** kur; `schema.prisma` ile tabloları modele çevir; `prisma generate` çalışır hale getir (migration stratejisi: Supabase’de SQL “source of truth” + Prisma `db pull` veya tek kaynak seçimi)
- [ ] `public.users` ile **Supabase Auth** eşlemesi: kayıtta `auth_id` = `auth.users.id`; server action veya trigger ile profil oluşturma akışını netleştir ve uygula

---

### Faz 3 — Auth, middleware ve roller

- [ ] `@supabase/ssr` (veya PRD’deki SSR yaklaşımı) ile `lib/supabase/client.ts` ve `lib/supabase/server.ts` yaz
- [ ] `middleware.ts`: korumalı route’lar (`/upload`, `/analysis`, `/matches`, `/history`, `/profile`), `buyerRoutes`, `adminRoutes` iskeleti
- [ ] **Rol bazlı yönlendirme**: producer / buyer / admin; buyer için `status === active` ve **admin onayı** kontrolü (pending buyer’ı uygun sayfaya yönlendir)
- [ ] `(auth)/layout.tsx`, **login** ve **register** sayfaları (e-posta + şifre; isteğe bağlı magic link sonra)
- [ ] **Producer kayıt** akışı: şirket, vergi no, telefon, il/ilçe (PRD Bölüm 5)
- [ ] **Buyer kayıt** akışı: fabrika tipi + **ihtiyaç profili** formu → `buyer_requirements` kaydı; başlangıçta `users.status = pending`
- [ ] E-posta doğrulama sonrası yönlendirme (`/upload` veya onay bekleme ekranı)
- [ ] Minimum **buyer onay** mekanizması: MVP için Supabase Table Editor / SQL veya tek endpoint + `service_role` (tam admin paneli v2’de; PRD 19)

---

### Faz 4 — Paylaşılan kütüphaneler ve tipler

- [ ] `types/index.ts`: `PolymerComposition`, `GeminiAnalysis`, API DTO’ları, `user_role`, `deal_status` vb.
- [ ] `lib/constants.ts`: **81 il + ilçeler + merkez lat/lng** (geocoding yok); polimer renkleri; `CARBON_CONSTANTS`, `THERMAL_CONDUCTIVITY` (PRD Bölüm 12)
- [ ] `lib/validations.ts`: **Zod** şemaları — `AnalysisFormSchema`, `DealRequestSchema`, `RegisterSchema`, Gemini yanıt şeması (PRD Bölüm 10–15)
- [ ] `lib/errors.ts`: `AppError` + `ERROR_MESSAGES` (PRD Bölüm 14)
- [ ] `lib/carbon.ts`: `calculateCarbonSaved`, `calculateRValue`, `carbonToCarEquivalent`
- [ ] `lib/gemini.ts`: sistem prompt, görsel + metin mesajı, JSON parse/temizleme, Zod doğrulama, polimer toplamı 100 normalizasyonu, düşük **confidence** → hata (PRD Bölüm 10)
- [ ] `lib/matching.ts`: haversine, dört alt skor, ağırlıklı `match_score`, ön filtre, top-10 → Directions → top-5, `matches` yazımı için saf fonksiyonlar

---

### Faz 5 — Harici API anahtarları ve güvenlik

- [ ] **Google Gemini** API anahtarı; sadece server route’lardan çağrı
- [ ] **Google Maps JavaScript API** + **Directions API** etkinleştir; `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` kısıtlamaları (HTTP referrer)
- [ ] **Resend** hesabı; `FROM_EMAIL`; domain doğrulama
- [ ] Günlük analiz ve IP bazlı **rate limit** (Upstash Redis veya Supabase sayaç tablosu — PRD Bölüm 8)

---

### Faz 6 — Backend API route’ları

- [ ] `GET /api/stats` → `platform_stats`; `revalidate: 60` (ISR)
- [ ] `POST /api/analyze`: multipart doğrulama, Storage yükleme, `analysis_sessions` (processing → completed/failed), Gemini, karbon/R, eşleştirme, `sessionId` dönüşü; hata kodları PRD ile uyumlu
- [ ] `GET /api/analysis/[sessionId]`: sahiplik kontrolü + analiz alanları
- [ ] `GET /api/matches/[sessionId]`: JOIN buyer + requirement özeti, `has_active_deal`, en fazla 5 eşleşme
- [ ] `POST /api/deals`: match doğrulama, duplicate pending kontrolü, Resend ile alıcıya mail
- [ ] **Deal lifecycle** için ek endpoint’ler: alıcı kabul/red, (opsiyonel) üretici iptal, tamamlanma + `platform_stats` güncellemesi (PRD Bölüm 13 — mevcut API listesinde yok; eklenmeli)
- [ ] `GET /api/history`: sayfalama `page`, `limit`, producer’a özel

---

### Faz 7 — Landing ve genel UI

- [ ] `app/page.tsx`: Navbar (sticky + blur), Hero, CTA (`/register` veya `/upload`)
- [ ] `components/landing/StatsCounter.tsx` + `useEffect` ile `/api/stats`; sayaç animasyonu
- [ ] How It Works (3 adım), Footer (Hakkımızda, KVKK, İletişim)
- [ ] `FactoryLogos.tsx`: `show_on_landing = true` buyer logoları; marquee
- [ ] **Responsive**: PRD Bölüm 17 breakpoint’leri

---

### Faz 8 — Dashboard layout ve ortak bileşenler

- [ ] `(dashboard)/layout.tsx`: oturum kontrolü, nav (çıkış, profil, geçmiş)
- [ ] Yükleme ve hata için `error.tsx` / `loading.tsx` (kritik dinamik sayfalarda)
- [ ] Toast / bildirim altyapısı (shadcn Sonner veya benzeri)

---

### Faz 9 — Üretici akışı (KOBİ)

- [ ] `upload/page.tsx`: `DropZone`, `WeightInput`, `LocationSelector`, submit → analiz API; `AnalysisLoadingState` (aşamalı mesajlar + sahte progress)
- [ ] İsteğe bağlı: client-side görsel sıkıştırma (`browser-image-compression`, PRD Bölüm 18)
- [ ] `analysis/[sessionId]/page.tsx`: Recharts donut, `InsulationScoreCard`, `CarbonMetricCard`, accordion, CTA’lar
- [ ] `matches/[sessionId]/page.tsx`: liste + seçim; `RouteMapPreview` (lazy load); `DealRequestModal` → `POST /api/deals`
- [ ] `history/page.tsx`: paginated liste, durum rozetleri
- [ ] `profile/page.tsx`: şirket/konum görüntüleme-güncelleme (PRD kapsamına göre)

---

### Faz 10 — Alıcı akışı

- [ ] `buyer-dashboard/page.tsx`: gelen teklifler listesi, özet, **İncele & Kabul Et** / **Reddet** (Faz 6’daki lifecycle API’ye bağlı)
- [ ] İhtiyaç profili güncelleme formu (`buyer_requirements`)
- [ ] Bildirim tercihleri (en azından şema + UI iskeleti veya basit boolean alan — PRD Bölüm 6)

---

### Faz 11 — E-posta şablonları

- [ ] Yeni teklif, kabul, red, analiz tamamlandı e-postaları (Resend + React Email veya HTML şablon — PRD Bölüm 13 tablosu)

---

### Faz 12 — Kalite, test ve yayın

- [ ] Kritik fonksiyonlar için birim testi (`matching`, `carbon`, validasyonlar) — isteğe bağlı framework (Vitest)
- [ ] Manuel E2E kontrol listesi: kayıt → upload → analiz → eşleşme → teklif → alıcı yanıtı
- [ ] **Vercel** deploy; env değişkenlerini Vercel’e aktar; Supabase auth redirect URL’lerini güncelle
- [ ] Production’da RLS + Storage politikalarını gözden geçir; `SUPABASE_SERVICE_ROLE_KEY` sadece server

---

### Faz 13 — MVP sonrası (PRD Bölüm 19 — isteğe bağlı sırayla)

- [ ] Admin paneli (kullanıcı / analiz moderasyonu)
- [ ] Gerçek zamanlı bildirimler (Supabase Realtime)
- [ ] Ödeme / fatura (iyzico)
- [ ] Mobil uygulama, çoklu dil, webhook’lar, karbon PDF

---

Bu liste, `prd.md` içindeki mimari planı (Next.js 14, Supabase, Prisma, Gemini, Maps, Resend, ekranlar ve veri modeli) tek bir uygulama yol haritasına bağlar. İstersen bir sonraki adımda belirli bir fazı (ör. sadece Faz 1–4) alt görevlere daha da bölebiliriz veya repo’da gerçekten kodlamaya başlamak için ilk commit sırasını netleştirebiliriz.