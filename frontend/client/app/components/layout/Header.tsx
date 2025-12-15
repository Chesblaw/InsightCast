'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useDisconnect } from '@starknet-react/core'
import {
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  BarChart3,
  Activity,
  PieChart,
  DollarSign,
  Heart,
  Newspaper,
  Search,
  Bell,
  PlusCircle,
} from 'lucide-react'

import ConnectModal from '../ui/ConnectWalletModal'
import { useAppContext } from '@/app/context/appContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const navLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: BarChart3, color: 'text-blue-600' },
  { label: 'Analytics', href: '/analytics', icon: Activity, color: 'text-blue-600' },
  { label: 'Sports', href: '/markets/sports', icon: PieChart, color: 'text-blue-600' },
  { label: 'Crypto', href: '/markets/crypto', icon: DollarSign, color: 'text-blue-600' },
  { label: 'Politics', href: '/markets/politics', icon: Newspaper, color: 'text-blue-600' },
  { label: 'Health', href: '/markets/health', icon: Heart, color: 'text-blue-600' },
]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isConnectModal, setIsConnectModal] = useState(false)

  const { address, status } = useAppContext()
  const { disconnect } = useDisconnect()
  const router = useRouter()

  const isConnected = status === 'connected'

  const handleDisconnect = () => {
    disconnect()
    localStorage.removeItem('connector')
    toast.info('Wallet disconnected')
    setIsDropdownOpen(false)
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 font-sans transition-all duration-300 bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div
              onClick={() => router.push('/')}
              className="flex cursor-pointer items-center gap-2"
            >
              <Image
                src="/insightcast-logo-2.png"
                alt="InsightCast"
                width={160}
                height={40}
                className="h-10 w-auto"
              />
              <span className="hidden sm:block text-sm font-semibold tracking-tight text-white">
                InsightCast
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative flex items-center gap-1 text-sm font-medium text-white hover:text-blue-400 transition-colors group"
                  >
                    <Icon className={`h-4 w-4 ${link.color}`} />
                    {link.label}
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-blue-500 transition-all group-hover:w-full" />
                  </Link>
                )
              })}
            </nav>

            {/* Right Section */}
            <div className="hidden md:flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                <Input
                  placeholder="Search…"
                  className="pl-9 h-9 w-56 rounded-full bg-black/20 border-none text-white text-sm"
                />
              </div>

              {/* Create Market Button beside Search */}
              {isConnected && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border-blue-500 text-blue-400 hover:bg-blue-500/10 transition"
                  onClick={() => router.push('/create-market')}
                >
                  <PlusCircle className="h-4 w-4" /> Create Market
                </Button>
              )}

              {/* Notifications */}
              <Button size="icon" variant="ghost" className="rounded-full text-white hover:text-blue-400">
                <Bell className="h-5 w-5" />
              </Button>

              {/* Wallet / User */}
              {isConnected ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {address?.slice(0, 4)}…{address?.slice(-4)}
                    </span>
                    <ChevronDown className="h-4 w-4 text-neutral-400" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-blue-600 bg-black shadow-lg">
                      <div className="px-4 py-3">
                        <p className="text-xs text-white/70">Connected wallet</p>
                        <p className="text-sm font-medium truncate text-white">{address}</p>
                      </div>
                      <div className="border-t border-blue-600" />
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:text-blue-400"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                      <button
                        onClick={handleDisconnect}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:text-red-400"
                      >
                        <LogOut className="h-4 w-4" /> Disconnect
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => setIsConnectModal(true)}
                  className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm"
                >
                  Connect Wallet
                </Button>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden rounded-lg p-2 text-white hover:text-blue-400"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-blue-600 bg-black text-white">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="relative flex items-center gap-2 text-sm text-blue-400 hover:text-white group"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full bg-blue-500 transition-all group-hover:w-full" />
                  </Link>
                )
              })}

              {!isConnected ? (
                <Button
                  onClick={() => {
                    setIsConnectModal(true)
                    setIsMenuOpen(false)
                  }}
                  className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                >
                  Connect Wallet
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/create-market')}
                    className="w-full rounded-full mb-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 transition"
                  >
                    <PlusCircle className="h-4 w-4" /> Create Market
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDisconnect()
                      setIsMenuOpen(false)
                    }}
                    className="w-full rounded-full text-red-500 hover:text-red-400"
                  >
                    Disconnect
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {isConnectModal && <ConnectModal onClose={() => setIsConnectModal(false)} />}

      {/* Spacer */}
      <div className="h-16" />
    </>
  )
}

export default Header
