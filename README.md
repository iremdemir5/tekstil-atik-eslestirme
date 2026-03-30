# ♻️ Tekstil Atık Eşleştirme Platformu

Tekstil atıklarını yapay zeka ile analiz ederek sürdürülebilir geri dönüşüm süreçlerine kazandıran, modern ve yenilikçi bir eşleştirme platformu.

---

## 🚀 Proje Hakkında

Bu proje, tekstil atıklarını **Gemini Vision** desteğiyle analiz eder ve atığın niteliğine göre  
**yalıtım malzemesi üretimi gibi sürdürülebilir geri dönüşüm süreçleri** için uygun alıcı firmalarla eşleştirilmesini hedefler.

Platformun temel amacı:

- 🌱 Atıkların çevresel etkisini azaltmak  
- 🤖 Yapay zeka ile hızlı ve doğru sınıflandırma yapmak  
- 🏭 Üretici ile geri dönüşüm/alıcı firmaları verimli şekilde buluşturmak  

---

## 🧰 Kullanılan Teknolojiler

Projede aşağıdaki teknolojiler kullanılmaktadır:

- **Next.js**
- **Supabase**
- **Gemini AI API**
- **Tailwind CSS**
- **Recharts**

---

## ⚙️ Kurulum Adımları

Projeyi yerel ortamda çalıştırmak için aşağıdaki adımları izleyin:

1. Depoyu klonlayın:

```bash
git clone <REPO_URL>
```

2. Proje klasörüne girin:

```bash
cd tekstil-atik-eslestirme/web
```

3. Bağımlılıkları yükleyin:

```bash
npm install
```

---

## 🔐 Çevre Değişkenleri

`web` klasörü içinde bir `.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> 💡 Not: Gerçek anahtarlarınızı güvenli tutun ve bu dosyayı versiyon kontrolüne eklemeyin.

---

## ▶️ Çalıştırma

Geliştirme ortamında projeyi başlatmak için:

```bash
npm run dev
```

Ardından tarayıcınızdan ilgili local adresi açarak uygulamayı kullanabilirsiniz.

---

## 🧠 Gerçek Veri Bazlı Eşleştirme

Eşleştirme modülünü gerçek firma verileriyle çalışacak şekilde genişletmek için hazırlanan teknik dokümana buradan ulaşabilirsiniz:

- `web/docs/gercek-veri-eslestirme.md`
- `web/supabase/schema.sql`

---

## 💚 Sürdürülebilir Gelecek İçin

Tekstil atıklarını ekonomik değere dönüştüren, çevre dostu ve teknoloji odaklı çözümler için bu platform sürekli geliştirilmektedir.