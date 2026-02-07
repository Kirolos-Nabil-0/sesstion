<script setup lang="ts">
import type { Project } from '~/types'

defineProps<{
  project: Project
}>()

const difficultyColor: Record<string, 'success' | 'warning' | 'error'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error'
}

const difficultyLabel: Record<string, string> = {
  beginner: 'مبتدئ',
  intermediate: 'متوسط',
  advanced: 'متقدم'
}
</script>

<template>
  <UCard>
    <!-- Thumbnail -->
    <img
      v-if="project.thumbnailUrl"
      :src="project.thumbnailUrl"
      :alt="project.title"
      class="mb-4 h-40 w-full rounded-lg object-cover"
    >

    <!-- Title -->
    <h3 class="text-lg font-semibold text-(--ui-text-highlighted)">
      {{ project.title }}
    </h3>

    <!-- Meta row -->
    <div class="mt-2 flex flex-wrap items-center gap-2">
      <UBadge
        :color="difficultyColor[project.difficulty]"
        variant="subtle"
        size="xs"
      >
        {{ difficultyLabel[project.difficulty] }}
      </UBadge>
      <span class="flex items-center gap-1 text-sm text-(--ui-text-muted)">
        <UIcon
          name="i-lucide-clock"
          class="size-3.5"
        />
        {{ project.estimatedHours }} ساعات
      </span>
    </div>

    <!-- Description -->
    <p class="mt-3 text-sm leading-relaxed text-(--ui-text-muted)">
      {{ project.description }}
    </p>

    <!-- Tutorials -->
    <div
      v-if="project.tutorials.length"
      class="mt-4 space-y-2"
    >
      <UButton
        v-for="tutorial in project.tutorials"
        :key="tutorial.id"
        :to="tutorial.url"
        target="_blank"
        variant="soft"
        color="primary"
        size="sm"
        icon="i-lucide-play-circle"
        block
      >
        {{ tutorial.title }}
      </UButton>
    </div>
  </UCard>
</template>
