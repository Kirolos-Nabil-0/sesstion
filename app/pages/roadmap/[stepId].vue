<script setup lang="ts">
import type { Step, Section, Resource, Project, Badge, ProgressStatus } from '~/types'
import sectionsData from '../../../data/sections.json'
import stepsData from '../../../data/steps.json'
import resourcesData from '../../../data/resources.json'
import projectsData from '../../../data/projects.json'
import badgesData from '../../../data/badges.json'

const route = useRoute()
const userStore = useUserStore()

const stepId = computed(() => route.params.stepId as string)

// Cast JSON data
const allSections = sectionsData as Section[]
const allSteps = stepsData as Step[]
const allResources = resourcesData as Resource[]
const allProjects = projectsData as Project[]
const allBadges = badgesData as Badge[]

// Current step
const step = computed(() => allSteps.find(s => s.id === stepId.value))

// 404 if step not found
if (!step.value) {
  throw createError({ statusCode: 404, statusMessage: 'Step not found' })
}

// Parent section
const section = computed(() => allSections.find(s => s.id === step.value?.sectionId))

// Resources for this step
const stepResources = computed(() =>
  allResources
    .filter(r => r.stepId === stepId.value)
    .sort((a, b) => a.orderIndex - b.orderIndex)
)

// Projects linked to this step
const stepProjects = computed(() =>
  allProjects.filter(p => p.stepIds.includes(stepId.value))
)

// Build flat ordered step list across all relevant sections for navigation
const userPath = computed(() => userStore.user?.chosenPath ?? 'fundamentals')

const relevantSections = computed(() =>
  allSections
    .filter(s => s.pathType === 'fundamentals' || s.pathType === userPath.value || userPath.value === 'fullstack')
    .sort((a, b) => a.orderIndex - b.orderIndex)
)

const flatStepList = computed(() => {
  const list: Step[] = []
  for (const sec of relevantSections.value) {
    const sectionSteps = allSteps
      .filter(s => s.sectionId === sec.id)
      .sort((a, b) => a.orderIndex - b.orderIndex)
    list.push(...sectionSteps)
  }
  return list
})

const currentIndex = computed(() =>
  flatStepList.value.findIndex(s => s.id === stepId.value)
)

const prevStep = computed(() => {
  if (currentIndex.value <= 0) return null
  const s = flatStepList.value[currentIndex.value - 1]!
  return { id: s.id, title: s.title }
})

const nextStep = computed(() => {
  if (currentIndex.value < 0 || currentIndex.value >= flatStepList.value.length - 1) return null
  const s = flatStepList.value[currentIndex.value + 1]!
  return { id: s.id, title: s.title }
})

// Step progress
const stepStatus = computed<ProgressStatus>(() =>
  userStore.getStepProgress(stepId.value)?.status ?? 'not_started'
)

// Section progress
const sectionSteps = computed(() =>
  allSteps
    .filter(s => s.sectionId === section.value?.id)
    .sort((a, b) => a.orderIndex - b.orderIndex)
)

const completedInSection = computed(() =>
  sectionSteps.value.filter(s =>
    userStore.getStepProgress(s.id)?.status === 'completed'
  ).length
)

const sectionProgress = computed(() => {
  if (sectionSteps.value.length === 0) return 0
  return Math.round((completedInSection.value / sectionSteps.value.length) * 100)
})

// Status badge config
const statusConfig = computed(() => {
  if (stepStatus.value === 'completed') return { label: 'مكتملة', color: 'success' as const, icon: 'i-lucide-check-circle' }
  if (stepStatus.value === 'in_progress') return { label: 'قيد التعلم', color: 'primary' as const, icon: 'i-lucide-loader' }
  return { label: 'لم تبدأ', color: 'neutral' as const, icon: 'i-lucide-circle' }
})

// Celebration state
const showCelebration = ref(false)
const celebrationXp = ref(0)
const celebrationBadges = ref<Badge[]>([])

