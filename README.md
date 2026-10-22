# 2. TALPA Uçuş Emniyet Forumu – Tanıtım ve Kayıt Sitesi

1–2 Aralık 2026 tarihlerinde SHGM Türk Sivil Havacılık Akademisi'nde (İstanbul) düzenlenecek **2. TALPA Uçuş Emniyet Forumu ve TALPA-MDA Sempozyumu** için tanıtım sayfası, katılım formu ve kayıt yönetim paneli (Next.js 14).

| Adres | Kim kullanır | Giriş |
|---|---|---|
| `/` | Ziyaretçiler | – |
| `/admin` | TALPA organizasyon ekibi | `ADMIN_USERNAME` / `ADMIN_PASSWORD` |

## Tanıtım sayfası
Forum hakkında, iki günlük program (Pozitif Emniyet Kültürü, TALPA-MDA, GNSS/TCAS Spoofing & Jamming, FTL/FRMS), kimler katılmalı, tarih/mekân ve kayıt formu. Afiş `public/forum-afis.jpg`, sosyal medya önizleme görseli `public/forum-banner.jpg`. Metinlerin tamamı `src/app/page.tsx`, tarih/mekân bilgileri `src/lib/constants.ts → EVENT` içindedir.

## Kayıt formu
Ad soyad, e-posta, telefon, iş ünvanı (listeden veya "Diğer" ile serbest metin), firma/kurum, katılınacak gün(ler) ve KVKK onayı. Aynı e-posta ile ikinci kayıt engellenir. Web formundan gelen kişiler **Katılımcı** rolüyle kaydedilir. Ünvan listesi `JOB_TITLES` içindedir.

## Kayıt paneli (`/admin`)
- Tüm kayıtlar; isim, e-posta, telefon, ünvan, kurum veya nota göre arama
- Rol sayaçları aynı zamanda filtre: **Katılımcı · Konuşmacı · Protokol · Görevli**
- Tablodan tek tıkla rol değiştirme ve etkinlik günü "giriş yaptı" işareti
- **Kişi Ekle** ile manuel kayıt (yalnızca ad soyad zorunlu; protokol misafirleri için e-posta/telefon boş bırakılabilir), not alanı
- Düzenleme ve silme
- Filtrelenmiş listeyi Excel'de açılan CSV olarak indirme

## Vercel'de yayınlama
1. Klasörü GitHub'a gönderin, Vercel'de **Import Project** ile içe aktarın.
2. **Storage › Create › Blob** ile bir Blob deposu oluşturup projeye bağlayın (erişim: **Private**). `BLOB_READ_WRITE_TOKEN` otomatik tanımlanır. Blob olmadan Vercel'de kayıtlar kalıcı olmaz. Tazminat projesiyle aynı depo kullanılabilir; bu proje yalnızca `forum/` önekini kullanır.
3. **Settings › Environment Variables**: `ADMIN_USERNAME`, `ADMIN_PASSWORD` (güçlü bir şifre), `SESSION_SECRET` (en az 32 karakter; ör. `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`).
4. Deploy edin.

## Yerel geliştirme
```bash
npm install
cp .env.example .env.local   # değerleri doldurun
npm run dev
```
`BLOB_READ_WRITE_TOKEN` tanımlı değilse kayıtlar `./data/store/forum/` klasörüne yazılır (git'e eklenmez).

## Logo
Başlık ve paneldeki amblem `public/talpa-logo.svg` dosyasıdır; resmi TALPA logosu aynı isimle değiştirilebilir.
