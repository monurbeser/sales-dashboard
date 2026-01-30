# Satış Dashboard - 2026

Satış yöneticileri için performans takip ve dashboard uygulaması.

## Özellikler (Faz 1)

✅ **Satış Yöneticisi Yönetimi**
- Yönetici ekleme, düzenleme, silme
- Listeleme ve detay görüntüleme

✅ **Hedef Yönetimi**
- 2026 yılı için aylık hedef girişi
- 12 aylık grid yapısı
- Bulk kaydetme (upsert mantığı)

✅ **Gerçekleşme Yönetimi**
- 2026 yılı için aylık gerçekleşme girişi
- 12 aylık grid yapısı
- Bulk kaydetme

✅ **Dashboard**
- **Kişisel Performans:**
  - Yıl hedefi, gerçekleşme, başarı yüzdesi kartları
  - Q1-Q4 başarı yüzdeleri
  - Gauge chart (renk skalası: kırmızı-sarı-yeşil)
  - Aylık bar chart (hedef vs gerçekleşme)

- **Ekip Performansı:**
  - Ekip toplam hedef, gerçekleşme, başarı
  - Ekip gauge chart
  - Ekip aylık bar chart
  - Kişi bazlı karşılaştırma tablosu

✅ **Veri Doğrulama**
- Boş ad soyad kontrolü
- Negatif tutar kontrolü
- Zod ile validasyon

✅ **UI/UX**
- TailwindCSS + shadcn/ui
- Türkçe para formatı (1.234.567,89 TL)
- Loading, empty, error state'ler
- Toast bildirimleri
- Responsive tasarım (masaüstü öncelikli)

## Teknoloji Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** TailwindCSS, shadcn/ui
- **Charts:** Recharts
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Deployment:** Vercel

## Kurulum

### Gereksinimler

- Node.js 18+
- PostgreSQL veritabanı (local veya yönetilen: Neon, Supabase, vb.)
- npm veya yarn

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. Environment Variables

`.env.local` dosyası oluşturun:

```bash
cp .env.example .env.local
```

`.env.local` içeriğini düzenleyin:

```env
# Local PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/sales_dashboard?schema=public"

# Veya yönetilen servis (Neon örneği)
# DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/sales_dashboard?sslmode=require"
```

### 3. Veritabanı Kurulumu

```bash
# Prisma migration çalıştır
npm run prisma:migrate

# Seed verilerini ekle (3 yönetici + örnek data)
npm run prisma:seed
```

### 4. Development Server Başlat

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## Veritabanı Yönetimi

### Prisma Studio

Veritabanını görsel olarak yönetmek için:

```bash
npm run prisma:studio
```

`http://localhost:5555` adresinde açılır.

### Yeni Migration

Schema değişikliği yapıldığında:

```bash
npm run prisma:migrate
```

## Deployment (Vercel)

### 1. Vercel Hesabı ve Proje

1. [Vercel](https://vercel.com) hesabı oluşturun
2. GitHub/GitLab reposuna push yapın
3. Vercel'de "New Project" ile repoyu import edin

### 2. Database Seçimi

**Seçenek A: Neon (Önerilen)**

1. [Neon](https://neon.tech) hesabı oluşturun
2. Yeni PostgreSQL database oluşturun
3. Connection string alın

**Seçenek B: Supabase**

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni proje oluşturun
3. Connection pooling string alın

### 3. Environment Variables (Vercel)

Vercel projesinde Settings > Environment Variables:

```
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

### 4. Deploy

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

Vercel otomatik deploy yapacaktır.

### 5. Veritabanı Seed (Production)

İlk deploy sonrası seed çalıştırmak için:

```bash
# Vercel CLI ile
vercel env pull
npm run prisma:seed
```

Veya Vercel dashboard'dan manuel SQL çalıştırabilirsiniz.

## Proje Yapısı

```
sales-dashboard/
├── prisma/
│   ├── schema.prisma          # Veritabanı modeli
│   ├── migrations/            # Migration dosyaları
│   └── seed.ts                # Seed script
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/              # API routes
│   │   ├── managers/         # Manager pages
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home (redirect)
│   ├── components/
│   │   ├── ui/               # shadcn components
│   │   ├── layout/           # Layout components
│   │   ├── managers/         # Manager components
│   │   ├── targets/          # Target components
│   │   ├── actuals/          # Actual components
│   │   └── dashboard/        # Dashboard components
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client
│   │   ├── utils.ts          # Utilities
│   │   ├── calculations.ts   # Business logic
│   │   ├── formatters.ts     # Currency formatters
│   │   └── validations.ts    # Zod schemas
│   └── types/
│       └── index.ts          # TypeScript types
└── README.md
```

## API Endpoints

### Managers

- `GET /api/managers` - Tüm yöneticileri listele
- `POST /api/managers` - Yeni yönetici ekle
- `GET /api/managers/[id]` - Yönetici detay
- `PUT /api/managers/[id]` - Yönetici güncelle
- `DELETE /api/managers/[id]` - Yönetici sil

### Targets

- `GET /api/targets/bulk?managerId=xxx&year=2026` - Hedefleri getir
- `PUT /api/targets/bulk` - 12 aylık hedefi kaydet

### Actuals

- `GET /api/actuals/bulk?managerId=xxx&year=2026` - Gerçekleşmeleri getir
- `PUT /api/actuals/bulk` - 12 aylık gerçekleşmeyi kaydet

## Seed Verileri

Seed çalıştırıldığında:

- 3 satış yöneticisi (Ahmet Yılmaz, Ayşe Demir, Mehmet Kaya)
- Her biri için çeşitli aylarda hedef ve gerçekleşme
- Dashboard'da görüntülenebilir örnek veriler

## Testing

### Manuel Test Senaryoları

1. **Yönetici İşlemleri:**
   - Yeni yönetici ekle
   - Yönetici düzenle
   - Yönetici sil

2. **Hedef Girişi:**
   - 12 ay için hedef gir
   - Bazı ayları boş bırak
   - Kaydet ve kontrol et

3. **Gerçekleşme Girişi:**
   - Hedeflerin olduğu aylara gerçekleşme gir
   - Yüzdelerin doğru hesaplandığını kontrol et

4. **Dashboard:**
   - Kartların doğru değerleri gösterdiğini kontrol et
   - Gauge'in renk değiştirdiğini kontrol et
   - Chart'ların doğru veri gösterdiğini kontrol et

## Faz 2 Planı (Gelecek Özellikler)

- [ ] Yıl seçimi (2025, 2026, 2027)
- [ ] Quarter drill-down
- [ ] Gelişmiş filtreler
- [ ] Aylık yüzde trend grafiği
- [ ] Kişi sıralama tablosu
- [ ] CSV import/export

## Faz 3 Planı (SaaS)

- [ ] Authentication (NextAuth/Clerk)
- [ ] Multi-tenant (workspace kavramı)
- [ ] Rol bazlı yetkilendirme
- [ ] Audit log
- [ ] Advanced analytics

## Sorun Giderme

### Build Hatası

```bash
# Cache temizle
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Hatası

- CONNECTION_STRING'in doğru olduğunu kontrol edin
- SSL mode gerekiyorsa `?sslmode=require` ekleyin
- Database'in erişilebilir olduğunu kontrol edin

### Migration Hatası

```bash
# Schema resetle (dikkat: tüm veriyi siler!)
npx prisma migrate reset
```

## Lisans

MIT

## Destek

Sorularınız için issue açabilirsiniz.
