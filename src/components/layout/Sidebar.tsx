'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Target, TrendingUp, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Satış Yöneticileri', href: '/managers', icon: Users },
  { name: 'Dashboard', href: '/managers', icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-gray-50">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-gray-900">
          Satış Dashboard
        </h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-gray-900' : 'text-gray-500'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4">
        <p className="text-xs text-gray-500">Satış Dashboard v1.0</p>
        <p className="text-xs text-gray-400">Yıl: 2026</p>
      </div>
    </div>
  )
}
