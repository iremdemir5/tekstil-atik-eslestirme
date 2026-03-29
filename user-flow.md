# Akıllı Atık Eşleştirme Platformu — Kullanıcı Akışı

Bu doküman, PRD’de tanımlanan ekranlar ve roller için **basit, adım adım** kullanıcı yolculuklarını özetler: kullanıcı ne görür, ne yapar, sonuç ne olur.

---

## 1. Giriş yapmamış ziyaretçi

1. **Uygulamayı açar** → Ana sayfa (`/`) açılır.
2. **Görür:** Üstte logo, “Giriş Yap” ve “Kayıt Ol”; hero başlık ve alt metin; “Ücretsiz Analiz Başlat” butonu; platform istatistikleri (yönlendirilen atık, kayıtlı alıcı, önlenen karbon); “Nasıl çalışır?” üç adımı; kayıtlı alıcıların logo bandı; footer linkleri (Hakkımızda, KVKK, İletişim).
3. **Yapar:** “Ücretsiz Analiz Başlat”a tıklar (veya doğrudan korumalı bir URL dener).
4. **Sonuç:** Oturum yoksa **kayıt** veya **giriş**e yönlendirilir (`/register` veya `/login?redirect=/upload`). Analiz veya yükleme sayfasına doğrudan gidemez; önce kimlik doğrulama gerekir.

---

## 2. KOBİ (üretici) — kayıt ve ilk analiz

1. **Kayıt olur** → `/register` üzerinde e-posta, şifre, şirket bilgileri, vergi numarası, telefon ve şehir/ilçe girer; rol **üretici (producer)** olur.
2. **Sonuç (e-posta doğrulama):** E-postayı onayladıktan sonra sisteme giriş yapabilir; akış **veri girişi** sayfasına (`/upload`) yönlendirilebilir.
3. **Veri girişi** → Fotoğraf sürükleyip bırakır veya seçer (en az 1, en fazla 3 görsel); tahmini miktarı (kg veya ton) ve konumu (il / ilçe) doldurur.
4. **Yapar:** “AI Analizini Başlat”a basar.
5. **Görür:** Yükleme sırasında tam ekran yükleme durumu; kısa aralıklarla değişen bilgi mesajları (görsel yükleniyor, AI analiz ediyor, vb.) ve ilerleme çubuğu (görsel amaçlı).
6. **Sonuç (başarılı):** Analiz tamamlanır; kullanıcı **analiz sonuç sayfasına** (`/analysis/[sessionId]`) gider veya yönlendirilir.

---

## 3. KOBİ — analiz sonuçlarını okuma

1. **Görür:** Polimer dağılımı (ör. pasta grafik), R değeri, geri dönüştürülebilirlik ve saflık skorları, önerilen kullanım alanı, önlenen CO₂ ve araba yolculuğu denkliği; açılır bölümlerde AI açıklaması ve eğitici metin.
2. **Yapar:** “Uygun Fabrikaları Gör” veya “Yeni Analiz Yap” seçeneklerinden birini kullanır.
3. **Sonuç:** “Uygun Fabrikaları Gör” → **eşleştirme sayfası** (`/matches/[sessionId]`). “Yeni Analiz Yap” → tekrar **`/upload`**.

---

## 4. KOBİ — fabrika eşleşmeleri ve teklif

1. **Görür:** Solda (veya mobilde üstte) en fazla **5** fabrika kartı: isim, şehir, eşleşme yüzdesi, mesafe, ihtiyaç tipi, talep özeti; bir kart seçilince sağda (veya altta) haritada kendi konumu ile fabrika arasında rota ve süre tahmini.
2. **Yapar:** Uygun bir fabrikada “Teklif Gönder”e basar; açılan pencerede isteğe bağlı fiyat, müsait tarih (en az birkaç gün sonrası), not ve bilgi paylaşım onayını doldurur; gönderir.
3. **Sonuç (başarılı):** Bildirim görür; pencere kapanır; ilgili kart **teklif gönderildi** durumuna geçer. Fabrikaya e-posta ile haber gider (PRD’de tanımlı bildirim akışı).

