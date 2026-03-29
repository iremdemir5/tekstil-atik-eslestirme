# PRD: Akıllı Atık Eşleştirme Platformu
**Versiyon:** 2.0 — Cursor-Ready  
**Son Güncelleme:** 2025-06  
**Durum:** Geliştirmeye Hazır

---

## ⚠️ Senior Developer Gap Analizi (Orijinal PRD'den Eksikler)

> Bu bölüm orijinal PRD'de bulunmayan kritik teknik eksikleri listeler. Aşağıdaki tüm maddeler bu dokümanda çözülmüştür.

| # | Eksik | Risk | Çözüm |
|---|-------|------|-------|
| 1 | Auth & session yönetimi yok | Kritik — kim neyi görüyor belirsiz | Section 5: Auth Flow |
| 2 | DB şeması yok | Kritik — her şey havada kalıyor | Section 7: Database Schema |
| 3 | API endpoint'leri tanımsız | Yüksek — frontend/backend kontratsız | Section 8: API Spec |
| 4 | Alıcı onboarding yok | Yüksek — alıcı nasıl ihtiyaç tanımlıyor? | Section 6: Buyer Flow |
| 5 | Görsel depolama stratejisi yok | Yüksek — Gemini'ye ne gönderiyoruz? | Section 9: File Storage |
| 6 | Gemini prompt + response şeması yok | Yüksek — AI yanıtı parse edilemiyor | Section 10: AI Integration |
| 7 | Eşleştirme algoritması "vague" | Yüksek — skorlama nasıl çalışıyor? | Section 11: Matching Algorithm |
| 8 | Karbon hesaplama formülü yok | Orta — sayı nereden geliyor? | Section 12: Carbon Calculation |
| 9 | "Teklif Gönder" sonrası akış yok | Orta — deal lifecycle tanımsız | Section 13: Deal Lifecycle |
| 10 | Error state'ler tanımsız | Orta — kullanıcı ne görüyor? | Section 14: Error Handling |
| 11 | Input validasyon kuralları yok | Orta — ne kabul edilir? | Section 15: Validation Rules |
| 12 | Rate limiting yok | Orta — Gemini API abuse riski | Section 9: AI Integration |
| 13 | Landing page sayaçları static mi dynamic mi? | Düşük — gerçek zamanlı mı? | Section 4: Landing Page |
| 14 | Mobil responsive spec yok | Düşük — breakpoint'ler? | Section 3: UI Components |
| 15 | Pagination yok | Düşük — 1000 eşleşme listesi? | Section 8: API Spec |

---

## 1. Proje Özeti

Türkiye'deki 50.000+ tekstil KOBİ'sinin üretim firesi olan kumaş kırpıntılarını, döngüsel ekonomi prensipleriyle endüstriyel alıcılarla (yalıtım fabrikaları, iplik geri dönüşüm tesisleri) buluşturan **B2B SaaS web uygulamasıdır.**

**Temel değer önerisi:**
- KOBİ: Atık bertaraf maliyetini sıfırla, atığı gelire dönüştür
- Alıcı: Spesifik polimer ve termal değere sahip sürdürülebilir hammaddeye ulaş
- Platform: Transaction başına komisyon + SaaS abonelik hibrit modeli

---

## 2. Tech Stack (Kesinleştirilmiş)

```
Frontend:   Next.js 14 (App Router) + TypeScript
Styling:    Tailwind CSS + shadcn/ui
Charts:     Recharts
Backend:    Next.js API Routes (serverless)
Database:   Supabase (PostgreSQL)
Auth:       Supabase Auth (email/password + magic link)
Storage:    Supabase Storage (görsel yükleme)
AI:         Google Gemini 1.5 Pro Vision API
Maps:       Google Maps JavaScript API + Directions API
ORM:        Prisma (type-safe DB erişimi için)
Email:      Resend (notification'lar için)
Deploy:     Vercel
Env:        .env.local (NEXT_PUBLIC_ prefix kurallarına uygun)
```

---

## 3. Proje Dosya Yapısı

```
/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Auth guard burada
│   │   ├── upload/page.tsx             # Ekran 2: Veri Girişi
│   │   ├── analysis/[sessionId]/page.tsx  # Ekran 3: AI Sonuç
│   │   ├── matches/[sessionId]/page.tsx   # Ekran 4: Eşleştirme
│   │   ├── history/page.tsx            # Geçmiş analizler
│   │   └── profile/page.tsx
│   ├── api/
│   │   ├── auth/[...supabase]/route.ts
│   │   ├── analyze/route.ts            # POST — Gemini Vision çağrısı
│   │   ├── matches/route.ts            # GET  — eşleşme listesi
│   │   ├── deals/route.ts              # POST — teklif gönderme
│   │   └── stats/route.ts              # GET  — landing page sayaçları
│   ├── page.tsx                        # Ekran 1: Landing Page
│   └── layout.tsx
├── components/
│   ├── ui/                             # shadcn/ui bileşenleri
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   ├── StatsCounter.tsx
│   │   └── FactoryLogos.tsx
│   ├── upload/
│   │   ├── DropZone.tsx
│   │   ├── LocationSelector.tsx
│   │   └── WeightInput.tsx
│   ├── analysis/
│   │   ├── PolymerDonutChart.tsx
│   │   ├── InsulationScoreCard.tsx
│   │   ├── CarbonMetricCard.tsx
│   │   └── AnalysisLoadingState.tsx
│   └── matches/
│       ├── MatchCard.tsx
│       ├── RouteMapPreview.tsx
│       └── DealRequestModal.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Browser client
│   │   └── server.ts                   # Server client (RSC için)
│   ├── gemini.ts                       # Gemini API wrapper
│   ├── matching.ts                     # Eşleştirme algoritması
│   ├── carbon.ts                       # Karbon hesaplama
│   ├── validations.ts                  # Zod schema'ları
│   └── constants.ts                    # Polimer katsayıları vb.
├── prisma/
│   └── schema.prisma
├── types/
│   └── index.ts                        # Global TypeScript tipleri
└── .env.local
```

---

## 4. Ekran Gereksinimleri

### Ekran 1: Landing Page (`/`)

**Bölümler (yukarıdan aşağı):**

