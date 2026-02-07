<script setup lang="ts">
import type { PathType } from '~/types'

const props = defineProps<{
  chosenPath: PathType | null
}>()

const emit = defineEmits<{
  selectPath: [path: PathType]
}>()

const paths = [
  {
    id: 'frontend' as PathType,
    title: 'Frontend',
    subtitle: 'واجهات المستخدم',
    description: 'Vue.js, React, وبناء تطبيقات تفاعلية',
    icon: 'i-lucide-palette',
    color: 'blue' as const
  },
  {
    id: 'backend' as PathType,
    title: 'Backend',
    subtitle: 'خوادم وقواعد بيانات',
    description: 'Node.js, APIs, وإدارة البيانات',
    icon: 'i-lucide-server',
    color: 'emerald' as const
  },
  {
    id: 'fullstack' as PathType,
    title: 'Full Stack',
    subtitle: 'الكل في واحد',
    description: 'Frontend + Backend لبناء تطبيقات كاملة',
    icon: 'i-lucide-layers',
    color: 'purple' as const
  }
]

const showChangeConfirm = ref(false)
const pendingPath = ref<PathType | null>(null)

function handleSelect(pathId: PathType) {
  if (props.chosenPath && props.chosenPath !== 'fundamentals' && pathId !== props.chosenPath) {
    pendingPath.value = pathId
    showChangeConfirm.value = true
  } else {
    emit('selectPath', pathId)
  }
}

function confirmChange() {
  if (pendingPath.value) {
    emit('selectPath', pendingPath.value)
  }
  showChangeConfirm.value = false
  pendingPath.value = null
}
</script>

<template>
  <div class="relative">
    <!-- Timeline connector -->
    <div class="absolute right-[23px] top-0 -bottom-6 w-0.5 bg-gray-200 dark:bg-gray-700 sm:right-[27px]" />

    <!-- Branch node -->
    <div
      class="absolute right-2.5 top-5 z-10 flex size-6 items-center justify-center rounded-full border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/50 sm:right-4 sm:size-7"
    >
      <UIcon
        name="i-lucide-git-branch"
        class="size-3.5 text-amber-600 dark:text-amber-400 sm:size-4"
      />
    </div>

    <!-- Branch content -->
    <div class="mr-12 sm:mr-14">
      <!-- Header -->
      <div class="mb-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          اختار مسارك
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          بعد ما خلصت الأساسيات، وقت تختار تخصصك
        </p>
      </div>

      <!-- Path cards -->
      <div class="grid gap-3 sm:grid-cols-3">
        <button
          v-for="path in paths"
          :key="path.id"
          class="group relative rounded-xl border-2 p-4 text-right transition-all duration-300 hover:shadow-md"
          :class="chosenPath === path.id || chosenPath === 'fullstack' && path.id === 'fullstack'
            ? `border-${path.color}-400 bg-${path.color}-50/50 dark:border-${path.color}-600 dark:bg-${path.color}-950/20 ring-2 ring-${path.color}-500/20`
            : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600'"
          @click="handleSelect(path.id)"
        >
          <!-- Selected indicator -->
          <div
            v-if="chosenPath === path.id"
            class="absolute left-3 top-3"
          >
            <UIcon
              name="i-lucide-check-circle-2"
              class="size-5 text-emerald-500"
            />
          </div>

          <UIcon
            :name="path.icon"
            class="size-8 transition-transform group-hover:scale-110"
            :class="`text-${path.color}-500`"
          />
          <h4 class="mt-2 text-base font-bold text-gray-900 dark:text-white">
            {{ path.title }}
          </h4>
          <p
            class="text-xs font-medium"
            :class="`text-${path.color}-600 dark:text-${path.color}-400`"
          >
            {{ path.subtitle }}
          </p>
          <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {{ path.description }}
          </p>
        </button>
      </div>

      <!-- Change path confirmation -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="-translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-2 opacity-0"
      >
        <div
          v-if="showChangeConfirm"
          class="mt-3 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30"
        >
          <UIcon
            name="i-lucide-alert-triangle"
            class="size-5 shrink-0 text-amber-500"
          />
          <p class="flex-1 text-sm text-amber-800 dark:text-amber-200">
            هل تريد تغيير مسارك؟ تقدمك في الأساسيات لن يتأثر.
          </p>
          <div class="flex gap-2">
            <UButton
              size="xs"
              color="amber"
              @click="confirmChange"
            >
              تأكيد
            </UButton>
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              @click="showChangeConfirm = false"
            >
              إلغاء
            </UButton>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
