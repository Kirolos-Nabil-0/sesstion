<script setup lang="ts">
import type { Resource } from '~/types'

const props = defineProps<{
  resource: Resource
}>()

const typeIconMap: Record<string, string> = {
  video: 'i-lucide-play-circle',
  article: 'i-lucide-file-text',
  course: 'i-lucide-graduation-cap',
  documentation: 'i-lucide-book-open',
  tool: 'i-lucide-wrench'
}

const typeIcon = computed(() => typeIconMap[props.resource.type] ?? 'i-lucide-link')

const languageLabel = computed(() => {
  if (props.resource.language === 'arabic') return 'AR'
  if (props.resource.language === 'english') return 'EN'
  return 'Both'
})

const languageColor = computed(() => {
  if (props.resource.language === 'both') return 'primary' as const
  if (props.resource.language === 'arabic') return 'primary' as const
  return 'neutral' as const
})

const languageVariant = computed(() => {
  return props.resource.language === 'both' ? 'subtle' as const : 'solid' as const
})
</script>

<template>
  <UCard>
    <div class="flex items-start gap-4">
      <!-- Type icon -->
      <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
        <UIcon
          :name="typeIcon"
          class="size-5"
        />
      </div>

      <!-- Content -->
      <div class="min-w-0 flex-1">
        <h3 class="font-semibold text-(--ui-text-highlighted)">
          {{ resource.title }}
        </h3>

        <!-- Badges row -->
        <div class="mt-2 flex flex-wrap items-center gap-2">
          <UBadge
            :color="languageColor"
            :variant="languageVariant"
            size="xs"
          >
            {{ languageLabel }}
          </UBadge>
          <UBadge
            :color="resource.isFree ? 'success' : 'warning'"
            variant="subtle"
            size="xs"
          >
            {{ resource.isFree ? 'Free' : 'Paid' }}
          </UBadge>
        </div>
      </div>

      <!-- External link button -->
      <UButton
        :to="resource.url"
        target="_blank"
        icon="i-lucide-external-link"
        color="primary"
        variant="ghost"
        size="sm"
        aria-label="Open resource"
      />
    </div>
  </UCard>
</template>