#### 4.1.1 Navbar
- Logo (sol)
- "Giriş Yap" + "Kayıt Ol" butonları (sağ)
- Scroll'da: `backdrop-blur` ile sticky header

#### 4.1.2 Hero Section
```
Başlık:    "Tekstil Atığınızı\nSürdürülebilir Değere Dönüştürün"
Alt Başlık: "AI destekli analiz ile kumaş kırpıntılarınızın polimer yapısını
             öğrenin, sizi bekleyen fabrikalara anında ulaşın."
CTA Butonu: "Ücretsiz Analiz Başlat" → /register (giriş yapılmamışsa)
                                      → /upload   (giriş yapılmışsa)
Arka plan: Subtle animated gradient (yeşil/bej tonları) + tekstil dokusu overlay
```

#### 4.1.3 Stats Bar (Dinamik — API'den gelir)
```
3 adet büyük sayaç:
[  1.247 ton  ]   [  89 Fabrika  ]   [  3.421 kg CO₂  ]
 Yönlendirilen      Kayıtlı Alıcı     Önlenen Karbon
    Atık
```
- Her sayaç `useEffect` + `/api/stats` endpoint'i ile gerçek zamanlı
- Animate.js ile yukarı sayma animasyonu (mount'ta bir kez)

#### 4.1.4 How It Works (3 adım, ikonlarla)
1. Fotoğraf Yükle
2. AI Analiz Eder
3. Fabrikanla Eşleş

#### 4.1.5 Factory Logos Section
- "Platformdaki Alıcılar" başlığı
- Yatay kaydırmalı logo bandı (CSS marquee)
- Logo'lar DB'deki `buyers` tablosundan çekilir, `show_on_landing = true` olanlar

#### 4.1.6 Footer
- Hakkımızda, KVKK, İletişim linkleri

---

### Ekran 2: Veri Girişi (`/upload`)

**Auth guard:** Giriş yapılmamış kullanıcı → `/login?redirect=/upload`

#### Bileşenler:

**DropZone.tsx**
```
Kabul edilen formatlar: image/jpeg, image/png, image/webp
Max boyut: 10 MB
Min boyut: 50 KB (çok küçük → analiz kalitesi düşer)
Çoklu fotoğraf: MAX 3 adet (farklı açılardan)
Önizleme: thumbnail grid
Drag state: border rengi değişimi + "Bırakın" metni
```

**WeightInput.tsx**
```
Alan:     Tahmini Miktar
Input:    Number (min: 1, max: 50000)
Birim:    Radio → [ kg ] veya [ ton ]  (ton seçilince * 1000 ile kg'a çevir)
Yardım:   "Emin değilseniz yaklaşık bir değer girebilirsiniz"
```

**LocationSelector.tsx**
```
İl Dropdown:  Türkiye'nin 81 ili (constants.ts'den)
İlçe Dropdown: Seçilen ile göre filtrelenir
Koordinat:    İl/ilçe seçimine göre merkez koordinat ata (geocoding yapmadan)
              → constants.ts'de her ilçenin lat/lng'i sabit tutulur
```

**Submit Butonu**
```
Text: "AI Analizini Başlat"
Loading state: disabled + spinner
Validation: 3 alan da dolu olmalı + en az 1 fotoğraf
```

**Loading State (AnalysisLoadingState.tsx)**
```
Full-screen overlay (modal değil, sayfa geçişi)
Aşamalı mesajlar (her 2 sn'de bir değişir):
  → "Görsel yükleniyor..."
  → "Gemini AI polimer yapısını analiz ediyor..."
  → "Termal değerler hesaplanıyor..."
  → "Sonuçlar hazırlanıyor..."
Progress bar: sahte animasyon (gerçek ilerlemeyi yansıtmaz, UX içindir)
```

---

### Ekran 3: AI Analiz Sonuç Paneli (`/analysis/[sessionId]`)

**Veri kaynağı:** `analysis_sessions` tablosu, `sessionId` ile sorgu

#### Layout: 2 kolon (lg üstü), 1 kolon (mobile)

**Sol Kolon — Görsel + Polymer Breakdown**

`PolymerDonutChart.tsx`
```
Kütüphane: Recharts PieChart
Veri:      analysis.polymer_composition (JSON)
           Örn: { cotton: 70, polyester: 25, nylon: 5 }
Renkler:   cotton → #8B9E6B, polyester → #4A7FB5, nylon → #E8A838, other → #9CA3AF
Tooltip:   hover'da yüzde + polimer adı (Türkçe)
Legend:    sağ veya alt (responsive)
```

**Sağ Kolon — Metrik Kartları**

`InsulationScoreCard.tsx`
```
Isı Yalıtım Değeri (R):   Hesaplanan R değeri (m²·K/W)
Geri Dönüştürülebilirlik: 0-100 puan (renk kodu: <40 kırmızı, 40-70 sarı, >70 yeşil)
Önerilen Kullanım:        "Yalıtım Paneli" / "İplik Geri Dönüşümü" / "Dolgu Malzemesi"
Polimer Saflık Skoru:     Tek tip polimer yüzdesi (alıcı için kritik)
```

`CarbonMetricCard.tsx`
```
Önlenen CO₂:   {value} kg CO₂e
Denklik:        "{X} km araba yolculuğuna eşdeğer"
                (1 km araba = ~0.21 kg CO₂ — constants.ts)
Görsel:        Yaprak ikonu + yeşil accent rengi
```

**Analiz Detayları (Accordion)**
```
"Polimer Analizi Nasıl Yapıldı?" — Gemini'nin döndürdüğü açıklama metni
"Bu Değerler Ne Anlama Geliyor?" — Statik eğitici içerik
```

**CTA Bölümü (sayfanın altı)**
```
"Uygun Fabrikaları Gör" → /matches/[sessionId]
"Yeni Analiz Yap"       → /upload
```

---

### Ekran 4: Eşleştirme & Lojistik (`/matches/[sessionId]`)

**Veri kaynağı:** `matches` tablosu + `buyers` tablosu JOIN

#### Layout: Sol (liste) + Sağ (harita) — lg breakpoint'te side-by-side

**Sol Panel: Match Listesi**

`MatchCard.tsx`
```
Her kart için:
  - Fabrika adı + şehri
  - Eşleşme Skoru: Büyük, renkli badge (% cinsinden)
    > 80%: yeşil, 60-80%: sarı, < 60%: turuncu
  - Uzaklık: km cinsinden
  - İhtiyaç etiketi: "Yalıtım Hammaddesi" / "İplik Geri Dönüşümü"
  - Aktif talep durumu: "Şu an {X} kg arıyor"
  - "Teklif Gönder" butonu
  - Seçili kart: highlighted border, harita sağda güncellenir
```

Maksimum 5 eşleşme gösterilir (pagination yok, skor sıralı).

**Sağ Panel: RouteMapPreview.tsx**
```
Google Maps embed (JavaScript API)
KOBİ konumu: Mavi pin
Seçili fabrika: Kırmızı pin
Rota: Directions API, driving mode
Bilgi kutusu: "~{X} km · Tahmini {Y} dk"
Harita boyutu: sticky, viewport yüksekliği
```

**DealRequestModal.tsx**
```
Trigger: "Teklif Gönder" butonu
İçerik:
  - Fabrika adı (readonly)
  - Teklif Edilen Fiyat (₺/kg) — opsiyonel
  - Müsait Tarih (date picker, min: bugün + 3 gün)
  - Not alanı (max 500 karakter) — opsiyonel
  - Onay checkbox: "Bilgilerimin fabrikayla paylaşılmasını onaylıyorum"
Submit: POST /api/deals
Başarı: Toast notification + modal kapanır + kart "Teklif Gönderildi" durumuna geçer
```

---

## 5. Authentication Flow

### Kullanıcı Rolleri (user_role enum)
```
producer    → Atık üreten KOBİ
buyer       → Endüstriyel alıcı fabrika
admin       → Platform yöneticisi
```

### Kayıt Akışı

**KOBİ (producer):**
```
1. E-posta + şifre
2. Şirket adı, vergi numarası, telefon
3. Şehir/ilçe seçimi
4. Rol: producer (default)
5. E-posta doğrulama → onaylanınca /upload'a yönlendir
```

**Alıcı (buyer):**
```
1. E-posta + şifre
2. Şirket adı, vergi numarası, telefon
3. Şehir/ilçe + koordinat
4. Fabrika tipi: [ Yalıtım Üreticisi | İplik Geri Dönüşümü | Dolgu Malzemesi | Diğer ]
5. İhtiyaç profili tanımlama (aşağıda)
6. Rol: buyer
7. Admin onayı gerekir (automated değil — spam önlemi)
```

**İhtiyaç Profili (Alıcı onboarding — kritik eksikti):**
```
İstenen Polimer Tipi:     multi-select [ Pamuk | Polyester | Naylon | Akrilik | Karışık ]
Min Pamuk Oranı (%):      number input (örn: 60)
Max Polimer Saflık (%):   number input
Min Miktar (kg/ay):       number input
Max Miktar (kg/ay):       number input
Maksimum Mesafe (km):     slider (10 - 500 km)
Min R-Değeri:             number (opsiyonel, yalıtım üreticileri için)
```

### Session Yönetimi
```
Provider:  Supabase Auth
Token:     JWT (httpOnly cookie via Supabase SSR)
Timeout:   7 gün (sliding)
Refresh:   Middleware'de otomatik
```

### Auth Middleware (`middleware.ts`)
```typescript
// Korumalı route'lar:
const protectedRoutes = ['/upload', '/analysis', '/matches', '/history', '/profile']
const buyerRoutes = ['/buyer-dashboard']
const adminRoutes = ['/admin']

// Her istek öncesi:
// 1. Session kontrol
// 2. Role-based redirect
// 3. Buyer account approval kontrolü
```

---

## 6. Alıcı Dashboard (Buyer Flow)

> Bu ekran orijinal PRD'de yoktu — alıcılar nasıl sistemi kullanacak?

### `/buyer-dashboard`

**Aktif Talepler Paneli:**
```
Alıcının aktif ihtiyaç profillerine gelen tekliflerin listesi:
- KOBİ adı (anonim göster → teklif kabul edilince açılır)
- Analiz özeti: polimer dağılımı, miktar, şehir
- Eşleşme skoru
- "İncele & Kabul Et" / "Reddet" butonları
```

**Profil Ayarları:**
```
İhtiyaç profilini güncelle (kayıt'takiyle aynı form)
Bildirim tercihleri: e-posta bildirimleri aç/kapat
```

---

## 7. Veritabanı Şeması

```sql
-- ============================================================
-- ENUM TIPLERI
-- ============================================================

CREATE TYPE user_role AS ENUM ('producer', 'buyer', 'admin');
CREATE TYPE account_status AS ENUM ('pending', 'active', 'suspended');
CREATE TYPE analysis_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE deal_status AS ENUM ('pending', 'accepted', 'rejected', 'completed', 'cancelled');
CREATE TYPE polymer_type AS ENUM ('cotton', 'polyester', 'nylon', 'acrylic', 'viscose', 'other');
CREATE TYPE factory_type AS ENUM ('insulation', 'yarn_recycling', 'filling_material', 'other');


-- ============================================================
-- KULLANICLAR
-- ============================================================

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id         UUID UNIQUE NOT NULL, -- Supabase Auth user.id
  email           VARCHAR(255) UNIQUE NOT NULL,
  role            user_role NOT NULL DEFAULT 'producer',
  status          account_status NOT NULL DEFAULT 'pending',

  -- Şirket bilgileri
  company_name    VARCHAR(255) NOT NULL,
  tax_number      VARCHAR(11),               -- Vergi kimlik no (10 veya 11 hane)
  phone           VARCHAR(20),

  -- Konum (KOBİ ve alıcı için)
  city            VARCHAR(100),
  district        VARCHAR(100),
  latitude        DECIMAL(10, 8),
  longitude       DECIMAL(11, 8),

  -- Landing page için
  show_on_landing BOOLEAN DEFAULT FALSE,     -- Buyer logoları için
  logo_url        TEXT,

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_users_status ON users(status);


-- ============================================================
-- ALICI İHTİYAÇ PROFİLLERİ
-- ============================================================

CREATE TABLE buyer_requirements (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  factory_type          factory_type NOT NULL,

  -- Polimer gereksinimleri
  accepted_polymers     polymer_type[] NOT NULL,  -- Kabul edilen polimer tipleri
  min_cotton_ratio      INTEGER CHECK (min_cotton_ratio BETWEEN 0 AND 100),
  max_synthetic_ratio   INTEGER CHECK (max_synthetic_ratio BETWEEN 0 AND 100),

  -- Miktar gereksinimleri (aylık)
  min_quantity_kg       INTEGER CHECK (min_quantity_kg > 0),
  max_quantity_kg       INTEGER CHECK (max_quantity_kg > 0),

  -- Lojistik
  max_distance_km       INTEGER DEFAULT 300 CHECK (max_distance_km BETWEEN 10 AND 2000),

  -- Termal (yalıtım fabrikaları için)
  min_r_value           DECIMAL(6, 3),            -- m²·K/W, NULL = önemli değil

  -- Minimum eşleşme skoru (sistemin teklif göndermesi için eşik)
  min_match_score       INTEGER DEFAULT 60 CHECK (min_match_score BETWEEN 0 AND 100),

  is_active             BOOLEAN DEFAULT TRUE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_buyer_req_buyer ON buyer_requirements(buyer_id);
CREATE INDEX idx_buyer_req_active ON buyer_requirements(is_active);


-- ============================================================
-- ANALİZ OTURUMLARI
-- ============================================================

CREATE TABLE analysis_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Kullanıcı girdisi
  weight_kg       DECIMAL(10, 2) NOT NULL CHECK (weight_kg > 0),
  city            VARCHAR(100) NOT NULL,
  district        VARCHAR(100),
  latitude        DECIMAL(10, 8) NOT NULL,
  longitude       DECIMAL(11, 8) NOT NULL,

  -- Yüklenen görseller (Supabase Storage path'leri)
  image_paths     TEXT[] NOT NULL,             -- ['uploads/uuid1.jpg', ...]

  -- İşlem durumu
  status          analysis_status DEFAULT 'pending',
  error_message   TEXT,                        -- Hata durumunda

  -- Gemini API yanıtı (ham)
  gemini_raw_response  JSONB,

  -- Parse edilmiş analiz sonuçları
  polymer_composition  JSONB,
  -- Format: { "cotton": 70, "polyester": 25, "nylon": 5 }

  r_value              DECIMAL(6, 3),          -- m²·K/W
  thermal_conductivity DECIMAL(6, 4),          -- k değeri (W/m·K)
  recycling_score      INTEGER CHECK (recycling_score BETWEEN 0 AND 100),
  polymer_purity_score INTEGER CHECK (polymer_purity_score BETWEEN 0 AND 100),
  recommended_use      VARCHAR(100),           -- 'insulation' | 'yarn_recycling' | 'filling'

  -- Karbon hesabı
  carbon_saved_kg      DECIMAL(10, 2),         -- kg CO₂e

  -- Gemini'nin ürettiği açıklama metni
  analysis_description TEXT,

  processing_started_at  TIMESTAMPTZ,
  processing_finished_at TIMESTAMPTZ,
  created_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_producer ON analysis_sessions(producer_id);
CREATE INDEX idx_sessions_status ON analysis_sessions(status);
CREATE INDEX idx_sessions_created ON analysis_sessions(created_at DESC);


-- ============================================================
-- EŞLEŞMELER
-- ============================================================

CREATE TABLE matches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES analysis_sessions(id) ON DELETE CASCADE,
  buyer_id        UUID NOT NULL REFERENCES users(id),
  requirement_id  UUID NOT NULL REFERENCES buyer_requirements(id),

  -- Skorlama (0-100)
  match_score     INTEGER NOT NULL CHECK (match_score BETWEEN 0 AND 100),

  -- Skor bileşenleri (şeffaflık için ayrı tutulur)
  polymer_score   INTEGER CHECK (polymer_score BETWEEN 0 AND 100),
  distance_score  INTEGER CHECK (distance_score BETWEEN 0 AND 100),
  quantity_score  INTEGER CHECK (quantity_score BETWEEN 0 AND 100),
  thermal_score   INTEGER CHECK (thermal_score BETWEEN 0 AND 100),

  -- Lojistik
  distance_km     DECIMAL(8, 2),
  route_duration_min  INTEGER,

  created_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(session_id, buyer_id)               -- Bir session için aynı alıcı bir kez eşleşir
);

CREATE INDEX idx_matches_session ON matches(session_id);
CREATE INDEX idx_matches_buyer ON matches(buyer_id);
CREATE INDEX idx_matches_score ON matches(match_score DESC);


-- ============================================================
-- TEKLIFLER / DEAL'LER
-- ============================================================

CREATE TABLE deals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id        UUID NOT NULL REFERENCES matches(id),
  producer_id     UUID NOT NULL REFERENCES users(id),
  buyer_id        UUID NOT NULL REFERENCES users(id),

  status          deal_status DEFAULT 'pending',

  -- KOBİ'nin teklifi
  offered_price_per_kg  DECIMAL(10, 2),        -- ₺/kg, NULL = fiyat belirtilmedi
  available_date        DATE,
  note                  TEXT,

  -- Alıcının yanıtı
  buyer_response_note   TEXT,
  responded_at          TIMESTAMPTZ,

  -- Deal tamamlandığında
  final_weight_kg       DECIMAL(10, 2),
  completed_at          TIMESTAMPTZ,

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deals_producer ON deals(producer_id);
CREATE INDEX idx_deals_buyer ON deals(buyer_id);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_match ON deals(match_id);


-- ============================================================
-- PLATFORM İSTATİSTİKLERİ (Landing Page sayaçları için)
-- ============================================================

CREATE TABLE platform_stats (
  id              SERIAL PRIMARY KEY,
  stat_key        VARCHAR(100) UNIQUE NOT NULL,
  stat_value      DECIMAL(15, 2) NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Başlangıç değerleri:
INSERT INTO platform_stats (stat_key, stat_value) VALUES
  ('total_waste_kg', 0),
  ('registered_buyers', 0),
  ('total_carbon_saved_kg', 0),
  ('total_deals_completed', 0);

-- Trigger: Analiz tamamlandığında stats güncelle
CREATE OR REPLACE FUNCTION update_platform_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE platform_stats
    SET stat_value = stat_value + NEW.weight_kg,
        updated_at = NOW()
    WHERE stat_key = 'total_waste_kg';

    UPDATE platform_stats
    SET stat_value = stat_value + COALESCE(NEW.carbon_saved_kg, 0),
        updated_at = NOW()
    WHERE stat_key = 'total_carbon_saved_kg';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stats
  AFTER UPDATE ON analysis_sessions
  FOR EACH ROW EXECUTE FUNCTION update_platform_stats();


-- ============================================================
-- ROW LEVEL SECURITY (Supabase)
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_requirements ENABLE ROW LEVEL SECURITY;

-- users: Herkes kendi kaydını görebilir
CREATE POLICY "Users see own record"
  ON users FOR SELECT
  USING (auth.uid() = auth_id);

-- analysis_sessions: Producer kendi session'larını görür
CREATE POLICY "Producer sees own sessions"
  ON analysis_sessions FOR ALL
  USING (producer_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- matches: Producer ve buyer kendi eşleşmelerini görür
CREATE POLICY "Parties see own matches"
  ON matches FOR SELECT
  USING (
    session_id IN (SELECT id FROM analysis_sessions WHERE producer_id = (SELECT id FROM users WHERE auth_id = auth.uid()))
    OR buyer_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- deals: İlgili taraflar görebilir
CREATE POLICY "Parties see own deals"
  ON deals FOR SELECT
  USING (
    producer_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    OR buyer_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- buyer_requirements: Buyer kendi requirement'larını yönetir
CREATE POLICY "Buyer manages own requirements"
  ON buyer_requirements FOR ALL
  USING (buyer_id = (SELECT id FROM users WHERE auth_id = auth.uid()));
```

---

## 8. API Endpoint Spesifikasyonları

### POST `/api/analyze`

**Auth:** Gerekli (producer role)

**Request:**
```typescript
// multipart/form-data
{
  images: File[],        // 1-3 görsel, max 10MB/adet
  weight_kg: number,     // min: 1
  city: string,
  district: string,
  latitude: number,
  longitude: number
}
```

**İşlem Sırası:**
```
1. Görsel validasyonu (tip, boyut)
2. Supabase Storage'a yükle → path'leri al
3. analysis_sessions kaydı oluştur (status: 'processing')
4. Gemini API'ye gönder (lib/gemini.ts)
5. Yanıtı parse et + hesaplamalar (lib/carbon.ts)
6. Session'ı güncelle (status: 'completed')
7. Eşleştirme algoritmasını çalıştır (lib/matching.ts)
8. matches tablosuna kaydet
9. sessionId döndür
```

**Response (200):**
```typescript
{
  sessionId: string,
  status: "completed"
}
```

**Error Response'lar:**
```typescript
400: { error: "INVALID_FILE_TYPE", message: "Sadece JPEG, PNG ve WebP desteklenir" }
400: { error: "FILE_TOO_LARGE", message: "Maksimum dosya boyutu 10 MB'dır" }
422: { error: "ANALYSIS_FAILED", message: "Görsel analiz edilemedi. Daha net bir fotoğraf deneyin." }
429: { error: "RATE_LIMITED", message: "Günlük 5 analiz hakkınızı kullandınız" }
500: { error: "INTERNAL_ERROR", message: "Bir hata oluştu, lütfen tekrar deneyin" }
```

**Rate Limiting:**
```
Kayıtlı kullanıcı: 5 analiz/gün
IP bazlı: 10 istek/saat (kayıtsız denemeler için)
Implementation: Upstash Redis veya Supabase'de basit sayaç tablosu
```

---

### GET `/api/analysis/[sessionId]`

**Auth:** Gerekli (session sahibi)

**Response (200):**
```typescript
{
  id: string,
  status: "completed" | "processing" | "failed",
  weight_kg: number,
  city: string,
  polymer_composition: {
    cotton?: number,     // yüzde
    polyester?: number,
    nylon?: number,
    acrylic?: number,
    viscose?: number,
    other?: number
  },
  r_value: number,
  recycling_score: number,
  polymer_purity_score: number,
  recommended_use: "insulation" | "yarn_recycling" | "filling",
  carbon_saved_kg: number,
  analysis_description: string,
  created_at: string
}
```

---

### GET `/api/matches/[sessionId]`

**Auth:** Gerekli

**Response (200):**
```typescript
{
  matches: [
    {
      id: string,
      match_score: number,
      distance_km: number,
      route_duration_min: number,
      buyer: {
        id: string,
        company_name: string,
        city: string,
        factory_type: string,
        logo_url: string | null
      },
      score_breakdown: {
        polymer_score: number,
        distance_score: number,
        quantity_score: number,
        thermal_score: number
      },
      has_active_deal: boolean   // Bu eşleşme için zaten teklif gönderildi mi?
    }
  ]
}
```

---

### POST `/api/deals`

**Auth:** Gerekli (producer role)

**Request:**
```typescript
{
  match_id: string,
  offered_price_per_kg?: number,   // opsiyonel
  available_date?: string,          // ISO date string
  note?: string                     // max 500 karakter
}
```

**İşlem:**
```
1. match_id doğrulama (session sahibi mi?)
2. Duplicate teklif kontrolü (aynı match için zaten pending deal var mı?)
3. deals tablosuna kaydet
4. Alıcıya e-posta bildirimi gönder (Resend)
5. deal.id döndür
```

**Response (201):**
```typescript
{ dealId: string, status: "pending" }
```

---

### GET `/api/stats`

**Auth:** Yok (public)

**Response (200):**
```typescript
{
  total_waste_kg: number,
  registered_buyers: number,
  total_carbon_saved_kg: number
}
```

**Cache:** 60 saniye (Next.js `revalidate`)

---

### GET `/api/history`

**Auth:** Gerekli (producer)

**Query params:** `?page=1&limit=10`

**Response (200):**
```typescript
{
  sessions: [
    {
      id: string,
      created_at: string,
      weight_kg: number,
      city: string,
      status: string,
      recycling_score: number,
      match_count: number
    }
  ],
  total: number,
  page: number
}
```

---

## 9. Dosya Depolama (Supabase Storage)

### Bucket Yapısı
```
bucket: "waste-images"
├── uploads/
│   └── {userId}/
│       └── {sessionId}/
│           ├── image_1.jpg
│           ├── image_2.jpg
│           └── image_3.jpg
```

### Güvenlik Kuralları
```sql
-- Supabase Storage Policy:
-- Kullanıcı sadece kendi klasörüne yükleyebilir
CREATE POLICY "User uploads to own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'waste-images'
  AND (storage.foldername(name))[1] = 'uploads'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Herkes görselleri okuyamaz (sadece signed URL ile)
CREATE POLICY "Private images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'waste-images'
  AND auth.uid()::text = (storage.foldername(name))[2]
);
```

### Gemini'ye Görsel Gönderme
```typescript
// Supabase Storage'dan base64 oku, Gemini'ye gönder
const { data } = await supabase.storage
  .from('waste-images')
  .download(imagePath)

const base64 = Buffer.from(await data.arrayBuffer()).toString('base64')
// → Gemini API'ye inlineData olarak gönder
```

---

## 10. AI Entegrasyonu (lib/gemini.ts)

### Gemini API Prompt Şeması

```typescript
const SYSTEM_PROMPT = `
Sen tekstil mühendisliği uzmanı bir AI analiz sistemisisin.
Kullanıcının yüklediği tekstil atığı görselini analiz ederek aşağıdaki JSON formatında yanıt ver.
SADECE JSON döndür, başka hiçbir metin ekleme.

{
  "polymer_composition": {
    "cotton": <0-100 arası integer, ZORUNLU>,
    "polyester": <0-100 arası integer>,
    "nylon": <0-100 arası integer>,
    "acrylic": <0-100 arası integer>,
    "viscose": <0-100 arası integer>,
    "other": <0-100 arası integer>
  },
  // Not: Tüm değerlerin toplamı 100 olmalıdır
  
  "confidence": <0-100 arası integer — analizin güven skoru>,
  
  "primary_polymer": "<en yüksek oranlı polimer adı>",
  
  "texture_description": "<görünür doku, renk ve materyal özellikleri — max 150 karakter>",
  
  "analysis_description": "<Türkçe, 2-3 cümle — bu atığın ne için uygun olduğunu açıkla>",
  
  "recommended_use": "<'insulation' | 'yarn_recycling' | 'filling_material' — sadece biri>",
  
  "quality_notes": "<eğer görselde kalite sorunları varsa belirt, yoksa null>"
}
`

// Gemini'ye gönderilen mesaj yapısı:
const message = {
  role: "user",
  parts: [
    ...imageBase64Array.map(base64 => ({
      inlineData: { mimeType: "image/jpeg", data: base64 }
    })),
    {
      text: `Bu tekstil atığı görselini analiz et. Atık miktarı: ${weight_kg} kg. Konum: ${city}.`
    }
  ]
}
```

### Response Parse ve Validation
```typescript
// lib/gemini.ts
export async function analyzeWasteImages(params: AnalyzeParams): Promise<GeminiAnalysis> {
  const response = await geminiModel.generateContent(...)
  const rawText = response.response.text()

  // JSON parse (markdown fence temizleme dahil)
  const cleaned = rawText.replace(/```json\n?|\n?```/g, '').trim()

  let parsed: GeminiRawResponse
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    throw new AppError('PARSE_ERROR', 'AI yanıtı işlenemedi')
  }

  // Zod validasyonu
  const validated = GeminiResponseSchema.safeParse(parsed)
  if (!validated.success) {
    throw new AppError('INVALID_AI_RESPONSE', 'AI yanıtı beklenen formatta değil')
  }

  // Polimer toplamı 100 olmalı (normalleştir)
  const composition = validated.data.polymer_composition
  const total = Object.values(composition).reduce((a, b) => a + b, 0)
  if (total !== 100) {
    // Normalleştir: her değeri (değer / total) * 100 yap
    Object.keys(composition).forEach(k => {
      composition[k] = Math.round((composition[k] / total) * 100)
    })
  }

  return validated.data
}
```

### Hata Durumları
```
Görsel çok karanlık/bulanık → confidence < 30 → ANALYSIS_FAILED hatası
Tekstil görseli değil       → analysis_description'da uyarı + düşük confidence
Gemini timeout (>30s)       → session status = 'failed', kullanıcıya hata
```

---

## 11. Eşleştirme Algoritması (lib/matching.ts)

### Skor Hesaplama Formülü

```typescript
/**
 * Toplam Eşleşme Skoru (0-100):
 * match_score = (polymer_score × 0.40) + (distance_score × 0.30)
 *             + (quantity_score × 0.20) + (thermal_score × 0.10)
 */

// 1. Polimer Skoru (40% ağırlık)
// Alıcının kabul ettiği polimerler ile analiz sonucunun örtüşmesi
function calcPolymerScore(analysis, requirement): number {
  const acceptedPolymers = requirement.accepted_polymers  // ['cotton', 'polyester']
  const composition = analysis.polymer_composition
  
  // Kabul edilen polimerlerin toplam yüzdesi
  const matchedRatio = acceptedPolymers.reduce((sum, p) => sum + (composition[p] || 0), 0)
  
  // Min pamuk oranı şartı
  if (requirement.min_cotton_ratio && composition.cotton < requirement.min_cotton_ratio) {
    return Math.floor(matchedRatio * 0.5)  // Yarı puan — şart sağlanmıyor
  }
  
  return matchedRatio  // 0-100
}

// 2. Mesafe Skoru (30% ağırlık)
// max_distance_km'den uzaksa 0, yakınsa 100'e yakın
function calcDistanceScore(distanceKm, maxDistanceKm): number {
  if (distanceKm > maxDistanceKm) return 0
  return Math.round((1 - distanceKm / maxDistanceKm) * 100)
}

// 3. Miktar Skoru (20% ağırlık)
// Analiz miktarı alıcının min-max aralığında mı?
function calcQuantityScore(weightKg, requirement): number {
  const { min_quantity_kg, max_quantity_kg } = requirement
  if (weightKg < min_quantity_kg) {
    // Minimum altında — kısmi puan
    return Math.round((weightKg / min_quantity_kg) * 60)
  }
  if (weightKg > max_quantity_kg) {
    // Maximum üstünde — kısmi puan (fazla atık problem olmayabilir)
    return 80
  }
  return 100  // Tam aralıkta
}

// 4. Termal Skor (10% ağırlık)
// Sadece yalıtım fabrikaları için anlamlı
function calcThermalScore(rValue, requirement): number {
  if (!requirement.min_r_value) return 100  // Şart yok, tam puan
  if (!rValue) return 50                    // Analiz değeri yok
  if (rValue >= requirement.min_r_value) return 100
  return Math.round((rValue / requirement.min_r_value) * 100)
}
```

### Mesafe Hesaplama
```typescript
// Haversine formülü (Google Maps API çağrısı yapmadan ön filtreleme için)
// Gerçek rota mesafesi sadece top 5 eşleşme için Google Directions API ile hesaplanır
function haversineDistance(lat1, lon1, lat2, lon2): number {
  const R = 6371  // Dünya yarıçapı (km)
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}
```

### Çalışma Akışı
```
1. Tüm aktif buyer_requirements'ları çek (is_active = true)
2. Her requirement için haversine ile ön mesafe filtresi (> max_distance_km * 1.5 ise atla)
3. 4 skor hesapla
4. min_match_score eşiğini geçenleri filtrele
5. Skor sıralı top-10 listesi oluştur
6. Top-10 için Google Directions API ile gerçek mesafe/süre al
7. Skoru gerçek mesafeyle güncelle
8. Top-5'i matches tablosuna kaydet
```

---

## 12. Karbon Hesaplama (lib/carbon.ts)

```typescript
/**
 * Önlenen CO₂ hesaplama
 *
 * Metodoloji:
 * 1. Tekstil atığı düzenli depolama alanına giderse:
 *    → 0.5 kg CO₂e / kg atık (CH₄ emisyonu + taşıma)
 * 2. Yalıtım malzemesi olarak kullanılırsa bina enerji tasarrufu:
 *    → R değerine göre ek tasarruf (basitleştirilmiş model)
 * 3. İplik geri dönüşümü ise virgin pamuk üretimine kıyasla:
 *    → 5.9 kg CO₂e / kg pamuk tasarrufu (lifecycle assessment verisi)
 */

// constants.ts
export const CARBON_CONSTANTS = {
  LANDFILL_EMISSION_FACTOR: 0.5,        // kg CO₂e / kg tekstil
  COTTON_VIRGIN_FACTOR: 5.9,            // kg CO₂e / kg virgin pamuk
  POLYESTER_VIRGIN_FACTOR: 3.8,         // kg CO₂e / kg virgin polyester
  CAR_EMISSION_PER_KM: 0.21,            // kg CO₂e / km
  POLYMER_THICKNESS_DEFAULT: 0.05,      // metre (5 cm)
}

// Polimer bazlı termal iletkenlik katsayıları (W/m·K)
export const THERMAL_CONDUCTIVITY: Record<string, number> = {
  cotton:    0.040,
  polyester: 0.036,
  nylon:     0.025,
  acrylic:   0.030,
  viscose:   0.038,
  other:     0.045,
}

export function calculateCarbonSaved(
  weightKg: number,
  composition: PolymerComposition,
  recommendedUse: string
): number {
  // Temel: depolama alanından kurtarılan emisyon
  const landfillSaving = weightKg * CARBON_CONSTANTS.LANDFILL_EMISSION_FACTOR

  // Ek tasarruf: virgin malzeme üretiminden kaçınma
  let virginSaving = 0
  if (recommendedUse === 'yarn_recycling') {
    virginSaving += (composition.cotton || 0) / 100 * weightKg * CARBON_CONSTANTS.COTTON_VIRGIN_FACTOR
    virginSaving += (composition.polyester || 0) / 100 * weightKg * CARBON_CONSTANTS.POLYESTER_VIRGIN_FACTOR
  }

  return Math.round((landfillSaving + virginSaving) * 100) / 100
}

export function calculateRValue(composition: PolymerComposition): number {
  // Ağırlıklı ortalama k değeri
  const weightedK = Object.entries(composition).reduce((sum, [polymer, ratio]) => {
    return sum + ((THERMAL_CONDUCTIVITY[polymer] || 0.045) * ratio / 100)
  }, 0)

  const L = CARBON_CONSTANTS.POLYMER_THICKNESS_DEFAULT
  return Math.round((L / weightedK) * 1000) / 1000  // m²·K/W
}

export function carbonToCarEquivalent(carbonKg: number): number {
  return Math.round(carbonKg / CARBON_CONSTANTS.CAR_EMISSION_PER_KM)
}
```

---

## 13. Deal Lifecycle

```
[Oluşturuldu: pending]
     │
     ├─→ Alıcı "Kabul Et" → [accepted]
     │        └─→ Her iki tarafa e-posta (iletişim bilgileri paylaşılır)
     │        └─→ 30 gün içinde "Tamamlandı" işaretlenmezse → hatırlatıcı e-posta
     │
     ├─→ Alıcı "Reddet" → [rejected]
     │        └─→ KOBİ'ye bildirim
     │
     ├─→ KOBİ "İptal Et" → [cancelled] (sadece pending iken)
     │
     └─→ Manuel "Tamamlandı" → [completed]
              └─→ platform_stats güncellenir
              └─→ final_weight_kg girilir
```

### E-posta Bildirimleri (Resend)
```
Tetikleyici → Alıcı                           → Gönderilen İçerik
─────────────────────────────────────────────────────────────────
Yeni teklif → buyer@firma.com                 → Analiz özeti + "İncele" linki
Kabul        → producer@kobi.com              → Fabrika iletişim bilgileri
Red          → producer@kobi.com              → "Başka fabrikalar için teklif gönderebilirsiniz"
Analiz tamam → producer@kobi.com              → Sonuç özeti + "Eşleşmeleri Gör" linki
```

---

## 14. Error Handling

### Frontend Error Boundary
```typescript
// Her page için Suspense + Error Boundary
// app/(dashboard)/analysis/[sessionId]/error.tsx:
export default function AnalysisError({ error, reset }) {
  return (
    <ErrorCard
      title="Analiz yüklenemedi"
      description={error.message}
      action={{ label: "Tekrar Dene", onClick: reset }}
    />
  )
}
```

### Kullanıcıya Gösterilecek Hata Mesajları
```typescript
// lib/errors.ts
export const ERROR_MESSAGES = {
  INVALID_FILE_TYPE:     "Lütfen JPEG, PNG veya WebP formatında bir görsel yükleyin.",
  FILE_TOO_LARGE:        "Görsel boyutu 10 MB'ı aşmamalıdır.",
  FILE_TOO_SMALL:        "Görsel çok küçük. Daha yüksek kaliteli bir fotoğraf deneyin.",
  ANALYSIS_FAILED:       "Görsel analiz edilemedi. Atığı daha iyi aydınlatılmış, net bir ortamda fotoğraflayıp tekrar deneyin.",
  RATE_LIMITED:          "Günlük analiz limitinize ulaştınız. Yarın tekrar deneyebilirsiniz.",
  NO_MATCHES_FOUND:      "Şu an sisteminizde bu atığa uygun aktif alıcı bulunmuyor. Ekibimiz yeni alıcıları sisteme ekledikçe bilgilendirileceksiniz.",
  NETWORK_ERROR:         "Bağlantı hatası. İnternet bağlantınızı kontrol edip tekrar deneyin.",
  UNAUTHORIZED:          "Bu sayfayı görüntülemek için giriş yapmanız gerekiyor.",
}
```

### Gemini Confidence Eşikleri
```
confidence >= 70 → Normal akış
confidence 40-69 → Uyarı göster: "Analiz sonuçları tahmini niteliktedir. Daha net bir fotoğraf yüklemeniz sonuçların doğruluğunu artırır."
confidence < 40  → ANALYSIS_FAILED hatası → Kullanıcıdan yeniden fotoğraf yüklemesi istenir
```

---

## 15. Input Validasyon Kuralları (Zod)

```typescript
// lib/validations.ts
import { z } from 'zod'

export const AnalysisFormSchema = z.object({
  weight_kg: z.number()
    .min(1, "Minimum 1 kg giriniz")
    .max(50000, "Maximum 50.000 kg girebilirsiniz"),
  city: z.string().min(1, "Şehir seçiniz"),
  district: z.string().min(1, "İlçe seçiniz"),
  images: z.array(z.instanceof(File))
    .min(1, "En az bir fotoğraf yükleyin")
    .max(3, "En fazla 3 fotoğraf yükleyebilirsiniz")
    .refine(
      files => files.every(f => f.size <= 10 * 1024 * 1024),
      "Her görsel 10 MB'ı aşmamalıdır"
    )
    .refine(
      files => files.every(f => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)),
      "Sadece JPEG, PNG ve WebP formatları kabul edilir"
    )
    .refine(
      files => files.every(f => f.size >= 50 * 1024),
      "Görsel en az 50 KB olmalıdır"
    )
})

export const DealRequestSchema = z.object({
  match_id: z.string().uuid(),
  offered_price_per_kg: z.number().positive().optional(),
  available_date: z.string()
    .refine(d => new Date(d) >= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      "Tarih en az 3 gün sonrası olmalıdır")
    .optional(),
  note: z.string().max(500, "Not 500 karakteri aşamaz").optional()
})

export const RegisterSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z.string()
    .min(8, "Şifre en az 8 karakter olmalıdır")
    .regex(/[A-Z]/, "En az bir büyük harf içermelidir")
    .regex(/[0-9]/, "En az bir rakam içermelidir"),
  company_name: z.string().min(2).max(255),
  tax_number: z.string()
    .regex(/^\d{10,11}$/, "Vergi numarası 10 veya 11 haneli olmalıdır")
    .optional(),
  phone: z.string()
    .regex(/^(\+90|0)?[0-9]{10}$/, "Geçerli bir telefon numarası girin")
    .optional()
})
```

---

## 16. Ortam Değişkenleri (`.env.local`)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx        # Sadece server-side

# Google APIs
GEMINI_API_KEY=AIzaxxx
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaxxx  # Maps embed için

# Email
RESEND_API_KEY=re_xxx
FROM_EMAIL=bildirim@platform.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Güvenlik Kuralları:**
- `NEXT_PUBLIC_` prefix'i sadece client'ta güvenli paylaşılabilecek değerler için
- `GEMINI_API_KEY` ve `SUPABASE_SERVICE_ROLE_KEY` asla client'a expose edilmez
- Tüm AI çağrıları Next.js API Route'larından yapılır (client-side değil)

---

## 17. Responsive Tasarım Breakpoint'leri

```typescript
// Tailwind breakpoints:
// sm:  640px  — büyük telefon
// md:  768px  — tablet
// lg:  1024px — laptop
// xl:  1280px — desktop

// Kritik layout değişimleri:
// /matches/[sessionId] — lg altında: liste üstte, harita altta (tam genişlik)
// /analysis/[sessionId] — md altında: tek kolon
// /upload — tüm ekranlarda tek kolon (kart genişliği max-w-2xl, merkez)
```

---

## 18. Performans Notları

```
Görsel upload: Client-side compress (browser-image-compression lib) → max 2MB, 1920px
Gemini çağrısı: Timeout 30s, retry 1 kez
Maps embed: Lazy load (IntersectionObserver ile görünür olduğunda yükle)
Stats API: Next.js ISR (revalidate: 60)
DB sorguları: matches tablosunda composite index (session_id + match_score)
```

---

## 19. MVP Dışı (v2 için)

```
[ ] Mobil uygulama (React Native)
[ ] Gerçek zamanlı bildirimler (Supabase Realtime)
[ ] Fatura / ödeme entegrasyonu (iyzico)
[ ] Admin paneli (analiz moderasyonu, kullanıcı yönetimi)
[ ] KOBİ için abonelik planları (Freemium vs Pro)
[ ] Çoklu dil desteği (EN/TR)
[ ] API webhook'ları (alıcı ERP sistemleri için)
[ ] Karbon sertifikası PDF oluşturma
```