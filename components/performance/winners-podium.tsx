"use client"

import { Card } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { Member } from "@/app/page"

interface WinnersPodiumProps {
  members: Member[]
}

export function WinnersPodium({ members }: WinnersPodiumProps) {
  const router = useRouter()

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-8 w-8 text-yellow-500" />
      case 1:
        return <Medal className="h-8 w-8 text-gray-400" />
      case 2:
        return <Award className="h-8 w-8 text-orange-500" />
      default:
        return null
    }
  }

  const getPodiumHeight = (index: number) => {
    switch (index) {
      case 0:
        return "h-32" // Winner - tallest
      case 1:
        return "h-24" // Second - medium
      case 2:
        return "h-16" // Third - shortest
      default:
        return "h-16"
    }
  }

  const handleMemberClick = (member: Member) => {
    router.push(`/member/${member.username}`)
  }

  // Arrange podium: 2nd, 1st, 3rd
  const podiumOrder = [
    members[1], // 2nd place on left
    members[0], // 1st place in center
    members[2], // 3rd place on right
  ].filter(Boolean)

  const podiumHeights = ["h-24", "h-32", "h-16"] // Heights for 2nd, 1st, 3rd

  return (
    <Card className="bg-white shadow-sm border border-gray-200 p-6">
     

      <div className="flex justify-center items-end gap-4 mt-8">
        {podiumOrder.map((member, displayIndex) => {
          if (!member) return null

          const actualRank = displayIndex === 0 ? 1 : displayIndex === 1 ? 0 : 2 // Map display to actual rank
          const height = podiumHeights[displayIndex]

          return (
            <div key={member.username} className="text-center">
              <div
                className={`${height} w-24 bg-gradient-to-t from-blue-100 to-blue-50 rounded-t-lg flex flex-col items-center justify-end p-4 cursor-pointer hover:from-blue-200 hover:to-blue-100 transition-colors`}
                onClick={() => handleMemberClick(member)}
              >
                <div className="mb-2">{getRankIcon(actualRank)}</div>
                <Image
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.username}
                  width={40}
                  height={40}
                  className="rounded-full mb-2"
                />
                <h3 className="font-semibold text-gray-900 text-sm">{member.username}</h3>
                <div className="text-lg font-bold text-blue-600">{member.performance}</div>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
