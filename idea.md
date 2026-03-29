# idea.md - AI Destekli Tekstil Atığı ve Isı Yalıtımı Eşleştirme Platformu

## 1. Problem Tanımı
Türkiye'de tekstil atıklarının geri dönüşüm oranı sadece %6 seviyesindedir. Özellikle 50.000'den fazla tekstil KOBİ'si, atıklarını teknik analiz (polimer ayrıştırma) ve dijital eşleştirme eksikliği nedeniyle verimli yönetememektedir. Yıllık ~1 milyon ton tekstil atığı hammadde potansiyeli taşırken, bu potansiyel dijitalleşme eksikliği nedeniyle çöpe gitmektedir.

## 2. Kullanıcı Profil Analizi
- **Tedarikçiler:** Türkiye genelindeki (özellikle İstanbul ve Çorlu odaklı) tekstil atölyeleri ve KOBİ'ler.
- **Alıcılar:** Uşak gibi bölgelerde günlük 1.700 ton kapasiteyle çalışan geri dönüşüm tesisleri (Örn: Ergene Recycling, Özbudak Textile) ve yalıtım malzemesi üreticileri.

## 3. AI (Yapay Zeka) Çözüm Mimarisi
Gemini API kullanılarak platformun merkezine iki kritik yapay zeka işlevi yerleştirilir:
1. **Teknik Analiz Motoru:** Fotoğraftan kumaş türü tahmini yapılır. Mevcut rakiplerden farklı olarak, AI bu verilerle yalıtım malzemesi için "termal iletkenlik" ve "R-değeri" hesaplaması yaparak manuel test ihtiyacını ortadan kaldırır.
2. **Akıllı Eşleştirme ve Lojistik:** Atık türünü alıcının teknik ihtiyacıyla eşleştirir ve lojistik maliyetlerini/karbon ayak izini minimize eden rota optimizasyonu sağlar.

## 4. Detaylı Rakip ve Pazar Analizi

### Doğrudan Rakipler
| Şirket | Odak Noktası | Ana Hizmet |
| :--- | :--- | :--- |
| **Reverse Resources** | Küresel Ticaret | 360° Traceability (İzlenebilirlik) ve atık takibi. |
| **SuperCircle** | AI Ters Lojistik | Markaları geri dönüşümle eşleştirme (ABD odaklı). |
| **Swatchloop (TR)** | AI Sınıflandırma | 500+ etiketle dijital ikiz yaratma. |
| **Recovo** | B2B Pazar Yeri | Fazla kumaşlar için SaaS envanter yönetimi. |

### Boşluk Analizi (Bizim Farkımız)
Rakiplerde AI kullanımı olsa da yalıtım odaklı derinlik eksiktir:
- **Teknik Analiz Boşluğu:** Swatchloop kumaş tahmini yapsa da yalıtım değerleri (R-değeri, termal iletkenlik) hesaplama özelliği yoktur. Çözümümüz manuel testlere bağımlılığı %20+ oranında azaltır.
- **Lojistik Boşluğu:** KOBİ-endüstriyel tesisler arası dinamik rota optimizasyonu mevcut çözümlerde sınırlıdır.

## 5. SWOT Analizi
| GÜÇLÜ YÖNLER | ZAYIF YÖNLER |
| :--- | :--- |
| Benzersiz AI yalıtım hesaplama modeli | Başlangıç aşamasında veri toplama zorluğu |
| Türkiye'nin 50K+ KOBİ bolluğu avantajı | Ölçeklenme için lojistik entegrasyon ihtiyacı |
| **FIRSATLAR** | **TEHDİTLER** |
| Düşük geri dönüşüm oranı (%6) | Yerel rakiplerin (Swatchloop) büyümesi |
| Yalıtım pazarı %15 CAGR büyüme hızı | Belediye ve çevre regülasyonları |

## 6. Başarı Kriterleri
- Bir KOBİ'nin 30 saniye içinde teknik yalıtım potansiyeli verisine ulaşması.
- Türkiye'deki tekstil geri dönüşüm oranının dijitalleşme ile artırılmasına katkı sağlamak.
