<script setup lang="ts">
defineProps<{
  current: number
  total: number
}>()
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between text-sm">
      <span class="font-medium text-(--ui-text-muted)">
        السؤال {{ current }} من {{ total }}
      </span>
      <span class="font-bold text-primary-600 dark:text-primary-400">
        {{ Math.round((current / total) * 100) }}%
      </span>
    </div>
    <div class="h-2.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
      <div
        class="h-full rounded-full bg-primary-500 transition-all duration-500 ease-out"
        :style="{ width: `${(current / total) * 100}%` }"
      />
    </div>
  </div>
</template>
