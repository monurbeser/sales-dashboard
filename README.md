# Sales Dashboard (2026)

2026 yılı için satış yöneticilerinin hedef ve gerçekleşmelerini yöneten Next.js uygulaması.

## Faz 1 Çıktısı (MVP)
- Satış yöneticisi CRUD (API + UI)
- Hedef ve gerçekleşme bulk girişi (12 ay grid)
- Dashboard: kişi bazlı kartlar, gauge, bar chart; ekip toplam kartlar
- Prisma schema + migration
- Seed ve smoke test

## Gereksinimler
- Node.js 18+
- PostgreSQL (Supabase, Neon vb.)

## Kurulum
```bash
npm install
```

### Ortam değişkenleri
`.env` dosyası oluşturun:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public"
```

### Prisma
```bash
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
```

### Uygulamayı çalıştırma
```bash
npm run dev
```

### Smoke test
```bash
npm run smoke
```

## Deploy (Vercel önerilir)
1. Repo’yu Vercel’a bağlayın.
2. `DATABASE_URL` ortam değişkenini ekleyin.
3. Build komutu: `npm run build`.
4. İlk deploy sonrası veritabanı migration için `npm run prisma:migrate` çalıştırın (Vercel dashboard veya CI aşaması).

## Faz 2 (Plan)
- Yıl seçimi (2025/2026/2027)
- Quarter drill-down
- Filtrelenebilir ekip ve kişi görünümleri
- Zengin grafikler (aylık yüzde trend, sıralama tablosu)

## Faz 3 (Plan)
- Auth (NextAuth/Clerk)
- Multi-tenant workspace
- Rol bazlı yetkilendirme
- Audit log
- CSV import/export
