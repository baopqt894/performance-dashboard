"use client"

import { Card } from "@/components/ui/card"
import { Trophy, Medal, Award, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { Member } from "@/app/page"

interface RankingsTableProps {
  members: Member[]
}

export function RankingsTable({ members }: RankingsTableProps) {
  const router = useRouter()

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 2:
        return <Award className="h-6 w-6 text-orange-500" />
      default:
        return <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
    }
  }

  const handleMemberClick = (member: Member) => {
    router.push(`/member/${member.username}`)
  }

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="space-y-1">
          {members.map((member, index) => (
            <div
              key={member.username}
              className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg group"
              onClick={() => handleMemberClick(member)}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8">{getRankIcon(index)}</div>
                <Image
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{member.username}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{member.commitCount} commits</span>
                    <span>{member.prCount} PRs</span>
                    <span>{member.reviewCount} reviews</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">{member.performance}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
