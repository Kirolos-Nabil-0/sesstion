<script setup lang="ts">
defineProps<{
  nextStepId: string | null
  nextStepTitle: string
}>()
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-4 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-4 opacity-0"
  >
    <div
      v-if="nextStepId"
      class="fixed bottom-6 left-6 z-40"
    >
      <UButton
        :to="`/roadmap/${nextStepId}`"
        size="lg"
        icon="i-lucide-arrow-left"
        class="shadow-xl shadow-primary-500/20"
      >
        {{ nextStepTitle || 'أكمل التعلم' }}
      </UButton>
    </div>
  </Transition>
</template>
