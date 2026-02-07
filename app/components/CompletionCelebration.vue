<script setup lang="ts">
import type { Badge } from '~/types'

defineProps<{
  xpGained: number
  badgesEarned: Badge[]
  nextStepId: string | null
}>()

defineEmits<{
  close: []
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  rotation: number
  rotationSpeed: number
}

const COLORS = [
  '#3B82F6', '#2563EB', '#60A5FA',
  '#10B981', '#059669', '#34D399',
  '#F59E0B', '#EF4444', '#8B5CF6'
]

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * 100,
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 3 + 2,
    size: Math.random() * 8 + 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
    alpha: 1,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10
  }))
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const particles = createParticles(100)
  let elapsed = 0

  function animate() {
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    elapsed += 16

    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.05
      p.rotation += p.rotationSpeed
      if (elapsed > 2000) {
        p.alpha = Math.max(0, p.alpha - 0.02)
      }

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = p.color
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
      ctx.restore()
    }

    if (elapsed < 3500) {
      animationId = requestAnimationFrame(animate)
    }
  }

  animationId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <!-- Confetti canvas -->
    <canvas
      ref="canvasRef"
      class="pointer-events-none absolute inset-0"
    />

    <!-- Celebration card -->
    <UCard class="relative z-10 mx-4 w-full max-w-md text-center">
      <!-- Close button -->
      <UButton
        icon="i-lucide-x"
        color="neutral"
        variant="ghost"
        size="sm"
        class="absolute right-2 top-2"
        aria-label="Close"
        @click="$emit('close')"
      />

      <div class="space-y-5 py-4">
        <!-- Celebration icon -->
        <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-950">
          <UIcon
            name="i-lucide-party-popper"
            class="size-8 text-primary-500"
          />
        </div>

        <!-- Heading -->
        <h2 class="text-2xl font-bold text-(--ui-text-highlighted)">
          أحسنت! 🎉
        </h2>

        <!-- XP gained -->
        <div class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 dark:bg-emerald-950">
          <UIcon
            name="i-lucide-zap"
            class="size-5 text-emerald-500"
          />
          <span class="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            +{{ xpGained }} XP
          </span>
        </div>

        <!-- Badges earned -->
        <div
          v-if="badgesEarned.length"
          class="space-y-3"
        >
          <p class="text-sm font-medium text-(--ui-text-muted)">
            شارات جديدة!
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <div
              v-for="badge in badgesEarned"
              :key="badge.id"
              class="flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 dark:border-primary-800 dark:bg-primary-950"
            >
              <UIcon
                name="i-lucide-award"
                class="size-5 text-primary-500"
              />
              <div class="text-start">
                <p class="text-sm font-semibold text-(--ui-text-highlighted)">
                  {{ badge.name }}
                </p>
                <p class="text-xs text-(--ui-text-muted)">
                  +{{ badge.xpReward }} XP
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col gap-2 pt-2">
          <UButton
            v-if="nextStepId"
            :to="`/roadmap/${nextStepId}`"
            color="primary"
            size="lg"
            block
            trailing-icon="i-lucide-arrow-left"
            @click="$emit('close')"
          >
            الخطوة التالية
          </UButton>
          <UButton
            to="/roadmap"
            :color="nextStepId ? 'neutral' : 'primary'"
            :variant="nextStepId ? 'outline' : 'solid'"
            size="lg"
            block
            icon="i-lucide-map"
            @click="$emit('close')"
          >
            العودة للمسار
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
