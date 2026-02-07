<script setup lang="ts">
const props = defineProps<{
  completedSteps: number
  totalSteps: number
  streak: number
  xp: number
}>()

const progressPercent = computed(() =>
  props.totalSteps > 0 ? Math.round((props.completedSteps / props.totalSteps) * 100) : 0
)
</script>

<template>
  <div class="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:gap-6">
    <!-- Progress -->
    <div class="flex-1 min-w-0">
      <div class="mb-1.5 flex items-center justify-between text-sm">
        <span class="font-medium text-gray-700 dark:text-gray-300">التقدم الكلي</span>
        <span class="font-semibold text-primary-600 dark:text-primary-400">{{ progressPercent }}%</span>
      </div>
      <UProgress
        :value="progressPercent"
        color="primary"
        size="sm"
      />
      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {{ completedSteps }} من {{ totalSteps }} خطوة مكتملة
      </p>
    </div>

    <USeparator
      orientation="vertical"
      class="hidden h-10 sm:block"
    />
    <USeparator class="sm:hidden" />

    <!-- Streak -->
    <div class="flex items-center gap-2.5 text-center sm:min-w-[100px] sm:flex-col sm:gap-1">
      <UIcon
        name="i-lucide-flame"
        class="size-5 text-orange-500"
      />
      <span class="text-xl font-bold text-gray-900 dark:text-white">{{ streak }}</span>
      <span class="text-xs text-gray-500 dark:text-gray-400">يوم streak</span>
    </div>

    <USeparator
      orientation="vertical"
      class="hidden h-10 sm:block"
    />
    <USeparator class="sm:hidden" />

    <!-- XP -->
    <div class="flex items-center gap-2.5 text-center sm:min-w-[100px] sm:flex-col sm:gap-1">
      <UIcon
        name="i-lucide-zap"
        class="size-5 text-yellow-500"
      />
      <span class="text-xl font-bold text-gray-900 dark:text-white">{{ xp }}</span>
      <span class="text-xs text-gray-500 dark:text-gray-400">نقطة XP</span>
    </div>
  </div>
</template>
