# Akıllı Atık Eşleştirme Platformu — Basit Teknoloji Yığını

Bu doküman, projeyi **başlangıç seviyesinde** ayağa kaldırmak için önerilen **en sade** yığını anlatır: **Next.js 14**, **Tailwind CSS**, **Supabase** ve **Google Gemini API**. Tam PRD’deki ek araçlar (harita, e-posta, Prisma vb.) ileride eklenebilir; önce bu dörtlü ile öğrenmek ve çalışan bir iskelet çıkarmak yeterlidir.

---

## 1. Yığın özeti

| Teknoloji | Ne işe yarar? |
|-----------|----------------|
| **Next.js 14** | Web sitesi + arka uç API’leri tek projede; sayfalar ve `/api` route’ları |
| **Tailwind CSS** | Hızlı, tutarlı arayüz stilleri; çok az ayrı CSS dosyası |
| **Supabase** | Veritabanı (PostgreSQL), kullanıcı girişi, istenirse dosya depolama |
| **Gemini API** | Yüklenen tekstil fotoğraflarını analiz eden yapay zeka |

---

## 2. Neden bu dörtlü?

### Next.js 14

- **Tek proje:** Hem kullanıcının gördüğü sayfalar hem sunucuda çalışan kod aynı repoda; başlangıçta ayrı bir “backend sunucusu” kurmana gerek yok.
- **App Router:** Sayfaları klasör yapısıyla düzenlemek kolay (`app/page.tsx` = ana sayfa).
- **API Routes:** Gemini anahtarını **sadece sunucuda** tutabilirsin; tarayıcıya sızdırmazsın (güvenlik için kritik).
- **TypeScript** (önerilir): Hata yapmayı azaltır; PRD ile uyumludur.

### Tailwind CSS

- **Hız:** Sınıf isimleriyle doğrudan HTML/JSX içinde stil verirsin; küçük projelerde CSS dosyası karmaşası azalır.
- **Tutarlılık:** Renk, boşluk, yazı boyutu ölçekleri hazır; responsive (mobil/tablet) için `sm:`, `md:` gibi önekler yeterli.
- **Öğrenme eğrisi:** Dokümantasyon net; “ne görüyorsan o” yaklaşımı.

### Supabase

- **Hepsi bir arada:** PostgreSQL veritabanı + hazır **kayıt / giriş** (e-posta + şifre) + pano üzerinden tablo yönetimi.
- **Ücretsiz katman:** Öğrenme ve MVP için yeterli limitler.
- **Güvenlik:** Satır düzeyi güvenlik (RLS) ile “her kullanıcı sadece kendi verisini görsün” kuralını veritabanında uygulayabilirsin (ileri adım).
- **İstemci kütüphanesi:** Next.js ile resmi rehberler bol.

### Google Gemini API

- **Görsel anlama:** “Bu fotoğrafta tekstil atığı var mı, tahmini bileşenler neler?” gibi sorulara uygun modeller (ör. görsel destekli modeller).
- **Maliyet / erişim:** Google AI Studio’dan anahtar alınması kolay; başlangıç için anlaşılır dokümantasyon.

---

## 3. Mimari mantık (basit)

```
Kullanıcı (tarayıcı)
    → Next.js sayfaları (Tailwind ile stilli)
    → Supabase Auth ile giriş
    → Veri okuma/yazma → Supabase (PostgreSQL)
    → Fotoğraf analizi isteği → Next.js API route → Gemini API (anahtar sadece sunucuda)
```

**Önemli kural:** `GEMINI_API_KEY` asla `.env.local` içinde `NEXT_PUBLIC_` ile başlamamalı; böylece Next.js onu istemciye göndermez. Sadece sunucu bileşenlerinde veya `app/api/.../route.ts` içinde kullan.

---

## 4. Kurulum adımları

Aşağıdaki sıra, sıfırdan “çalışan boş proje + bağlantılar” hedefler. Komutlar **Windows PowerShell** veya terminal için uygundur; Node.js **LTS** (ör. 20.x veya 22.x) yüklü olmalıdır.

### Adım 1: Node.js ve paket yöneticisi

