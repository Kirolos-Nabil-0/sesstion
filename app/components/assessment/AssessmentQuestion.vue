<script setup lang="ts">
import type { AssessmentQuestion } from '~/types'

defineProps<{
  question: AssessmentQuestion
  selectedAnswerId: string | null
}>()

defineEmits<{
  select: [answerId: string]
}>()
</script>

<template>
  <div class="space-y-6">
    <!-- Question text -->
    <h2 class="text-xl font-bold leading-relaxed text-(--ui-text-highlighted) sm:text-2xl">
      {{ question.questionText }}
    </h2>

    <!-- Answer options -->
    <div class="space-y-3">
      <button
        v-for="answer in question.answers"
        :key="answer.id"
        class="group w-full cursor-pointer rounded-xl border-2 p-4 text-right transition-all duration-200"
        :class="[
          selectedAnswerId === answer.id
            ? 'border-primary-500 bg-primary-50 shadow-sm dark:border-primary-400 dark:bg-primary-950/50'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700'
        ]"
        @click="$emit('select', answer.id)"
      >
        <div class="flex items-center gap-3">
          <!-- Radio circle -->
          <div
            class="flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
            :class="[
              selectedAnswerId === answer.id
                ? 'border-primary-500 dark:border-primary-400'
                : 'border-gray-300 group-hover:border-gray-400 dark:border-gray-600'
            ]"
          >
            <div
              v-if="selectedAnswerId === answer.id"
              class="size-2.5 rounded-full bg-primary-500 dark:bg-primary-400"
            />
          </div>

          <!-- Answer text -->
          <span
            class="text-base font-medium transition-colors"
            :class="[
              selectedAnswerId === answer.id
                ? 'text-primary-700 dark:text-primary-300'
                : 'text-(--ui-text-highlighted) group-hover:text-(--ui-text-highlighted)'
            ]"
          >
            {{ answer.answerText }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>
