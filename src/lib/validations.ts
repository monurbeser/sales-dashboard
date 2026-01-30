import { z } from 'zod'

// Sales Manager validation
export const salesManagerSchema = z.object({
  fullName: z.string().min(1, 'Ad Soyad boş bırakılamaz').trim(),
})

export type SalesManagerInput = z.infer<typeof salesManagerSchema>

// Sales Target validation
export const salesTargetSchema = z.object({
  managerId: z.string().uuid('Geçersiz yönetici ID'),
  year: z.number().int().min(2020).max(2030),
  month: z.number().int().min(1).max(12),
  amount: z.number().nonnegative('Tutar negatif olamaz'),
})

export type SalesTargetInput = z.infer<typeof salesTargetSchema>

// Sales Actual validation
export const salesActualSchema = z.object({
  managerId: z.string().uuid('Geçersiz yönetici ID'),
  year: z.number().int().min(2020).max(2030),
  month: z.number().int().min(1).max(12),
  amount: z.number().nonnegative('Tutar negatif olamaz'),
})

export type SalesActualInput = z.infer<typeof salesActualSchema>

// Bulk update for targets/actuals (12 months)
export const bulkMonthlyDataSchema = z.object({
  managerId: z.string().uuid('Geçersiz yönetici ID'),
  year: z.number().int().min(2020).max(2030),
  data: z.array(
    z.object({
      month: z.number().int().min(1).max(12),
      amount: z.number().nonnegative('Tutar negatif olamaz').nullable(),
    })
  ).length(12, '12 ay verisi gerekli'),
})

export type BulkMonthlyDataInput = z.infer<typeof bulkMonthlyDataSchema>
