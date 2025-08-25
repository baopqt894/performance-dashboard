"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, ChevronDown } from "lucide-react"

interface DateRangePickerProps {
  onDateRangeChange: (from: string, to: string) => void
  loading?: boolean
}

export function DateRangePicker({ onDateRangeChange, loading }: DateRangePickerProps) {
  const [fromDate, setFromDate] = useState("28/07/2025")
  const [toDate, setToDate] = useState("25/08/2025")
  const [isOpen, setIsOpen] = useState(false)

  const handleApply = () => {
    onDateRangeChange(fromDate, toDate)
    setIsOpen(false)
  }

  const formatDateForInput = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/")
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
  }

  const formatDateForAPI = (dateStr: string) => {
    const date = new Date(dateStr)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDate = formatDateForAPI(e.target.value)
    setFromDate(formattedDate)
  }

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDate = formatDateForAPI(e.target.value)
    setToDate(formattedDate)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-700">
          {fromDate} - {toDate}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10 min-w-[300px]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={formatDateForInput(fromDate)}
                onChange={handleFromDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={formatDateForInput(toDate)}
                onChange={handleToDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleApply}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "Apply"}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
