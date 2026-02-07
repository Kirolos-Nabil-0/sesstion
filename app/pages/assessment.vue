<script setup lang="ts">
import type { AssessmentQuestion, UserAssessmentResult, PathType } from '~/types'
import assessmentData from '../../data/assessment.json'

useSeoMeta({
  title: 'اكتشف مسارك - DevPath'
})

const userStore = useUserStore()
const router = useRouter()

// === STATE ===

type Screen = 'welcome' | 'quiz' | 'results' | 'name-input'

const currentScreen = ref<Screen>('welcome')
const currentQuestionIndex = ref(0)
const answers = ref<Record<string, string>>({})
const assessmentResult = ref<UserAssessmentResult | null>(null)
const chosenPath = ref<PathType | null>(null)
const userName = ref('')
const isTransitioning = ref(false)

// === COMPUTED ===

const questions = assessmentData.questions as AssessmentQuestion[]
const totalQuestions = questions.length

const currentQuestion = computed(() => questions[currentQuestionIndex.value]!)

const currentAnswerId = computed(() =>
  answers.value[currentQuestion.value.id] ?? null
)

const canGoNext = computed(() => !!currentAnswerId.value)
const canGoPrev = computed(() => currentQuestionIndex.value > 0)
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions - 1)

// === METHODS ===

function startQuiz() {
  currentScreen.value = 'quiz'
}

function selectAnswer(answerId: string) {
  answers.value[currentQuestion.value.id] = answerId
}

function transition(callback: () => void) {
  isTransitioning.value = true
  setTimeout(() => {
    callback()
    isTransitioning.value = false
  }, 200)
}

function nextQuestion() {
  if (!canGoNext.value) return

  if (isLastQuestion.value) {
    submitQuiz()
    return
  }

  transition(() => {
    currentQuestionIndex.value++
  })
}

function prevQuestion() {
  if (!canGoPrev.value) return

  transition(() => {
    currentQuestionIndex.value--
  })
}

function skipQuestion() {
  // Select middle answer (index 1) as default
  const middleAnswer = currentQuestion.value.answers[1]
  if (middleAnswer) {
    answers.value[currentQuestion.value.id] = middleAnswer.id
  }
  nextQuestion()
}

function submitQuiz() {
  const answersWithScores = questions.map((q) => {
    const answerId = answers.value[q.id]!
    const answer = q.answers.find(a => a.id === answerId)!
    return {
      questionId: q.id,
      answerId,
      scores: answer.scores
    }
  })

  assessmentResult.value = userStore.calculateAssessment(answersWithScores)
  currentScreen.value = 'results'
}

function choosePath(path: PathType) {
  chosenPath.value = path
  currentScreen.value = 'name-input'
}

