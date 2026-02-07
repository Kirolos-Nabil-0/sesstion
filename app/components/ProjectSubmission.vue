<script setup lang="ts">
import type { Project, Badge } from '~/types'

const props = defineProps<{
  projectId: string
  project: Project
}>()

const emit = defineEmits<{
  completed: []
}>()

const store = useUserStore()

const projectUrl = ref(store.getProjectUrl(props.projectId) ?? '')
const showCelebration = ref(false)
const earnedBadges = ref<Badge[]>([])
const xpEarned = ref(0)

const currentProgress = computed(() => store.getProjectProgress(props.projectId))
const isCompleted = computed(() => currentProgress.value?.status === 'completed')

function handleComplete() {
  if (isCompleted.value) return

  // Save URL if provided
  if (projectUrl.value.trim()) {
    store.submitProjectUrl(props.projectId, projectUrl.value.trim())
  }

  // Mark project complete
  store.markProjectComplete(props.projectId)

  // Check for new badges
  const newBadges = store.checkProjectBadges()
  earnedBadges.value = newBadges

  // Calculate XP earned (base 25 XP per project + badge XP)
  xpEarned.value = 25 + newBadges.reduce((sum, b) => sum + b.xpReward, 0)

  // Show celebration
  showCelebration.value = true

  emit('completed')
}

function closeCelebration() {
  showCelebration.value = false
}

async function copyLink() {
  const url = window.location.href
  await navigator.clipboard.writeText(url)
}
</script>

<template>
  <div>
    <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
      تسليم المشروع
    </h2>

    <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <!-- Status indicator -->
      <div class="mb-4 flex items-center gap-2">
        <div
          class="size-3 rounded-full"
          :class="{
            'bg-gray-300 dark:bg-gray-600': !currentProgress || currentProgress.status === 'not_started',
            'bg-blue-500': currentProgress?.status === 'in_progress',
            'bg-emerald-500': isCompleted
          }"
        />
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
          <template v-if="isCompleted">مكتمل</template>
          <template v-else-if="currentProgress?.status === 'in_progress'">قيد التنفيذ</template>
          <template v-else>لم يبدأ بعد</template>
        </span>
      </div>

      <!-- URL input -->
      <div class="mb-4">
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          رابط المشروع (اختياري)
        </label>
        <UInput
          v-model="projectUrl"
          placeholder="https://github.com/your-project"
          icon="i-lucide-link"
          size="md"
          :disabled="isCompleted"
        />
      </div>

      <!-- Submit button -->
      <UButton
        :color="isCompleted ? 'success' : 'primary'"
        :icon="isCompleted ? 'i-lucide-check-circle' : 'i-lucide-send'"
        size="md"
        block
        :disabled="isCompleted"
        @click="handleComplete"
      >
        {{ isCompleted ? 'تم إكمال المشروع' : 'تسليم المشروع' }}
      </UButton>

      <!-- Completed info -->
      <div
        v-if="isCompleted && currentProgress?.completedAt"
        class="mt-3 text-center text-xs text-gray-500 dark:text-gray-400"
      >
        تم الإكمال في {{ new Date(currentProgress.completedAt).toLocaleDateString('ar-EG') }}
      </div>
    </div>

    <!-- Celebration Overlay -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showCelebration"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          @click.self="closeCelebration"
        >
          <!-- Confetti particles -->
          <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              v-for="i in 30"
              :key="i"
              class="confetti-particle absolute"
              :style="{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][i % 6]
              }"
            />
          </div>

          <!-- Success card -->
          <Transition
            enter-active-class="transition duration-400 ease-out"
            enter-from-class="scale-75 opacity-0"
            enter-to-class="scale-100 opacity-100"
          >
            <div
              v-if="showCelebration"
              class="relative mx-4 w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-2xl dark:border-gray-700 dark:bg-gray-900"
            >
              <!-- Trophy icon -->
              <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50">
                <UIcon
                  name="i-lucide-trophy"
                  class="size-8 text-emerald-500"
                />
              </div>

              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                أحسنت!
              </h3>
              <p class="mt-1 text-gray-600 dark:text-gray-400">
                أكملت مشروع "{{ project.title }}"
              </p>

              <!-- XP reward -->
              <div class="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                <UIcon
                  name="i-lucide-zap"
                  class="size-4"
                />
                +{{ xpEarned }} XP
              </div>

              <!-- Earned badges -->
              <div
                v-if="earnedBadges.length > 0"
                class="mt-4"
              >
                <p class="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  شارات جديدة!
                </p>
                <div class="flex items-center justify-center gap-3">
                  <div
                    v-for="badge in earnedBadges"
                    :key="badge.id"
                    class="flex flex-col items-center gap-1"
                  >
                    <div class="flex size-10 items-center justify-center rounded-full bg-yellow-50 dark:bg-yellow-950/50">
                      <UIcon
                        name="i-lucide-award"
                        class="size-5 text-yellow-500"
                      />
                    </div>
                    <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ badge.name }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-6 flex flex-col gap-2">
                <UButton
                  color="primary"
                  block
                  @click="closeCelebration"
                >
                  متابعة
                </UButton>
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-share-2"
                  block
                  @click="copyLink"
                >
                  نسخ الرابط
                </UButton>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
@keyframes confetti-fall {
  0% {
    transform: translateY(-10vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(720deg);
    opacity: 0;
  }
}

.confetti-particle {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  animation: confetti-fall linear forwards;
  top: -10px;
}
</style>
