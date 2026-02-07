<script setup lang="ts">
import type { Step, ProgressStatus } from '~/types'

const props = defineProps<{
  sectionId: string
  title: string
  description: string
  icon: string
  steps: Step[]
  getStepStatus: (stepId: string) => ProgressStatus
  isStepLocked: (stepId: string) => boolean
  currentStepId: string | null
  defaultOpen?: boolean
}>()

const isOpen = ref(props.defaultOpen ?? false)

const completedCount = computed(() =>
  props.steps.filter(s => props.getStepStatus(s.id) === 'completed').length
)

const sectionProgress = computed(() =>
  props.steps.length > 0 ? Math.round((completedCount.value / props.steps.length) * 100) : 0
)

const isComplete = computed(() => completedCount.value === props.steps.length)

const sectionStatusClass = computed(() => {
  if (isComplete.value) return 'border-emerald-300 dark:border-emerald-700'
  if (completedCount.value > 0) return 'border-primary-300 dark:border-primary-700'
  return 'border-gray-200 dark:border-gray-800'
})
</script>

<template>
  <div class="relative">
    <!-- Timeline connector line -->
    <div
      class="absolute right-[23px] top-0 -bottom-6 w-0.5 sm:right-[27px]"
      :class="isComplete ? 'bg-emerald-300 dark:bg-emerald-700' : 'bg-gray-200 dark:bg-gray-700'"
    />

    <!-- Section card -->
    <div class="relative">
      <!-- Timeline node -->
      <div
        class="absolute right-2.5 top-5 z-10 flex size-6 items-center justify-center rounded-full border-2 sm:right-4 sm:size-7"
        :class="isComplete
          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50'
          : completedCount > 0
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/50'
            : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900'"
      >
        <UIcon
          v-if="isComplete"
          name="i-lucide-check"
          class="size-3.5 text-emerald-600 dark:text-emerald-400 sm:size-4"
        />
        <UIcon
          v-else
          :name="icon"
          class="size-3.5 sm:size-4"
          :class="completedCount > 0 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'"
        />
      </div>

      <!-- Card content -->
      <div
        class="mr-12 overflow-hidden rounded-xl border transition-all duration-300 sm:mr-14"
        :class="sectionStatusClass"
      >
        <!-- Header (clickable) -->
        <button
          class="flex w-full items-center gap-3 bg-white p-4 text-right transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/50"
          @click="isOpen = !isOpen"
        >
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold text-gray-900 dark:text-white sm:text-lg">
                {{ title }}
              </h3>
              <UBadge
                v-if="isComplete"
                color="emerald"
                variant="subtle"
                size="xs"
              >
                <UIcon
                  name="i-lucide-check"
                  class="size-3"
                />
                مكتمل
              </UBadge>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              {{ description }}
            </p>
            <!-- Mini progress -->
            <div class="mt-2 flex items-center gap-2">
              <UProgress
                :value="sectionProgress"
                size="xs"
                class="flex-1"
                :color="isComplete ? 'emerald' : 'primary'"
              />
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                {{ completedCount }}/{{ steps.length }}
              </span>
            </div>
          </div>

          <!-- Expand icon -->
          <UIcon
            name="i-lucide-chevron-down"
            class="size-5 shrink-0 text-gray-400 transition-transform duration-300 dark:text-gray-500"
            :class="{ '-rotate-180': isOpen }"
          />
        </button>

        <!-- Steps (collapsible) -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="max-h-0 opacity-0"
          enter-to-class="max-h-[2000px] opacity-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="max-h-[2000px] opacity-100"
          leave-to-class="max-h-0 opacity-0"
        >
          <div
            v-show="isOpen"
            class="overflow-hidden border-t border-gray-100 dark:border-gray-800"
          >
            <div class="divide-y divide-gray-100 dark:divide-gray-800/50">
              <RoadmapStep
                v-for="step in steps"
                :key="step.id"
                :step-id="step.id"
                :title="step.title"
                :description="step.description"
                :estimated-hours="step.estimatedHours"
                :status="getStepStatus(step.id)"
                :is-locked="isStepLocked(step.id)"
                :is-current="step.id === currentStepId"
              />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
