import { Card } from "@/components/ui/card"

export function PerformanceHeader() {
  return (
    <Card className="bg-white shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ranks</h1>
          <p className="text-gray-600 mt-1">Monthly rankings</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">July - August 2025</p>
        </div>
      </div>
    </Card>
  )
}