function confirmAndStart() {
  if (!userName.value.trim() || !chosenPath.value) return

  // Create user with name
  userStore.createUser(userName.value.trim())
  userStore.setChosenPath(chosenPath.value)

  // Update assessment result with chosen path
  if (userStore.assessmentResult) {
    userStore.assessmentResult.chosenPath = chosenPath.value
  }

  router.push('/roadmap')
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-10 sm:py-16">
    <Transition
      name="fade"
      mode="out-in"
    >
      <!-- ==================== WELCOME SCREEN ==================== -->
      <div
        v-if="currentScreen === 'welcome'"
        key="welcome"
        class="text-center"
      >
        <!-- Illustration -->
        <div class="relative mx-auto mb-8 flex size-24 items-center justify-center">
          <div class="absolute inset-0 animate-pulse rounded-full bg-primary-100 dark:bg-primary-950" />
          <UIcon
            name="i-lucide-clipboard-list"
            class="relative size-12 text-primary-500"
          />
        </div>

        <h1 class="text-3xl font-bold text-(--ui-text-highlighted) sm:text-4xl">
          {{ assessmentData.title }}
        </h1>
        <p class="mt-4 text-lg leading-relaxed text-(--ui-text-muted)">
          {{ assessmentData.description }}
        </p>

        <!-- Info cards -->
        <div class="mt-8 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <UIcon
              name="i-lucide-help-circle"
              class="mx-auto mb-2 size-6 text-primary-500"
            />
            <p class="text-sm font-semibold text-(--ui-text-highlighted)">
              {{ totalQuestions }} سؤال
            </p>
            <p class="text-xs text-(--ui-text-muted)">
              أسئلة سهلة وسريعة
            </p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <UIcon
              name="i-lucide-clock"
              class="mx-auto mb-2 size-6 text-emerald-500"
            />
            <p class="text-sm font-semibold text-(--ui-text-highlighted)">
              3-5 دقائق
            </p>
            <p class="text-xs text-(--ui-text-muted)">
              الوقت المتوقع
            </p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <UIcon
              name="i-lucide-target"
              class="mx-auto mb-2 size-6 text-purple-500"
            />
            <p class="text-sm font-semibold text-(--ui-text-highlighted)">
              3 مسارات
            </p>
            <p class="text-xs text-(--ui-text-muted)">
              Frontend, Backend, Fullstack
            </p>
          </div>
        </div>

        <!-- Start button -->
        <UButton
          size="xl"
          class="mt-10"
          icon="i-lucide-arrow-left"
          trailing
          @click="startQuiz"
        >
          يلا نبدأ!
        </UButton>
      </div>

      <!-- ==================== QUIZ SCREEN ==================== -->
      <div
        v-else-if="currentScreen === 'quiz'"
        key="quiz"
        class="space-y-8"
      >
        <!-- Progress -->
        <AssessmentProgress
          :current="currentQuestionIndex + 1"
          :total="totalQuestions"
        />

        <!-- Question with transition -->
        <div
          class="transition-all duration-200"
          :class="isTransitioning ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'"
        >
          <AssessmentQuestion
            :question="currentQuestion"
            :selected-answer-id="currentAnswerId"
            @select="selectAnswer"
          />
        </div>

        <!-- Navigation buttons -->
        <div class="flex items-center justify-between pt-4">
          <UButton
            v-if="canGoPrev"
            color="neutral"
            variant="outline"
            icon="i-lucide-arrow-right"
            @click="prevQuestion"
          >
            السابق
          </UButton>
          <div v-else />

          <div class="flex items-center gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              @click="skipQuestion"
            >
              تخطي
            </UButton>
            <UButton
              :disabled="!canGoNext"
              icon="i-lucide-arrow-left"
              trailing
              @click="nextQuestion"
            >
              {{ isLastQuestion ? 'شوف النتيجة' : 'التالي' }}
            </UButton>
          </div>
        </div>
      </div>

      <!-- ==================== RESULTS SCREEN ==================== -->
      <div
        v-else-if="currentScreen === 'results' && assessmentResult"
        key="results"
      >
        <AssessmentResults
          :result="assessmentResult"
          @choose-path="choosePath"
        />
      </div>

      <!-- ==================== NAME INPUT SCREEN ==================== -->
      <div
        v-else-if="currentScreen === 'name-input'"
        key="name-input"
        class="text-center"
      >
        <!-- Icon -->
        <div class="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
          <UIcon
            name="i-lucide-user-circle"
            class="size-8 text-emerald-500"
          />
        </div>

        <h2 class="text-2xl font-bold text-(--ui-text-highlighted)">
          أخر خطوة!
        </h2>
        <p class="mt-2 text-(--ui-text-muted)">
          اكتب اسمك عشان نبدأ رحلتك
        </p>

        <!-- Name input -->
        <div class="mx-auto mt-8 max-w-sm">
          <UInput
            v-model="userName"
            size="xl"
            placeholder="اسمك..."
            icon="i-lucide-user"
            autofocus
            class="text-center"
            @keyup.enter="confirmAndStart"
          />
        </div>

        <!-- Start CTA -->
        <UButton
          size="xl"
          class="mt-6"
          :disabled="!userName.trim()"
          icon="i-lucide-rocket"
          trailing
          @click="confirmAndStart"
        >
          ابدأ التعلم
        </UButton>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
