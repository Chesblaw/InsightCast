'use client'

import React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SearchX, Sparkles, Layers } from 'lucide-react'

import Header from './components/layout/Header'
import MarketCard from './components/ui/MarketCard'
import Modal from './components/ui/Modal'
import PurchaseSection from './components/sections/PurchaseSection'

import { Button } from '@/components/ui/button'
import { useMarketDataDummy } from './hooks/useMarket'
import { Market } from './types'
import { useAppContext } from './context/appContext'

const Home = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || 'All'
  const { searchQuery } = useAppContext()

  const [tab, setTab] = React.useState<'active' | 'all'>('active')
  const [modalOpen, setModalOpen] = React.useState(false)
  const [selectedMarket, setSelectedMarket] = React.useState<Market | null>(null)
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null)

  const getHookCategory = (urlCategory: string) => {
    switch (urlCategory.toLowerCase()) {
      case 'crypto':
        return 'crypto' as const
      case 'sports':
        return 'sports' as const
      default:
        return 'all' as const
    }
  }

  const { predictions, loading, error, refetch } = useMarketDataDummy({
    category: getHookCategory(currentCategory),
  })

  const markets: Market[] = Array.isArray(predictions) ? predictions : []

  const isMarketClosed = (market: Market) => !market.is_open || market.is_resolved

  const filteredMarkets = React.useMemo(() => {
    let filtered = markets.filter((market) => {
      if (!searchQuery) return true
      return market.title?.toLowerCase().includes(searchQuery.toLowerCase())
    })

    if (tab === 'active') {
      filtered = filtered.filter((m) => !isMarketClosed(m))
    }

    return filtered
  }, [markets, searchQuery, tab])

  const handleMarketClick = (market: Market) => {
    if (!isMarketClosed(market)) {
      router.push(`/market/${market.market_id}`)
    }
  }

  const handleOptionSelect = (market: Market, option: string) => {
    setSelectedMarket(market)
    setSelectedOption(option)
    setModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#05080f] via-[#070b16] to-black text-neutral-200">
      <Header />

{/* HERO */}
<section className="pt-28 pb-12">
  <div className="mx-auto max-w-7xl px-6">
    <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent p-8 shadow-[0_0_60px_-15px_rgba(59,130,246,0.35)]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_60%)]" />
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
        Prediction Markets
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-400">
        Trade outcomes, explore sentiment, and participate in next‑generation
        on‑chain prediction markets.
      </p>

      {/* Tabs + Create Market Button */}
      <div className="mt-6 flex items-center gap-4">
        <div className="inline-flex rounded-2xl bg-black/40 p-1 ring-1 ring-white/10 backdrop-blur">
          {['active', 'all'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as 'active' | 'all')}
              className={`px-5 py-2 text-sm font-medium rounded-xl transition-all
                ${tab === t
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-[0_8px_30px_rgba(59,130,246,0.45)]'
                  : 'text-neutral-400 hover:text-white'}
              `}
            >
              {t === 'active' ? 'Active Markets' : 'All Markets'}
            </button>
          ))}
        </div>

        {/* Create Market Button */}
        <Button
          onClick={() => router.push('/create-market')}
          className="ml-auto bg-gradient-to-r from-blue-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
        >
          Create Market
        </Button>
      </div>
    </div>
  </div>
</section>


{/* MARKET GRID */}
<section className="pb-28">
  <div className="mx-auto max-w-7xl px-6">
    {loading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="
              h-72 rounded-2xl
              bg-gradient-to-br from-white/5 to-white/0
              ring-1 ring-white/10
              animate-pulse
            "
          />
        ))}
      </div>
    ) : error ? (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <SearchX className="h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-xl font-medium">Error loading markets</h3>
        <p className="text-sm text-neutral-400 mt-1">{error}</p>
        <Button
          onClick={refetch}
          className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600"
        >
          Try again
        </Button>
      </div>
    ) : filteredMarkets.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 perspective-[1600px]">
        {filteredMarkets.map((market) => {
          const isClosed = isMarketClosed(market)

          return (
            <div key={market.market_id} className="group relative">
              {/* Neon edge glow */}
              <div
                className="
                  absolute -inset-0.5 rounded-2xl
                  opacity-0 group-hover:opacity-100
                  bg-gradient-to-br from-blue-500/40 via-indigo-500/25 to-transparent
                  blur-xl transition duration-500
                "
              />

  {/* 3D Market Card */}
<div
  className={`
    relative h-full rounded-2xl bg-gradient-to-b from-[#0b1020] via-[#080c1a] to-[#05080f]
    ring-1 ring-white/10 shadow-[0_30px_80px_-25px_rgba(0,0,0,0.9)]
    transform-gpu transition-all duration-500
    group-hover:-translate-y-2 group-hover:rotate-x-[2deg]
    group-hover:shadow-[0_55px_140px_-35px_rgba(59,130,246,0.45)]
    overflow-hidden flex flex-col
    ${isClosed ? 'opacity-70 saturate-50 cursor-not-allowed' : 'cursor-pointer'}
  `}
>
  {/* Image / Banner */}
  <div className="relative h-36 w-full overflow-hidden">
    <img
      src={market.image_url || '/default-image.jpg'}
      alt={market.title}
      className="object-cover w-full h-full transition-transform group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#05080f] via-transparent to-black/30" />
  </div>

  {/* Content */}
  <div className="flex-1 p-5 flex flex-col">
    {/* Market title */}
    <h3 className="text-white text-lg font-semibold line-clamp-2">{market.title}</h3>

    {/* Total Pool */}
    <div className="mt-2 flex justify-between items-center text-xs text-neutral-400">
      <span>Total Pool</span>
      <span className="text-blue-400 font-medium">{market.total_pool} XLM</span>
    </div>

    {/* Divider */}
    <div className="my-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

    {/* Options */}
    <div className="flex gap-2">
      {[
        { label: 'No', amount: market.total_shares_option_one },
        { label: 'Yes', amount: market.total_shares_option_two },
      ].map((opt) => (
        <button
          key={opt.label}
          disabled={isClosed}
          onClick={(e) => {
            e.stopPropagation()
            handleOptionSelect(market, opt.label)
          }}
          className={`
            flex-1 py-2 rounded-xl text-sm font-medium transition
            ${
              opt.label === 'Yes'
                ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300'
                : 'bg-red-500/20 hover:bg-red-500/30 text-red-300'
            }
            ${isClosed ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {opt.label} <span className="ml-1 font-semibold">{opt.amount}</span>
        </button>
      ))}
    </div>

    {/* Footer */}
    <div className="mt-auto flex justify-between items-center text-xs text-neutral-400 pt-3">
      <span>{isClosed ? 'Closed' : 'Trade now'}</span>
      {!isClosed && (
        <span className="text-blue-400 font-medium">View →</span>
      )}
    </div>
  </div>

  {/* Live Badge */}
  {!isClosed && (
    <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300 ring-1 ring-blue-400/30 backdrop-blur">
      <Sparkles className="h-3 w-3" />
      Live
    </div>
  )}
</div>

            </div>
          )
        })}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Layers className="h-12 w-12 text-neutral-600 mb-4" />
        <h3 className="text-xl font-medium">No markets found</h3>
        <p className="text-sm text-neutral-400 mt-1">
          Try changing categories or your search query.
        </p>
      </div>
    )}
  </div>
</section>

      {/* PURCHASE MODAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedMarket && (
          <PurchaseSection
            market={selectedMarket}
            preselectedOption={selectedOption}
          />
        )}
      </Modal>
    </main>
  )
}

export default Home