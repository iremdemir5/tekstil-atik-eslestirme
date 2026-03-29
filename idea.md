# idea.md - AI Destekli Tekstil Atığı ve Isı Yalıtımı Eşleştirme Platformu

## 1. Problem Tanımı
[cite_start]Türkiye'de tekstil atıklarının geri dönüşüm oranı sadece %6 seviyesindedir[cite: 42]. Özellikle 50.000'den fazla tekstil KOBİ'si, atıklarını teknik analiz (polimer ayrıştırma) ve dijital eşleştirme eksikliği nedeniyle verimli yönetememekte; yıllık ~1 milyon ton hammadde potansiyeli çöpe gitmektedir.

## 2. Kullanıcı Profil Analizi
- **Tedarikçiler (Atık Sahipleri):** Türkiye genelindeki (özellikle İstanbul ve Çorlu odaklı) 50.000+ tekstil atölyesi ve KOBİ'si. Teknik analiz imkanı kısıtlı olan bu işletmeler, post-endüstriyel kesim artıklarını verimli sınıflandıramamaktadır.
- **Alıcılar (Endüstriyel Üreticiler):** Başta Uşak bölgesinde (Türkiye'nin geri dönüşüm üssü) günlük 1.700 ton kapasiteyle çalışan 180+ geri dönüşüm fabrikası (Örn: Ergene Recycling, Özbudak Textile). Bu tesisler, yalıtım malzemesi üretimi için sürekli ve analiz edilmiş hammaddeye ihtiyaç duyar.
- **Uygulama Aracısı:** EU Green Deal regülasyonlarına uyum sağlamaya çalışan marka yöneticileri ve belediye atık yönetim birimleri.

## 3. AI (Yapay Zeka) Çözüm Mimarisi
[cite_start]Gemini API kullanılarak platformun merkezine iki kritik yapay zeka işlevi yerleştirilir[cite: 42]:
1. **Teknik Analiz Motoru:** Fotoğraftan kumaş türü tahmini yapılır. Mevcut rakiplerden farklı olarak AI, kumaşın polimer yapısından yalıtım malzemesi için **termal iletkenlik (k)** ve **termal direnç (R)** değerlerini tahmin ederek manuel laboratuvar testi ihtiyacını %20+ azaltır.
2. **Akıllı Eşleştirme ve Lojistik:** Atık türünü alıcının teknik ihtiyacıyla eşleştirir ve lojistik maliyetlerini/karbon ayak izini minimize eden rota optimizasyonu sağlar.

## 4. Boşluk Analizi ve Bizim Farkımız
Rakiplerde (Swatchloop, Reverse Resources, SuperCircle) AI kullanımı olsa da yalıtım odaklı derinlik eksiktir:
- **Teknik Veri Boşluğu:** Rakipler kumaş sınıflandırması yapsa da yalıtım üretimi için gereken mühendislik değerlerini (R-değeri, termal iletkenlik) hesaplamaz. Bizim modelimiz, rakiplerde olmayan yalıtım odaklı AI hesaplama modeliyle fark yaratır.
- **KOBİ Odaklılık:** Mevcut platformlar dev markalara odaklanırken, çözümümüz Türkiye'nin üretim bel kemiği olan KOBİ'lerin atıklarını doğrudan endüstriyel ileri dönüşüm rotasına sokar.
- **Dinamik Eşleştirme:** Atığın türü ile fabrikaların anlık teknik hammadde ihtiyacını eşleştirerek ulusal geri dönüşüm oranını yukarı çekmeyi hedefler.

## 5. Detaylı Rakip Tablosu
| Şirket | Ülke / Özellik | Ana Hizmet |
| :--- | :--- | :--- |
| **Reverse Resources** | Küresel | 360° traceability ile atık takibi ve ticaret; 100+ fabrika kullanımı. |
| **SuperCircle** | ABD / Küresel | AI ters lojistik; markaları geri dönüşümle eşleştirme, 6M+ tekstil kurtarımı. |
| **Recovo** | Avrupa | Fazla kumaş B2B pazar yeri; SaaS envanter yönetimi, döngüsel ekonomi. |
| **Swatchloop** | Türkiye | AI sınıflandırma/dijital ikiz; 500+ etiketle uçtan uca yönetim. |

## 6. SWOT Analizi
| GÜÇLÜ YÖNLER | ZAYIF YÖNLER |
| :--- | :--- |
| Benzersiz AI yalıtım hesaplama modeli | Başlangıç aşamasında ağ etkisinin yavaşlığı |
| Türkiye'nin 50K+ KOBİ bolluğu avantajı | KVKK ve lojistik entegrasyon ihtiyacı |
| **FIRSATLAR** | **TEHDİTLER** |
| Yalıtım pazarı %15 CAGR büyüme hızı | Swatchloop gibi yerel rakiplerin büyümesi |
| AB Yeşil Mutabakat (EU Green Deal) fonları | Ekonomik dalgalanmalar ve regülasyonlar |

## 7. Başarı Kriterleri
- [cite_start]Bir KOBİ'nin 30 saniye içinde teknik yalıtım potansiyeli verisine ulaşması[cite: 42].
- Türkiye'deki tekstil geri dönüşüm oranının dijital eşleştirme ile %6'nın üzerine çıkarılmasına katkı sağlamak.