1. [nodejs.org](https://nodejs.org) üzerinden **LTS** sürümünü kur.
2. Terminalde kontrol et: `node -v` ve `npm -v`

### Adım 2: Next.js 14 projesi + Tailwind

Proje klasöründe (veya yeni bir klasörde):

```bash
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

- Sorular çıkarsa: **App Router** evet, **Tailwind** evet, **TypeScript** evet önerilir.
- Zaten dolu bir klasörde çalışıyorsan `create-next-app` yerine boş klasör kullan veya mevcut yapıya göre [Next.js kurulum dokümanına](https://nextjs.org/docs/getting-started/installation) bak.

Kurulum sonrası:

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` açılmalı.

### Adım 3: Supabase projesi

1. [supabase.com](https://supabase.com) üzerinden hesap aç.
2. **New project** ile yeni proje oluştur; bölge seç, veritabanı şifresini güvenli sakla.
3. Proje hazır olunca **Settings → API** bölümünden şunları kopyala:
   - **Project URL**
   - **anon public** key
   - (İleride sunucu işlemleri için) **service_role** key — **asla** tarayıcıya veya `NEXT_PUBLIC_` ile paylaşma.

4. **Authentication → Providers** içinde e-posta girişini etkinleştir (varsayılan genelde açıktır).

5. Next.js projesine Supabase istemcisi ekle:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

6. Proje kökünde `.env.local` oluştur (bu dosyayı Git’e ekleme — `.gitignore`’da olmalı):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

7. Resmi rehbere göre `middleware` ve `lib/supabase` istemci dosyalarını ekle: [Supabase + Next.js (App Router)](https://supabase.com/docs/guides/auth/server-side/nextjs).

**Başlangıç hedefi:** Kayıt ol / giriş yap akışını çalışır hale getirmek; tabloları ilk etapta Supabase Table Editor ile elle de oluşturabilirsin (PRD şeması ileride).

### Adım 4: Google Gemini API

1. [Google AI Studio](https://aistudio.google.com) ile giriş yap.
2. **Get API key** ile bir anahtar oluştur.
3. `.env.local` içine ekle (**NEXT_PUBLIC kullanma**):

```env
GEMINI_API_KEY=buraya_anahtar
```

4. Next.js tarafında sunucuda çağrı için Google’ın önerdiği SDK’yı kur:

```bash
npm install @google/generative-ai
```

5. Örnek kullanım yeri: `app/api/analyze/route.ts` gibi bir **Route Handler** içinde modele mesaj gönder; istemci bu route’a `fetch` ile istek atar, **API anahtarı istemciye gitmez**.

**Başlangıç hedefi:** Tek bir test endpoint’inde basit metin veya tek görsel ile yanıt almak; sonra PRD’deki analiz formatına genişletmek.

### Adım 5: Ortam değişkenlerini doğrula

- Geliştirme sunucusunu her `.env.local` değişikliğinden sonra yeniden başlat: `Ctrl+C`, sonra `npm run dev`.
- `NEXT_PUBLIC_` ile başlayanlar tarayıcıda görülebilir; gizli anahtarları **asla** bu önek ile ekleme.

---

## 5. Sıradaki öğrenme sırası (öneri)

1. Next.js’te bir **statik sayfa** + Tailwind ile basit layout  
2. Supabase ile **kayıt / giriş** ve korumalı bir sayfa  
3. **API route** + Gemini ile sunucudan tek istek  
4. Form + dosya yükleme → Storage veya önce base64 ile küçük deneme (PRD’de Storage detayı var)  
5. Veritabanı tabloları ve analiz oturumunu kaydetme  

---

## 6. PRD ile fark (bilerek sadeleştirme)

Tam PRD’de ayrıca **shadcn/ui**, **Prisma**, **Resend**, **Google Maps**, **Recharts** vb. geçer. Bunlar ürünü zenginleştirir ama **ilk öğrenme turunda** zorunlu değildir. Bu dosyadaki yığınla önce “giriş + basit analiz API + veri kaydı” çalışır hale gelir; diğer araçlar `tasks.md` / `prd.md` sırasıyla eklenebilir.

---

## 7. Faydalı resmi kaynaklar

- [Next.js 14 Docs](https://nextjs.org/docs)  
- [Tailwind CSS Docs](https://tailwindcss.com/docs)  
- [Supabase Docs](https://supabase.com/docs)  
- [Google AI Gemini API](https://ai.google.dev/docs)  

---

*Bu doküman, başlangıç seviyesi için sadeleştirilmiş bir teknoloji seçimidir; proje kökündeki `prd.md` ürünün tam kapsamını tanımlar.*
