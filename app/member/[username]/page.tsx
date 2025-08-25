"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, GitCommit, GitPullRequest, Eye, ExternalLink, Calendar, Hash } from "lucide-react"
import Image from "next/image"
import { DateRangePicker } from "@/components/performance/date-range-picker"

export interface MemberActivity {
  username: string
  from: string
  to: string
  commits: Array<{
    id: string
    sha: string
    repo: string
    owner: string
    author_name: string
    author_email: string
    date: string
    message: string
    commit_raw: {
      html_url: string
    }
  }>
  pull_requests: Array<{
    pr_id: string
    repo: string
    owner: string
    pr_raw: {
      url: string
      html_url: string
      title: string
      state: string
      created_at: string
      updated_at: string
      closed_at: string | null
      merged_at: string | null
    }
  }>
  reviews?: Array<{
  id: string
  repo: string
  owner: string
  pr_id: string // changed from title to pr_id
  date: string
  html_url: string
  }>
}

type ActivityTab = "commits" | "pull_requests" | "reviews"

export default function MemberDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const username = params.username as string

  const [activity, setActivity] = useState<MemberActivity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ActivityTab>("commits")
  const [dateRange, setDateRange] = useState(() => {
    const fromParam = searchParams.get("from")
    const toParam = searchParams.get("to")
    return {
      from: fromParam || "28/07/2025",
      to: toParam || "25/08/2025",
    }
  })

  // Pagination states
  const PAGE_SIZE = 10
  const [commitsPage, setCommitsPage] = useState(1)
  const [pullRequestsPage, setPullRequestsPage] = useState(1)
  const [reviewsPage, setReviewsPage] = useState(1)

  // Reset page when tab or date changes
  useEffect(() => {
    setCommitsPage(1)
    setPullRequestsPage(1)
    setReviewsPage(1)
  }, [activeTab, dateRange])

  const fetchMemberActivity = async (from: string, to: string) => {
    try {
      setLoading(true)
      setError(null)
      const encodedFrom = encodeURIComponent(from)
      const encodedTo = encodeURIComponent(to)
      const response = await fetch(
        `https://performance-github.onrender.com/stat/member-activities?username=${username}&from=${encodedFrom}&to=${encodedTo}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch member activity data")
      }

      const result = await response.json()
      if (result.status && result.data) {
        setActivity(result.data)
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
    if (username) {
      fetchMemberActivity(dateRange.from, dateRange.to)
    }
  }, [username, dateRange])

  const handleDateRangeChange = (from: string, to: string) => {
    setDateRange({ from, to })
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set("from", from)
    newSearchParams.set("to", to)
    router.replace(`/member/${username}?${newSearchParams.toString()}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderCommitsTable = () => {
    if (!activity?.commits || activity.commits.length === 0) {
      return <div className="text-center py-8 text-gray-500">Không có commit nào trong khoảng thời gian này</div>
    }

    const totalPages = Math.ceil(activity.commits.length / PAGE_SIZE)
    const paginatedCommits = activity.commits.slice((commitsPage - 1) * PAGE_SIZE, commitsPage * PAGE_SIZE)

    return (
      <div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Message</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Repository</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">SHA</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Link</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCommits.map((commit) => (
                <tr key={commit.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900" title={commit.message}>
                      {commit.message.length > 50 ? `${commit.message.substring(0, 50)}...` : commit.message}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="text-xs">
                      {commit.owner}/{commit.repo}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(commit.date)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-sm font-mono text-gray-600">
                      <Hash className="h-4 w-4" />
                      {commit.sha.substring(0, 7)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <a
                      href={commit.commit_raw.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2">
            <Button variant="outline" size="sm" disabled={commitsPage === 1} onClick={() => setCommitsPage(commitsPage - 1)}>
              Previous
            </Button>
            <span className="text-sm">Page {commitsPage} of {totalPages}</span>
            <Button variant="outline" size="sm" disabled={commitsPage === totalPages} onClick={() => setCommitsPage(commitsPage + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>
    )
  }

  const renderPullRequestsTable = () => {
    if (!activity?.pull_requests || activity.pull_requests.length === 0) {
      return <div className="text-center py-8 text-gray-500">Không có pull request nào trong khoảng thời gian này</div>
    }

    const totalPages = Math.ceil(activity.pull_requests.length / PAGE_SIZE)
    const paginatedPRs = activity.pull_requests.slice((pullRequestsPage - 1) * PAGE_SIZE, pullRequestsPage * PAGE_SIZE)

    return (
      <div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Title</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Repository</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">State</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Created</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Link</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPRs.map((pr) => (
                <tr key={`${pr.pr_id}-${pr.repo}`} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{pr.pr_raw.title}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="text-xs">
                      {pr.owner}/{pr.repo}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={pr.pr_raw.state === "closed" ? "secondary" : "default"}
                      className={
                        pr.pr_raw.state === "closed" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                      }
                    >
                      {pr.pr_raw.state}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(pr.pr_raw.created_at)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <a
                      href={pr.pr_raw.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2">
            <Button variant="outline" size="sm" disabled={pullRequestsPage === 1} onClick={() => setPullRequestsPage(pullRequestsPage - 1)}>
              Previous
            </Button>
            <span className="text-sm">Page {pullRequestsPage} of {totalPages}</span>
            <Button variant="outline" size="sm" disabled={pullRequestsPage === totalPages} onClick={() => setPullRequestsPage(pullRequestsPage + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>
    )
  }

  const renderReviewsTable = () => {
    if (!activity?.reviews || activity.reviews.length === 0) {
      return <div className="text-center py-8 text-gray-500">Không có review nào trong khoảng thời gian này</div>
    }

    const totalPages = Math.ceil(activity.reviews.length / PAGE_SIZE)
    const paginatedReviews = activity.reviews.slice((reviewsPage - 1) * PAGE_SIZE, reviewsPage * PAGE_SIZE)

    return (
      <div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">PR ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Repository</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Link</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReviews.map((review) => (
                <tr key={review.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{review.pr_id}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="text-xs">
                      {review.owner}/{review.repo}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(review.date)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <a
                      href={review.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2">
            <Button variant="outline" size="sm" disabled={reviewsPage === 1} onClick={() => setReviewsPage(reviewsPage - 1)}>
              Previous
            </Button>
            <span className="text-sm">Page {reviewsPage} of {totalPages}</span>
            <Button variant="outline" size="sm" disabled={reviewsPage === totalPages} onClick={() => setReviewsPage(reviewsPage + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading member details...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
          <div className="text-gray-600">{error}</div>
          <Button onClick={() => router.push("/")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/")} className="border-gray-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Member Performance Details</h1>
          </div>
          <DateRangePicker onDateRangeChange={handleDateRangeChange} loading={loading} />
        </div>

        <Card className="border bg-white border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center gap-4">
              <Image
                src={`https://github.com/${username}.png`}
                alt={username}
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">{username}</CardTitle>
                <p className="text-gray-600">
                  Performance Details ({dateRange.from} - {dateRange.to})
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("commits")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "commits" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <GitCommit className="h-4 w-4" />
                    Commits ({activity?.commits?.length || 0})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("pull_requests")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "pull_requests"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <GitPullRequest className="h-4 w-4" />
                    Pull Requests ({activity?.pull_requests?.length || 0})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "reviews" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Eye className="h-4 w-4" />
                    Reviews ({activity?.reviews?.length || 0})
                  </div>
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg">
                {activeTab === "commits" && renderCommitsTable()}
                {activeTab === "pull_requests" && renderPullRequestsTable()}
                {activeTab === "reviews" && renderReviewsTable()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
