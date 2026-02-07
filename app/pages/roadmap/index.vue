<script setup lang="ts">
import type { Section, Step, PathType, ProgressStatus } from '~/types'
import sectionsData from '../../../data/sections.json'
import stepsData from '../../../data/steps.json'

const userStore = useUserStore()

// Cast imported JSON
const allSections = sectionsData as Section[]
const allSteps = stepsData as Step[]

// Filter sections based on chosen path
const visibleSections = computed(() => {
  const path = userStore.user?.chosenPath ?? 'fundamentals'

  return allSections
    .filter((section) => {
      if (section.pathType === 'fundamentals') return true
      if (path === 'fullstack') return true
      return section.pathType === path
    })
    .sort((a, b) => a.orderIndex - b.orderIndex)
})

// Get steps for a section, sorted
function getStepsForSection(sectionId: string): Step[] {
  return allSteps
    .filter(s => s.sectionId === sectionId)
    .sort((a, b) => a.orderIndex - b.orderIndex)
}

// Get all visible steps (in order) for progress calculation
const allVisibleSteps = computed(() => {
  const steps: Step[] = []
  for (const section of visibleSections.value) {
    steps.push(...getStepsForSection(section.id))
  }
  return steps
})

// Total steps
const totalSteps = computed(() => allVisibleSteps.value.length)

// Get step status from store
function getStepStatus(stepId: string): ProgressStatus {
  return userStore.getStepProgress(stepId)?.status ?? 'not_started'
}

// Soft locking: step is locked if previous step in the same section isn't completed
function isStepLocked(stepId: string): boolean {
  for (const section of visibleSections.value) {
    const steps = getStepsForSection(section.id)
    const stepIndex = steps.findIndex(s => s.id === stepId)
    if (stepIndex > 0) {
      const prevStep = steps[stepIndex - 1]!
      return getStepStatus(prevStep.id) !== 'completed'
    }
    if (stepIndex === 0) return false
  }
  return false
}

// Determine current step (first non-completed step)
const currentStepId = computed(() => {
  if (userStore.user?.currentStepId) return userStore.user.currentStepId
  for (const step of allVisibleSteps.value) {
    if (getStepStatus(step.id) !== 'completed') return step.id
  }
  return null
})

// Next step for FAB
const nextStep = computed(() => {
  if (!currentStepId.value) return null
  return allVisibleSteps.value.find(s => s.id === currentStepId.value) ?? null
})

// Determine which section should be expanded by default
function shouldExpand(sectionId: string): boolean {
  if (!currentStepId.value) return sectionId === visibleSections.value[0]?.id
  const steps = getStepsForSection(sectionId)
  return steps.some(s => s.id === currentStepId.value)
}

// Handle path selection from branch point
function handlePathSelect(path: PathType) {
  userStore.setChosenPath(path)
}
</script>

<template>
  <div class="relative min-h-screen">
    <!-- Background subtle gradient -->
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -top-24 right-1/4 size-[500px] rounded-full bg-primary-400/10 blur-3xl dark:bg-primary-600/5" />
      <div class="absolute bottom-1/4 left-0 size-[400px] rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-600/5" />
    </div>

    <div class="relative mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <!-- Page header -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          خريطة الطريق
        </h1>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          تابع تقدمك خطوة بخطوة
        </p>
      </div>

      <!-- Stats bar -->
      <div class="mb-10">
        <RoadmapStats
          :completed-steps="userStore.completedStepsCount"
          :total-steps="totalSteps"
          :streak="userStore.currentStreak"
          :xp="userStore.totalXp"
        />
      </div>

      <!-- Timeline -->
      <div class="space-y-6">
        <template
          v-for="section in visibleSections"
          :key="section.id"
        >
          <!-- Section card -->
          <RoadmapSection
            :section-id="section.id"
            :title="section.title"
            :description="section.description"
            :icon="section.icon"
            :steps="getStepsForSection(section.id)"
            :get-step-status="getStepStatus"
            :is-step-locked="isStepLocked"
            :current-step-id="currentStepId"
            :default-open="shouldExpand(section.id)"
          />

          <!-- Branch point after the branch section -->
          <RoadmapBranchPoint
            v-if="section.isBranchPoint"
            :chosen-path="userStore.user?.chosenPath ?? null"
            @select-path="handlePathSelect"
          />
        </template>

        <!-- Completion node at the end -->
        <div class="relative">
          <div
            class="absolute right-2.5 top-0 z-10 flex size-6 items-center justify-center rounded-full border-2 sm:right-4 sm:size-7"
            :class="userStore.completedStepsCount === totalSteps && totalSteps > 0
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50'
              : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900'"
          >
            <UIcon
              name="i-lucide-flag"
              class="size-3.5 sm:size-4"
              :class="userStore.completedStepsCount === totalSteps && totalSteps > 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-gray-400 dark:text-gray-500'"
            />
          </div>
          <p class="mr-12 text-sm font-medium text-gray-400 dark:text-gray-500 sm:mr-14">
            نهاية المسار
          </p>
        </div>
      </div>
    </div>

    <!-- Floating action button -->
    <RoadmapFab
      :next-step-id="nextStep?.id ?? null"
      :next-step-title="nextStep?.title ?? 'أكمل التعلم'"
    />
  </div>
</template>