// Badge checking
function checkAndAwardBadges(): Badge[] {
  const earned: Badge[] = []

  for (const badge of allBadges) {
    if (userStore.hasBadge(badge.id)) continue

    let met = false
    const req = badge.requirement

    switch (req.type) {
      case 'steps_completed':
        met = userStore.completedStepsCount >= (req.value as number)
        break
      case 'section_completed': {
        const sectionId = req.value as string
        const steps = allSteps.filter(s => s.sectionId === sectionId)
        met = steps.length > 0 && steps.every(s =>
          userStore.getStepProgress(s.id)?.status === 'completed'
        )
        break
      }
      case 'streak':
        met = userStore.currentStreak >= (req.value as number)
        break
      case 'projects_completed':
        met = userStore.completedProjectsCount >= (req.value as number)
        break
      case 'path_completed': {
        const pathType = req.value as string
        const pathSections = allSections.filter(s =>
          s.pathType === pathType || s.pathType === 'fundamentals'
        )
        const pathSteps = allSteps.filter(s =>
          pathSections.some(sec => sec.id === s.sectionId)
        )
        met = pathSteps.length > 0 && pathSteps.every(s =>
          userStore.getStepProgress(s.id)?.status === 'completed'
        )
        break
      }
    }

    if (met) {
      userStore.awardBadge(badge.id, badge.xpReward)
      earned.push(badge)
    }
  }

  return earned
}

function handleMarkInProgress() {
  userStore.markStepInProgress(stepId.value)
}

function handleMarkComplete() {
  userStore.markStepComplete(stepId.value)
  const earned = checkAndAwardBadges()
  const xp = earned.reduce((sum, b) => sum + b.xpReward, 0)
  celebrationXp.value = xp
  celebrationBadges.value = earned
  showCelebration.value = true
}

function closeCelebration() {
  showCelebration.value = false
}

// Mobile slideover
const slideoverOpen = ref(false)

