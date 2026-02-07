<script setup lang="ts">
import type { ProgressStatus } from '~/types'

defineProps<{
  status: ProgressStatus
  prevStep: { id: string, title: string } | null
  nextStep: { id: string, title: string } | null
}>()

defineEmits<{
  markInProgress: []
  markComplete: []
}>()
</script>

<template>
  <div class="space-y-4">
    <!-- Action button -->
    <div>
      <UButton
        v-if="status === 'not_started'"
        icon="i-lucide-play"
        color="primary"
        size="lg"
        block
        @click="$emit('markInProgress')"
      >
        ابدأ التعلم
      </UButton>

      <UButton
        v-else-if="status === 'in_progress'"
        icon="i-lucide-check-circle"
        color="success"
        size="lg"
        block
        @click="$emit('markComplete')"
      >
        أكملت هذه الخطوة
      </UButton>

      <UBadge
        v-else
        color="success"
        size="lg"
        icon="i-lucide-check"
        class="w-full justify-center py-2"
      >
        مكتملة ✓
      </UBadge>
    </div>

    <!-- Navigation row -->
    <div class="flex items-center gap-3">
      <UButton
        v-if="prevStep"
        :to="`/roadmap/${prevStep.id}`"
        variant="outline"
        color="neutral"
        class="flex-1"
        icon="i-lucide-arrow-right"
      >
        <span class="truncate">{{ prevStep.title }}</span>
      </UButton>
      <div
        v-else
        class="flex-1"
      />

      <UButton
        v-if="nextStep"
        :to="`/roadmap/${nextStep.id}`"
        color="primary"
        class="flex-1"
        trailing-icon="i-lucide-arrow-left"
      >
        <span class="truncate">{{ nextStep.title }}</span>
      </UButton>
      <div
        v-else
        class="flex-1"
      />
    </div>
  </div>
</template>
