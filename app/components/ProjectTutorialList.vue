<script setup lang="ts">
import type { ProjectTutorial } from '~/types'

defineProps<{
  tutorials: ProjectTutorial[]
}>()

const typeIconMap: Record<string, string> = {
  video: 'i-lucide-play-circle',
  article: 'i-lucide-file-text',
  course: 'i-lucide-graduation-cap',
  documentation: 'i-lucide-book-open',
  tool: 'i-lucide-wrench'
}

const typeLabel: Record<string, string> = {
  video: 'فيديو',
  article: 'مقال',
  course: 'دورة',
  documentation: 'توثيق',
  tool: 'أداة'
}

const languageLabel: Record<string, string> = {
  arabic: 'عربي',
  english: 'English',
  both: 'عربي + English'
}
</script>

<template>
  <div v-if="tutorials.length > 0">
    <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
      الدروس والشروحات
    </h2>
    <div class="space-y-3">
      <div
        v-for="tutorial in tutorials"
        :key="tutorial.id"
        class="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-primary-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-800"
      >
        <!-- Type icon -->
        <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
          <UIcon
            :name="typeIconMap[tutorial.type] ?? 'i-lucide-link'"
            class="size-5"
          />
        </div>

        <!-- Content -->
        <div class="min-w-0 flex-1">
          <h3 class="font-semibold text-gray-900 dark:text-white">
            {{ tutorial.title }}
          </h3>

          <!-- Badges -->
          <div class="mt-2 flex flex-wrap items-center gap-2">
            <UBadge
              color="neutral"
              variant="subtle"
              size="xs"
            >
              {{ typeLabel[tutorial.type] ?? tutorial.type }}
            </UBadge>
            <UBadge
              color="neutral"
              variant="soft"
              size="xs"
            >
              {{ languageLabel[tutorial.language] ?? tutorial.language }}
            </UBadge>
            <UBadge
              :color="tutorial.isFree ? 'success' : 'warning'"
              variant="subtle"
              size="xs"
            >
              {{ tutorial.isFree ? 'مجاني' : 'مدفوع' }}
            </UBadge>
          </div>
        </div>

        <!-- External link -->
        <UButton
          :to="tutorial.url"
          target="_blank"
          icon="i-lucide-external-link"
          color="primary"
          variant="ghost"
          size="sm"
          aria-label="Open tutorial"
        />
      </div>
    </div>
  </div>
</template>
