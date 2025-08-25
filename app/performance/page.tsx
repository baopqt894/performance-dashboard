"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Award, GitCommit, GitPullRequest, MessageSquare, ArrowLeft } from "lucide-react"

interface MemberPerformance {
  username: string
  performance: number
  commitCount: number
  prCount: number
  reviewCount: number
}

interface ApiResponse {
  status: boolean
  data: MemberPerformance[]
  message: string
  statusCode: number
  timestamp: string
}

export default function PerformancePage() {
  const [data, setData] = useState<MemberPerformance[]>([])
  const [selectedMember, setSelectedMember] = useState<MemberPerformance | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPerformanceData()
  }, [])

  const fetchPerformanceData = async () => {
    try {
      // Mock data based on your API response structure
      const mockResponse: ApiResponse = {
        status: true,
        path: "/stat/member-performance",
        message: "success",
        statusCode: 200,
        data: [
          { username: "namphph", performance: 174, commitCount: 0, prCount: 87, reviewCount: 0 },
          { username: "QuangSangFC", performance: 150, commitCount: 0, prCount: 75, reviewCount: 0 },
          { username: "hantk2010", performance: 68, commitCount: 0, prCount: 34, reviewCount: 0 },
          { username: "TheAnh533", performance: 62, commitCount: 0, prCount: 31, reviewCount: 0 },
          { username: "FOXCODE-Kiro", performance: 42, commitCount: 0, prCount: 21, reviewCount: 0 },
          { username: "FOXCODE-Bao", performance: 38, commitCount: 0, prCount: 19, reviewCount: 0 },
          { username: "TuLeCong", performance: 32, commitCount: 0, prCount: 16, reviewCount: 0 },
          { username: "KietFC", performance: 27, commitCount: 3, prCount: 12, reviewCount: 0 },
          { username: "daohung47", performance: 24, commitCount: 0, prCount: 12, reviewCount: 0 },
          { username: "tpthien2001", performance: 24, commitCount: 0, prCount: 12, reviewCount: 0 },
        ],
        timestamp: "2025-08-25 13:59:50",
      }

      setData(mockResponse.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching performance data:", error)
      setLoading(false)
    }
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{index + 1}</span>
        )
    }
  }

  const getRankBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
      case 2:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading performance data...</div>
        </div>
      </div>
    )
  }

  if (selectedMember) {
    return (
      <div className="container mx-auto p-6">
        <Button onClick={() => setSelectedMember(null)} variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Leaderboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">
                  {selectedMember.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedMember.username}</h2>
                <p className="text-gray-600">Performance Score: {selectedMember.performance}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <GitCommit className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{selectedMember.commitCount}</p>
                      <p className="text-sm text-gray-600">Commits</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <GitPullRequest className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{selectedMember.prCount}</p>
                      <p className="text-sm text-gray-600">Pull Requests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{selectedMember.reviewCount}</p>
                      <p className="text-sm text-gray-600">Reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Detailed commit, PR, and review history would be displayed here.</p>
                <p className="text-sm text-gray-500 mt-2">
                  This would typically show a timeline of recent commits, pull requests, and code reviews with links to
                  the actual GitHub items.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Team Performance Dashboard</h1>
        <p className="text-gray-600">Track and celebrate your team's contributions</p>
      </div>

      {/* Top 3 Performers */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">🏆 Top Performers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.slice(0, 3).map((member, index) => (
            <Card
              key={member.username}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                index === 0 ? "ring-2 ring-yellow-400" : index === 1 ? "ring-2 ring-gray-400" : "ring-2 ring-amber-400"
              }`}
              onClick={() => setSelectedMember(member)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {getRankIcon(index)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{member.username}</h3>
                    <Badge className={getRankBadgeColor(index)}>Rank #{index + 1}</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Performance Score</span>
                    <span className="font-bold text-lg">{member.performance}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">PRs</span>
                    <span>{member.prCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Commits</span>
                    <span>{member.commitCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Full Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Performance Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Rank</th>
                  <th className="text-left p-3">Developer</th>
                  <th className="text-center p-3">Performance</th>
                  <th className="text-center p-3">Commits</th>
                  <th className="text-center p-3">Pull Requests</th>
                  <th className="text-center p-3">Reviews</th>
                  <th className="text-center p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((member, index) => (
                  <tr key={member.username} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">{getRankIcon(index)}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">
                            {member.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{member.username}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary" className="font-bold">
                        {member.performance}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">{member.commitCount}</td>
                    <td className="p-3 text-center">{member.prCount}</td>
                    <td className="p-3 text-center">{member.reviewCount}</td>
                    <td className="p-3 text-center">
                      <Button size="sm" variant="outline" onClick={() => setSelectedMember(member)}>
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
