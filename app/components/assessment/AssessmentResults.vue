<script setup lang="ts">
import type { UserAssessmentResult, PathType } from '~/types'

const props = defineProps<{
  result: UserAssessmentResult
}>()

defineEmits<{
  choosePath: [path: PathType]
}>()

const pathInfo: Record<string, { label: string, description: string, icon: string, color: string, barColor: string }> = {
  frontend: {
    label: 'Frontend Development',
    description: 'بناء واجهات مستخدم جميلة وتفاعلية باستخدام HTML, CSS, JavaScript, React',
    icon: 'i-lucide-palette',
    color: 'text-blue-600 dark:text-blue-400',
    barColor: 'bg-blue-500'
  },
  backend: {
    label: 'Backend Development',
    description: 'بناء أنظمة قوية وآمنة باستخدام Node.js, قواعد البيانات, APIs',
    icon: 'i-lucide-server',
    color: 'text-emerald-600 dark:text-emerald-400',
    barColor: 'bg-emerald-500'
  },
  fullstack: {
    label: 'Full Stack Development',
    description: 'بناء تطبيقات ويب كاملة من الواجهة للسيرفر',
    icon: 'i-lucide-layers',
    color: 'text-purple-600 dark:text-purple-400',
    barColor: 'bg-purple-500'
  }
}

const sortedPaths = computed(() => {
  const paths = (['frontend', 'backend', 'fullstack'] as const).map(key => ({
    key,
    percentage: props.result.percentages[key],
    isRecommended: props.result.recommendedPath === key,
    ...pathInfo[key]!
  }))
  return paths.sort((a, b) => b.percentage - a.percentage)
})

const revealed = ref(false)

onMounted(() => {
  setTimeout(() => {
    revealed.value = true
  }, 300)
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-950">
        <UIcon
          name="i-lucide-trophy"
          class="size-8 text-primary-500"
        />
      </div>
      <h2 class="text-2xl font-bold text-(--ui-text-highlighted) sm:text-3xl">
        نتيجتك جاهزة!
      </h2>
      <p class="mt-2 text-(--ui-text-muted)">
        بناءً على إجاباتك، المسار المناسب ليك هو:
      </p>
    </div>

    <!-- Bar chart results -->
    <div class="space-y-5">
      <div
        v-for="path in sortedPaths"
        :key="path.key"
        class="space-y-2"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon
              :name="path.icon!"
              class="size-5"
              :class="path.color"
            />
            <span class="font-semibold text-(--ui-text-highlighted)">
              {{ path.label }}
            </span>
            <UBadge
              v-if="path.isRecommended"
              color="primary"
              variant="subtle"
              size="xs"
            >
              المسار المناسب ليك
            </UBadge>
          </div>
          <span class="text-sm font-bold" :class="path.color">
            {{ path.percentage }}%
          </span>
        </div>

        <!-- Bar -->
        <div class="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
          <div
            class="h-full rounded-full transition-all duration-1000 ease-out"
            :class="path.barColor"
            :style="{ width: revealed ? `${path.percentage}%` : '0%' }"
          />
        </div>

        <!-- Description -->
        <p class="text-sm text-(--ui-text-muted)">
          {{ path.description }}
        </p>
      </div>
    </div>

    <!-- Path selection buttons -->
    <div class="space-y-3 pt-4">
      <!-- Recommended path CTA -->
      <UButton
        size="xl"
        block
        icon="i-lucide-rocket"
        trailing
        @click="$emit('choosePath', result.recommendedPath)"
      >
        اختار {{ pathInfo[result.recommendedPath]?.label }}
      </UButton>

      <!-- Other paths -->
      <p class="text-center text-sm text-(--ui-text-muted)">
        أو اختار مسار تاني:
      </p>
      <div class="grid gap-2 sm:grid-cols-2">
        <UButton
          v-for="path in sortedPaths.filter(p => !p.isRecommended)"
          :key="path.key"
          color="neutral"
          variant="outline"
          size="lg"
          block
          :icon="path.icon"
          @click="$emit('choosePath', path.key as PathType)"
        >
          {{ path.label }}
        </UButton>
      </div>
    </div>
  </div>
</template>