// SEO
useSeoMeta({
  title: () => step.value ? `${step.value.title} - DevPath` : 'DevPath',
  description: () => step.value?.description ?? ''
})

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'المسار', to: '/roadmap' },
  { label: section.value?.title ?? '' },
  { label: step.value?.title ?? '' }
])
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="lg:grid lg:grid-cols-3 lg:gap-8">
      <!-- Main Content (2/3 width on desktop) -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Breadcrumb -->
        <UBreadcrumb :items="breadcrumbItems" />

        <!-- Header -->
        <div>
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-2xl font-bold text-(--ui-text-highlighted) sm:text-3xl">
              {{ step?.title }}
            </h1>
            <UBadge
              :color="statusConfig.color"
              :icon="statusConfig.icon"
              variant="subtle"
            >
              {{ statusConfig.label }}
            </UBadge>
          </div>
          <div class="mt-2 flex items-center gap-1.5 text-sm text-(--ui-text-muted)">
            <UIcon
              name="i-lucide-clock"
              class="size-4"
            />
            <span>{{ step?.estimatedHours }} ساعات</span>
          </div>
        </div>

        <!-- Description -->
        <p class="text-(--ui-text-muted) leading-relaxed">
          {{ step?.description }}
        </p>

        <USeparator />

        <!-- Resources Section -->
        <div v-if="stepResources.length">
          <h2 class="mb-4 text-xl font-semibold text-(--ui-text-highlighted)">
            المصادر التعليمية
          </h2>
          <div class="space-y-3">
            <ResourceCard
              v-for="resource in stepResources"
              :key="resource.id"
              :resource="resource"
            />
          </div>
        </div>

        <!-- Projects Section -->
        <div v-if="stepProjects.length">
          <h2 class="mb-4 text-xl font-semibold text-(--ui-text-highlighted)">
            المشاريع العملية
          </h2>
          <div class="space-y-4">
            <ProjectCard
              v-for="project in stepProjects"
              :key="project.id"
              :project="project"
            />
          </div>
        </div>

        <USeparator />

        <!-- Action Buttons -->
        <StepNavigation
          :status="stepStatus"
          :prev-step="prevStep"
          :next-step="nextStep"
          @mark-in-progress="handleMarkInProgress"
          @mark-complete="handleMarkComplete"
        />
      </div>

      <!-- Sidebar (1/3 width, hidden on mobile) -->
      <aside class="hidden lg:block">
        <div class="sticky top-20 space-y-6">
          <!-- Section progress card -->
          <UCard>
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <UIcon
                  v-if="section?.icon"
                  :name="section.icon"
                  class="size-5 text-primary-500"
                />
                <h3 class="font-semibold text-(--ui-text-highlighted)">
                  {{ section?.title }}
                </h3>
              </div>

              <div>
                <div class="mb-1.5 flex items-center justify-between text-sm">
                  <span class="text-(--ui-text-muted)">التقدم</span>
                  <span class="font-medium text-(--ui-text-highlighted)">
                    {{ completedInSection }}/{{ sectionSteps.length }}
                  </span>
                </div>
                <UProgress
                  :model-value="sectionProgress"
                  color="primary"
                />
              </div>

              <!-- Steps list -->
              <nav class="space-y-1">
                <NuxtLink
                  v-for="s in sectionSteps"
                  :key="s.id"
                  :to="`/roadmap/${s.id}`"
                  class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors"
                  :class="[
                    s.id === stepId
                      ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-950 dark:text-primary-300'
                      : 'text-(--ui-text-muted) hover:bg-gray-50 dark:hover:bg-gray-900'
                  ]"
                >
                  <UIcon
                    v-if="userStore.getStepProgress(s.id)?.status === 'completed'"
                    name="i-lucide-check-circle"
                    class="size-4 shrink-0 text-emerald-500"
                  />
                  <UIcon
                    v-else-if="s.id === stepId"
                    name="i-lucide-circle-dot"
                    class="size-4 shrink-0 text-primary-500"
                  />
                  <UIcon
                    v-else
                    name="i-lucide-circle"
                    class="size-4 shrink-0 text-gray-300 dark:text-gray-600"
                  />
                  <span class="truncate">{{ s.title }}</span>
                </NuxtLink>
              </nav>
            </div>
          </UCard>
        </div>
      </aside>
    </div>

    <!-- Mobile bottom bar trigger -->
    <div class="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
      <UButton
        icon="i-lucide-list"
        color="primary"
        size="lg"
        block
        @click="slideoverOpen = true"
      >
        خطوات القسم ({{ completedInSection }}/{{ sectionSteps.length }})
      </UButton>
    </div>

    <!-- Mobile Slideover -->
    <USlideover
      v-model:open="slideoverOpen"
      side="bottom"
      title="خطوات القسم"
    >
      <template #body>
        <div class="space-y-4 p-4">
          <!-- Progress -->
          <div>
            <div class="mb-1.5 flex items-center justify-between text-sm">
              <span class="text-(--ui-text-muted)">التقدم</span>
              <span class="font-medium text-(--ui-text-highlighted)">
                {{ completedInSection }}/{{ sectionSteps.length }}
              </span>
            </div>
            <UProgress
              :model-value="sectionProgress"
              color="primary"
            />
          </div>

          <!-- Steps list -->
          <nav class="space-y-1">
            <NuxtLink
              v-for="s in sectionSteps"
              :key="s.id"
              :to="`/roadmap/${s.id}`"
              class="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors"
              :class="[
                s.id === stepId
                  ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-950 dark:text-primary-300'
                  : 'text-(--ui-text-muted) hover:bg-gray-50 dark:hover:bg-gray-900'
              ]"
              @click="slideoverOpen = false"
            >
              <UIcon
                v-if="userStore.getStepProgress(s.id)?.status === 'completed'"
                name="i-lucide-check-circle"
                class="size-4 shrink-0 text-emerald-500"
              />
              <UIcon
                v-else-if="s.id === stepId"
                name="i-lucide-circle-dot"
                class="size-4 shrink-0 text-primary-500"
              />
              <UIcon
                v-else
                name="i-lucide-circle"
                class="size-4 shrink-0 text-gray-300 dark:text-gray-600"
              />
              <span class="truncate">{{ s.title }}</span>
            </NuxtLink>
          </nav>
        </div>
      </template>
    </USlideover>

    <!-- Completion Celebration -->
    <CompletionCelebration
      v-if="showCelebration"
      :xp-gained="celebrationXp"
      :badges-earned="celebrationBadges"
      :next-step-id="nextStep?.id ?? null"
      @close="closeCelebration"
    />
  </div>
</template>
