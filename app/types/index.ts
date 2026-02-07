// types/index.ts

// === ENUMS ===
export type PathType = 'fundamentals' | 'frontend' | 'backend' | 'fullstack'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type ResourceType
  = | 'video'
    | 'article'
    | 'course'
    | 'documentation'
    | 'tool'
export type ContentLanguage = 'arabic' | 'english' | 'both'
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'
export type BadgeCategory
  = | 'milestone'
    | 'streak'
    | 'project'
    | 'path_completion'
    | 'special'

// === CONTENT TYPES (from JSON) ===

export interface Roadmap {
  id: string
  title: string
  description: string
}

export interface Section {
  id: string
  roadmapId: string
  title: string
  description: string
  pathType: PathType
  orderIndex: number
  isBranchPoint: boolean
  icon: string
}

export interface Step {
  id: string
  sectionId: string
  title: string
  description: string
  orderIndex: number
  estimatedHours: number
}

export interface Resource {
  id: string
  stepId: string
  title: string
  url: string
  type: ResourceType
  language: ContentLanguage
  isFree: boolean
  orderIndex: number
}

export interface Project {
  id: string
  title: string
  description: string
  difficulty: DifficultyLevel
  thumbnailUrl?: string
  estimatedHours: number
  stepIds: string[] // Steps this project belongs to
  primaryStepId: string // Main step where project is introduced
  tutorials: ProjectTutorial[]
}

export interface ProjectTutorial {
  id: string
  title: string
  url: string
  type: ResourceType
  language: ContentLanguage
  isFree: boolean
}

export interface Badge {
  id: string
  name: string
  description: string
  iconUrl: string
  category: BadgeCategory
  xpReward: number
  requirement: BadgeRequirement
}

export interface BadgeRequirement {
  type:
    | 'steps_completed'
    | 'projects_completed'
    | 'streak'
    | 'section_completed'
    | 'path_completed'
  value: number | string // number for counts, string for IDs
}

export interface AssessmentQuestion {
  id: string
  questionText: string
  orderIndex: number
  answers: AssessmentAnswer[]
}

export interface AssessmentAnswer {
  id: string
  answerText: string
  scores: {
    frontend: number
    backend: number
    fullstack: number
  }
}

// === USER DATA TYPES (localStorage) ===

export interface UserData {
  id: string
  fullName: string
  avatarUrl?: string
  chosenPath: PathType
  currentStepId: string | null
  totalXp: number
  createdAt: string
  updatedAt: string
}

export interface UserProgress {
  visibleElementId: string // stepId or projectId
  entryType: 'step' | 'project'
  status: ProgressStatus
  completedAt: string | null
}

export interface UserBadge {
  badgeId: string
  earnedAt: string
}

export interface UserStreak {
  date: string // YYYY-MM-DD format
  activityCount: number
}

export interface UserAssessmentResult {
  answers: { questionId: string, answerId: string }[]
  scores: {
    frontend: number
    backend: number
    fullstack: number
  }
  percentages: {
    frontend: number
    backend: number
    fullstack: number
  }
  recommendedPath: PathType
  chosenPath: PathType | null
  completedAt: string
}

// === COMPLETE LOCALSTORAGE SCHEMA ===

export interface LocalStorageSchema {
  user: UserData | null
  progress: UserProgress[]
  badges: UserBadge[]
  streaks: UserStreak[]
  assessmentResult: UserAssessmentResult | null
  projectUrls: Record<string, string>
}