---

## 5. KOBİ — geçmiş ve profil

1. **Geçmiş analizler** → `/history`: Önceki oturumların listesini (tarih, miktar, şehir, durum, eşleşme sayısı özeti) sayfalı olarak görür; bir kayda tıklayarak ilgili analiz veya eşleşme ekranına gidebilir (uygulama bağlantılarına göre).
2. **Profil** → `/profile`: Şirket ve iletişim bilgilerini görüntüler veya günceller (PRD kapsamındaki alanlar).

---

## 6. Alıcı (buyer) — kayıt ve hesap durumu

1. **Kayıt olur** → Şirket ve iletişim bilgileri, konum, **fabrika tipi** ve **ihtiyaç profili** (isten polimerler, miktar aralığı, mesafe, isteğe bağlı R değeri vb.) ile kaydı tamamlar; rol **alıcı (buyer)** olur.
2. **Sonuç:** Hesap **onay bekliyor** durumunda kalır; platform yöneticisi onaylayana kadar tam erişim olmayabilir (PRD: spam önlemi, admin onayı).
3. **Onay sonrası:** Hesap **aktif** olur; alıcı **alıcı paneline** (`/buyer-dashboard`) erişebilir.

---

## 7. Alıcı — teklifleri yönetme

1. **Görür:** Aktif ihtiyaç profiline gelen teklifler: KOBİ adı başta **anonim**; analiz özeti (polimer, miktar, şehir), eşleşme skoru.
2. **Yapar:** “İncele & Kabul Et” veya “Reddet” seçer.
3. **Sonuç:**  
   - **Kabul:** Anlaşma durumu güncellenir; taraflara iletişim bilgileri paylaşımı e-posta ile bildirilir (PRD lifecycle).  
   - **Red:** Üreticiye red bildirimi gider; üretici başka fabrikalara teklif gönderebilir.

---

## 8. Alıcı — profil ve tercihler

1. **Görür / yapar:** İhtiyaç profilini kayıttaki forma benzer şekilde günceller; bildirim tercihlerinde e-posta aç/kapat (PRD Bölüm 6).

---

## 9. Ortak durumlar (kısa)

| Durum | Kullanıcı ne yaşar |
|--------|---------------------|
| Korumalı sayfaya oturumsuz giriş | Giriş sayfasına yönlendirilir; sonra istenen sayfaya dönebilir (`redirect`). |
| Analiz başarısız / düşük güven | Hata veya yeniden fotoğraf yükleme isteği; açıklayıcı mesajlar (PRD hata metinleri). |
| Günlük analiz limiti | “Limit doldu” mesajı; ertesi gün tekrar deneme. |
| Uygun alıcı yok | Eşleşme listesi boş veya bilgilendirici mesaj; ileride yeni alıcılarla tekrar deneme beklentisi. |

---

## 10. Özet: mutlu yol (KOBİ)

**Aç** → Landing’i gör → **Kayıt / giriş** → **Fotoğraf + miktar + konum** gönder → **Yükleme ekranı** → **Analiz sonuçları** → **Eşleşen fabrikalar + harita** → **Teklif gönder** → (Alıcı tarafında inceleme) → **Kabul** ile iletişim kurulur ve süreç ilerler.

---

## 11. Özet: mutlu yol (alıcı)

**Kayıt + ihtiyaç profili** → **Admin onayı** → **Panelde teklifleri gör** → **Kabul veya red** → Kabulde **KOBİ ile iletişim** ve anlaşmanın tamamlanması (manuel tamamlama / süreç adımları PRD deal lifecycle ile uyumludur).

---

*Kaynak: `prd.md` — Ekran 1–4, Auth, Buyer Flow, Deal Lifecycle, Error Handling.*
