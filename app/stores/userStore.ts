import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  UserData,
  UserProgress,
  UserBadge,
  UserStreak,
  UserAssessmentResult,
  PathType,
  ProgressStatus,
  Badge
} from '~/types'
import badgesData from '../../data/badges.json'

export const useUserStore = defineStore('userStore', () => {
  // === STATE ===

  const user = ref<UserData | null>(null)
  const progress = ref<UserProgress[]>([])
  const badges = ref<UserBadge[]>([])
  const streaks = ref<UserStreak[]>([])
  const assessmentResult = ref<UserAssessmentResult | null>(null)
  const projectUrls = ref<Record<string, string>>({})

  // === GETTERS ===

  const isLoggedIn = computed(() => user.value !== null)

  const currentStreak = computed(() => {
    const sorted = [...streaks.value].sort((a, b) => b.date.localeCompare(a.date))
    if (sorted.length === 0) return 0

    let streak = 0
    let currentDate = new Date()

    const today = currentDate.toISOString().split('T')[0]!
    const yesterday = new Date(currentDate.setDate(currentDate.getDate() - 1))
      .toISOString()
      .split('T')[0]!

    const firstStreak = sorted[0]!
    const startDate
      = firstStreak.date === today
        ? today
        : firstStreak.date === yesterday
          ? yesterday
          : null

    if (!startDate) return 0

    currentDate = new Date(startDate)

    for (const s of sorted) {
      const expectedDate = currentDate.toISOString().split('T')[0]
      if (s.date === expectedDate) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  })

  const completedStepsCount = computed(() =>
    progress.value.filter(p => p.entryType === 'step' && p.status === 'completed').length
  )

  const completedProjectsCount = computed(() =>
    progress.value.filter(p => p.entryType === 'project' && p.status === 'completed').length
  )

  const totalXp = computed(() => user.value?.totalXp ?? 0)

  const userBadges = computed(() => {
    const allBadges = badgesData as Badge[]
    return badges.value.map((ub) => {
      const badge = allBadges.find(b => b.id === ub.badgeId)
      return { ...ub, badge: badge ?? null }
    })
  })

  // === ACTIONS ===

  function createUser(fullName: string): UserData {
    const newUser: UserData = {
      id: crypto.randomUUID(),
      fullName,
      chosenPath: 'fundamentals',
      currentStepId: null,
      totalXp: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    user.value = newUser
    return newUser
  }

  function updateUser(updates: Partial<UserData>): void {
    if (user.value) {
      user.value = { ...user.value, ...updates, updatedAt: new Date().toISOString() }
    }
  }

  function setChosenPath(path: PathType): void {
    updateUser({ chosenPath: path })
  }

  function _updateProgress(
    elementId: string,
    entryType: 'step' | 'project',
    status: ProgressStatus
  ): void {
    const existing = progress.value.find(
      p => p.visibleElementId === elementId && p.entryType === entryType
    )

    if (existing) {
      progress.value = progress.value.map(p =>
        p.visibleElementId === elementId && p.entryType === entryType
          ? { ...p, status, completedAt: status === 'completed' ? new Date().toISOString() : null }
          : p
      )
    } else {
      progress.value.push({
        visibleElementId: elementId,
        entryType,
        status,
        completedAt: status === 'completed' ? new Date().toISOString() : null
      })
    }

    if (status === 'completed') {
      recordActivity()
    }
  }

  function markStepComplete(stepId: string): void {
    _updateProgress(stepId, 'step', 'completed')
  }

  function markStepInProgress(stepId: string): void {
    _updateProgress(stepId, 'step', 'in_progress')
  }

  function markProjectComplete(projectId: string): void {
    _updateProgress(projectId, 'project', 'completed')
  }

  function recordActivity(): void {
    const today = new Date().toISOString().split('T')[0]!
    const existing = streaks.value.find(s => s.date === today)

    if (existing) {
      streaks.value = streaks.value.map(s =>
        s.date === today ? { ...s, activityCount: s.activityCount + 1 } : s
      )
    } else {
      streaks.value.push({ date: today, activityCount: 1 })
    }
  }

  function awardBadge(badgeId: string, xpReward: number): void {
    if (badges.value.some(b => b.badgeId === badgeId)) return

    badges.value.push({ badgeId, earnedAt: new Date().toISOString() })

    if (user.value) {
      user.value = { ...user.value, totalXp: user.value.totalXp + xpReward }
    }
  }

  function calculateAssessment(
    answers: {
      questionId: string
      answerId: string
      scores: { frontend: number, backend: number, fullstack: number }
    }[]
  ): UserAssessmentResult {
    const scores = { frontend: 0, backend: 0, fullstack: 0 }

    answers.forEach((a) => {
      scores.frontend += a.scores.frontend
      scores.backend += a.scores.backend
      scores.fullstack += a.scores.fullstack
    })

    const total = scores.frontend + scores.backend + scores.fullstack
    const percentages = {
      frontend: Math.round((scores.frontend / total) * 100),
      backend: Math.round((scores.backend / total) * 100),
      fullstack: Math.round((scores.fullstack / total) * 100)
    }

    type ScoreKey = keyof typeof scores
    const recommendedPath = (Object.keys(scores) as ScoreKey[]).reduce(
      (a, b) => (scores[a] > scores[b] ? a : b)
    ) as PathType

    const result: UserAssessmentResult = {
      answers: answers.map(a => ({
        questionId: a.questionId,
        answerId: a.answerId
      })),
      scores,
      percentages,
      recommendedPath,
      chosenPath: null,
      completedAt: new Date().toISOString()
    }

    assessmentResult.value = result
    return result
  }

  function submitProjectUrl(projectId: string, url: string): void {
    projectUrls.value = { ...projectUrls.value, [projectId]: url }
  }

  function getProjectUrl(projectId: string): string | undefined {
    return projectUrls.value[projectId]
  }

  function checkProjectBadges(): Badge[] {
    const allBadges = badgesData as Badge[]
    const newlyEarned: Badge[] = []

    for (const badge of allBadges) {
      if (badges.value.some(b => b.badgeId === badge.id)) continue

      if (
        badge.requirement.type === 'projects_completed'
        && typeof badge.requirement.value === 'number'
        && completedProjectsCount.value >= badge.requirement.value
      ) {
        awardBadge(badge.id, badge.xpReward)
        newlyEarned.push(badge)
      }
    }

    return newlyEarned
  }

  function resetAll(): void {
    user.value = null
    progress.value = []
    badges.value = []
    streaks.value = []
    assessmentResult.value = null
    projectUrls.value = {}
  }

  // === EXTRA HELPERS ===

  function getStepProgress(stepId: string): UserProgress | undefined {
    return progress.value.find(p => p.visibleElementId === stepId && p.entryType === 'step')
  }

  function getProjectProgress(projectId: string): UserProgress | undefined {
    return progress.value.find(p => p.visibleElementId === projectId && p.entryType === 'project')
  }

  function hasBadge(badgeId: string): boolean {
    return badges.value.some(b => b.badgeId === badgeId)
  }

  return {
    // State
    user,
    progress,
    badges,
    streaks,
    assessmentResult,
    projectUrls,

    // Getters
    isLoggedIn,
    currentStreak,
    completedStepsCount,
    completedProjectsCount,
    totalXp,
    userBadges,

    // Actions
    createUser,
    updateUser,
    setChosenPath,
    markStepComplete,
    markStepInProgress,
    markProjectComplete,
    recordActivity,
    awardBadge,
    calculateAssessment,
    resetAll,

    // Helpers
    getStepProgress,
    getProjectProgress,
    hasBadge,
    submitProjectUrl,
    getProjectUrl,
    checkProjectBadges
  }
}, {
  persist: {
    key: 'webdev_roadmap'
  }
})
