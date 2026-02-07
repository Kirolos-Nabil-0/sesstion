<script setup lang="ts">
import type { ProgressStatus } from '~/types'

const props = defineProps<{
  stepId: string
  title: string
  description: string
  estimatedHours: number
  status: ProgressStatus
  isLocked: boolean
  isCurrent: boolean
}>()

const statusConfig = computed(() => {
  if (props.status === 'completed') {
    return {
      icon: 'i-lucide-check-circle-2',
      iconClass: 'text-emerald-500',
      ringClass: 'ring-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/30',
      label: 'مكتمل'
    }
  }
  if (props.status === 'in_progress') {
    return {
      icon: 'i-lucide-play-circle',
      iconClass: 'text-primary-500',
      ringClass: 'ring-primary-500/20 bg-primary-50 dark:bg-primary-950/30',
      label: 'جاري التعلم'
    }
  }
  return {
    icon: 'i-lucide-circle',
    iconClass: 'text-gray-400 dark:text-gray-500',
    ringClass: 'ring-gray-200 bg-gray-50 dark:ring-gray-700 dark:bg-gray-800/50',
    label: 'لم يبدأ'
  }
})
</script>

<template>
  <NuxtLink
    :to="`/roadmap/${stepId}`"
    class="group flex items-start gap-3 rounded-lg p-3 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
    :class="{ 'ring-2 ring-primary-500/30 bg-primary-50/50 dark:bg-primary-950/20': isCurrent }"
  >
    <!-- Status icon -->
    <div
      class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ring-2 transition-all"
      :class="statusConfig.ringClass"
    >
      <UIcon
        :name="statusConfig.icon"
        class="size-4 transition-colors"
        :class="statusConfig.iconClass"
      />
    </div>

    <!-- Content -->
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2">
        <h4 class="text-sm font-semibold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
          {{ title }}
        </h4>
        <UBadge
          v-if="isCurrent"
          color="primary"
          variant="subtle"
          size="xs"
        >
          الحالي
        </UBadge>
        <UBadge
          v-if="isLocked"
          color="neutral"
          variant="subtle"
          size="xs"
        >
          <UIcon
            name="i-lucide-lock"
            class="size-3"
          />
        </UBadge>
      </div>
      <p class="mt-0.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        {{ description }}
      </p>
      <div class="mt-1.5 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
        <span class="flex items-center gap-1">
          <UIcon
            name="i-lucide-clock"
            class="size-3.5"
          />
          {{ estimatedHours }} ساعة
        </span>
        <span :class="statusConfig.iconClass">{{ statusConfig.label }}</span>
      </div>
    </div>

    <!-- Arrow -->
    <UIcon
      name="i-lucide-chevron-left"
      class="mt-1 size-4 shrink-0 text-gray-300 transition-all group-hover:-translate-x-0.5 group-hover:text-primary-500 dark:text-gray-600"
    />
  </NuxtLink>
</template>
