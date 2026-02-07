<script setup lang="ts">
import type { Project, Step } from '~/types'

defineProps<{
  project: Project
  relatedSteps: Step[]
}>()

const difficultyColor: Record<string, 'success' | 'info' | 'warning'> = {
  beginner: 'success',
  intermediate: 'info',
  advanced: 'warning'
}

const difficultyLabel: Record<string, string> = {
  beginner: 'مبتدئ',
  intermediate: 'متوسط',
  advanced: 'متقدم'
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
      <!-- Thumbnail / placeholder -->
      <div class="flex size-20 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
        <UIcon
          name="i-lucide-folder-code"
          class="size-10"
        />
      </div>

      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
          {{ project.title }}
        </h1>

        <!-- Badges -->
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <UBadge
            :color="difficultyColor[project.difficulty]"
            variant="subtle"
            size="sm"
          >
            {{ difficultyLabel[project.difficulty] }}
          </UBadge>
          <UBadge
            color="neutral"
            variant="subtle"
            size="sm"
          >
            <UIcon
              name="i-lucide-clock"
              class="mr-1 size-3.5"
            />
            {{ project.estimatedHours }} ساعات
          </UBadge>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div class="mt-8">
      <h2 class="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        وصف المشروع
      </h2>
      <p class="leading-relaxed text-gray-600 dark:text-gray-400">
        {{ project.description }}
      </p>
    </div>

    <!-- What you'll learn -->
    <div
      v-if="relatedSteps.length > 0"
      class="mt-8"
    >
      <h2 class="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        ما ستتعلمه
      </h2>
      <ul class="space-y-2">
        <li
          v-for="step in relatedSteps"
          :key="step.id"
          class="flex items-start gap-2 text-gray-600 dark:text-gray-400"
        >
          <UIcon
            name="i-lucide-check-circle"
            class="mt-0.5 size-5 shrink-0 text-emerald-500"
          />
          <span>{{ step.description }}</span>
        </li>
      </ul>
    </div>

    <!-- Related Steps -->
    <div
      v-if="relatedSteps.length > 0"
      class="mt-8"
    >
      <h2 class="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        الخطوات المرتبطة
      </h2>
      <div class="space-y-2">
        <div
          v-for="step in relatedSteps"
          :key="step.id"
          class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-primary-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-800"
        >
          <div class="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
            <UIcon
              name="i-lucide-book-open"
              class="size-4"
            />
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-medium text-gray-900 dark:text-white">
              {{ step.title }}
            </p>
          </div>
          <UBadge
            color="neutral"
            variant="subtle"
            size="xs"
          >
            {{ step.estimatedHours }}h
          </UBadge>
        </div>
      </div>
    </div>
  </div>
</template>
