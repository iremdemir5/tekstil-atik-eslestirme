# Gercek Veri Tabanli Eslestirme

Bu dokuman, platformda eslestirilen uretici ve alici firmalarin gercek verilere dayandirilmasi icin uygulanan temel tasarimi aciklar.

## 1) Supabase veri modeli

SQL semasi: `web/supabase/schema.sql`

Ana tablolar:

- `companies`: Tum firma kimlik ve iletisim bilgileri (vergi no, MERSIS, konum, aktiflik)
- `company_documents`: Firma belgeleri ve dogrulama durumlari
- `producer_profiles`: Ureticiye ozel alanlar (ortalama atik miktari, dogrulama seviyesi)
- `buyer_profiles`: Alici kabul kriterleri ve kapasite bilgileri
- `match_candidates`: Her analiz oturumu icin hesaplanan aday eslesmeler ve puan kirilimi

## 2) Dogrulama akisi

1. Firma kayit olur (`companies`)
2. Belgeler yuklenir (`company_documents`)
3. Operasyon ekibi belgeyi inceleyip `verification_status` gunceller
4. Dogrulama tamamlandiginda alici profilinde `is_verified = true` set edilir
5. Eslesme algoritmasi, dogrulanmamis firmalari daha dusuk uyum puani ile degerlendirir

## 3) Puanlama formulu

Uygulama kodu: `web/src/lib/matching-score.ts`

Toplam skor (0-100):

```text
total =
  material_score   * 0.30 +
  capacity_score   * 0.25 +
  distance_score   * 0.20 +
  compliance_score * 0.15 +
  trust_score      * 0.10
```

Skor bilesenleri:

- `material_score`: Gemini tarafindan onerilen kullanimin alici profiliyle uyumu
- `capacity_score`: Parti agirligi + min/maks lot + aylik kapasite uygunlugu
- `distance_score`: Uretici ve alici arasindaki mesafenin servis yaricapi icindeki durumu
- `compliance_score`: Uyum puani ve firma dogrulama seviyesi
- `trust_score`: kalite, guvenilirlik, uyum puanlarinin ortalamasi

## 4) API uzerinden kullanim

Endpoint: `GET /api/matches/:sessionId`

Akis:

1. `analysis_sessions` kaydi okunur
2. `buyer_profiles + companies` bilgileri cekilir
3. Her alici icin puan hesaplanir
4. En yuksek skorlu ilk 10 sonuc donulur

Bu endpoint, tablolar olusmadan cagrilirsa `SCHEMA_NOT_READY` doner. Bu sayede asamali gecis guvenli sekilde yapilir.
