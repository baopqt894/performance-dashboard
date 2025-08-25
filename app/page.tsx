"use client"

import { useState, useEffect } from "react"
import { PerformanceHeader } from "@/components/performance/performance-header"
import { WinnersPodium } from "@/components/performance/winners-podium"
import { RankingsTable } from "@/components/performance/rankings-table"
import { DateRangePicker } from "@/components/performance/date-range-picker"


export interface Member {
  username: string
  avatar: string
  performance: number
  commitCount: number
  prCount: number
  reviewCount: number
}

export default function PerformanceDashboard() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({ from: "28/07/2025", to: "25/08/2025" })

  const fetchMembers = async (from: string, to: string) => {
    try {
      setLoading(true)
      setError(null)
      const encodedFrom = encodeURIComponent(from)
      const encodedTo = encodeURIComponent(to)
      const response = await fetch(
        `https://performance-github.onrender.com/stat/member-performance?from=${encodedFrom}&to=${encodedTo}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch member performance data")
      }

      const result = await response.json()
      if (result.status && result.data) {
        setMembers(result.data)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers(dateRange.from, dateRange.to)
  }, [dateRange])

  const handleDateRangeChange = (from: string, to: string) => {
    setDateRange({ from, to })
  }

  if (loading && members.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <PerformanceHeader />
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Team Performance</h2>
          <DateRangePicker onDateRangeChange={handleDateRangeChange} loading={loading} />
        </div>
        <WinnersPodium members={members.slice(0, 3)} />
        <RankingsTable members={members} />
      </div>
    </div>
  )
}
