<script setup lang="ts">
const features = [
  {
    icon: 'i-lucide-map',
    title: 'Roadmap واضح',
    description: 'خطوات منظمة من الصفر للاحتراف مع مسار مخصص لكل تخصص'
  },
  {
    icon: 'i-lucide-bar-chart-3',
    title: 'تتبع التقدم',
    description: 'تابع إنجازاتك خطوة بخطوة وشوف كم وصلت'
  },
  {
    icon: 'i-lucide-trophy',
    title: 'Badges وإنجازات',
    description: 'اكسب نقاط XP وشارات مع كل إنجاز تحققه'
  },
  {
    icon: 'i-lucide-flame',
    title: 'نظام Streaks',
    description: 'حافظ على streak يومي وابني عادة التعلم المستمر'
  }
]

const paths = [
  {
    icon: 'i-lucide-palette',
    title: 'Frontend Development',
    description: 'تعلم HTML, CSS, JavaScript, React وكل اللي تحتاجه لبناء واجهات مستخدم مذهلة',
    color: 'blue' as const,
    gradient: 'from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20'
  },
  {
    icon: 'i-lucide-server',
    title: 'Backend Development',
    description: 'تعلم Node.js, قواعد البيانات, APIs وبناء أنظمة قوية وآمنة',
    color: 'emerald' as const,
    gradient: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20'
  },
  {
    icon: 'i-lucide-layers',
    title: 'Full Stack Development',
    description: 'ادمج Frontend و Backend وابني تطبيقات ويب كاملة من الصفر',
    color: 'purple' as const,
    gradient: 'from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20'
  }
]

const codeLines = [
  { indent: 0, color: 'text-pink-400', text: 'const', rest: ' developer = {', restColor: 'text-gray-300' },
  { indent: 1, color: 'text-blue-400', text: 'name:', rest: ' "أنت"', restColor: 'text-emerald-400' },
  { indent: 1, color: 'text-blue-400', text: 'path:', rest: ' "fullstack"', restColor: 'text-emerald-400' },
  { indent: 1, color: 'text-blue-400', text: 'skills:', rest: ' []', restColor: 'text-yellow-400' },
  { indent: 1, color: 'text-blue-400', text: 'ready:', rest: ' true', restColor: 'text-orange-400' },
  { indent: 0, color: 'text-gray-300', text: '}', rest: '', restColor: '' }
]
</script>

<template>
  <div>
    <!-- ==================== HERO SECTION ==================== -->
    <section class="relative overflow-hidden">
      <!-- Background gradient orbs -->
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -top-24 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/10" />
        <div class="absolute -bottom-32 -left-32 size-[400px] rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-600/10" />
        <div class="absolute -right-32 top-1/2 size-[350px] rounded-full bg-purple-400/15 blur-3xl dark:bg-purple-600/10" />
      </div>

      <!-- Grid pattern overlay -->
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        :style="{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }"
      />

      <div class="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <!-- Left: Text content -->
          <div class="text-center lg:text-right">
            <!-- Badge -->
            <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
              <UIcon
                name="i-lucide-sparkles"
                class="size-4"
              />
              <span>منصة تعلم مجانية ومفتوحة</span>
            </div>

            <!-- Headline -->
            <h1 class="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
              ابدأ رحلتك في
              <span class="bg-gradient-to-l from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-blue-400 dark:to-cyan-400">
                Web Development
              </span>
            </h1>

            <!-- Subtitle -->
            <p class="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl dark:text-gray-400">
              خطوة بخطوة، من الصفر للاحتراف. اختار مسارك، تابع تقدمك، واكسب إنجازات على طول الطريق.
            </p>

            <!-- CTAs -->
            <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-end">
              <UButton
                to="/roadmap"
                size="xl"
                icon="i-lucide-rocket"
                trailing
                class="w-full sm:w-auto"
              >
                ابدأ الآن
              </UButton>
              <UButton
                to="/assessment"
                size="xl"
                color="neutral"
                variant="outline"
                icon="i-lucide-clipboard-list"
                trailing
                class="w-full sm:w-auto"
              >
                اعمل الاختبار
              </UButton>
            </div>

            <!-- Stats -->
            <div class="mt-10 flex items-center justify-center gap-8 lg:justify-end">
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  50+
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  خطوة تعليمية
                </p>
              </div>
              <USeparator
                orientation="vertical"
                class="h-10"
              />
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  3
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  مسارات
                </p>
              </div>
              <USeparator
                orientation="vertical"
                class="h-10"
              />
              <div class="text-center">
                <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  100%
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  مجاني
                </p>
              </div>
            </div>
          </div>

          <!-- Right: Code editor illustration -->
          <div class="hidden lg:block">
            <div class="relative">
              <!-- Glow behind the editor -->
              <div class="absolute -inset-4 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-emerald-500/20 blur-2xl" />

              <!-- Code editor window -->
              <div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 shadow-2xl dark:border-gray-700">
                <!-- Title bar -->
                <div class="flex items-center gap-2 border-b border-gray-700 bg-gray-800 px-4 py-3">
                  <div class="flex gap-1.5">
                    <div class="size-3 rounded-full bg-red-500" />
                    <div class="size-3 rounded-full bg-yellow-500" />
                    <div class="size-3 rounded-full bg-green-500" />
                  </div>
                  <span class="mr-auto text-xs text-gray-400">developer.ts</span>
                  <UIcon
                    name="i-lucide-code-xml"
                    class="size-4 text-gray-500"
                  />
                </div>

                <!-- Code content -->
                <div class="p-5 font-mono text-sm leading-relaxed">
                  <div
                    v-for="(line, idx) in codeLines"
                    :key="idx"
                    class="flex"
                    :class="{ 'mt-0.5': idx > 0 }"
                  >
                    <!-- Line number -->
                    <span class="mr-4 inline-block w-5 select-none text-right text-gray-600">{{ idx + 1 }}</span>
                    <!-- Indent -->
                    <span
                      v-if="line.indent"
                      class="inline-block"
                      :style="{ width: line.indent * 24 + 'px' }"
                    />
                    <!-- Code -->
                    <span :class="line.color">{{ line.text }}</span>
                    <span
                      v-if="line.rest"
                      :class="line.restColor"
                    >{{ line.rest }}</span>
                  </div>
                </div>

                <!-- Status bar -->
                <div class="flex items-center justify-between border-t border-gray-700 bg-gray-800 px-4 py-1.5 text-xs text-gray-500">
                  <span>TypeScript</span>
                  <span class="flex items-center gap-1.5">
                    <span class="size-2 rounded-full bg-emerald-500" />
                    Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== FEATURES SECTION ==================== -->
    <section class="border-t border-gray-200/50 bg-gray-50/50 dark:border-gray-800/50 dark:bg-gray-900/30">
      <div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <!-- Section header -->
        <div class="mb-14 text-center">
          <p class="mb-3 text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400">
            ليش DevPath؟
          </p>
          <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            كل اللي تحتاجه في مكان واحد
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            أدوات وميزات تساعدك تتعلم بشكل منظم وممتع
          </p>
        </div>

        <!-- Feature cards -->
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="group relative rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800"
          >
            <!-- Icon -->
            <div class="mb-4 inline-flex rounded-lg bg-blue-50 p-2.5 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:group-hover:bg-blue-950/80">
              <UIcon
                :name="feature.icon"
                class="size-6"
              />
            </div>

            <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              {{ feature.title }}
            </h3>
            <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== PATHS SECTION ==================== -->
    <section>
      <div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <!-- Section header -->
        <div class="mb-14 text-center">
          <p class="mb-3 text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400">
            اختار مسارك
          </p>
          <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            ثلاث مسارات لثلاث وجهات
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            كل مسار مصمم بعناية ليوصلك لهدفك، اعمل الاختبار أو اختار مباشرة
          </p>
        </div>

        <!-- Path cards -->
        <div class="grid gap-6 lg:grid-cols-3">
          <UPageCard
            v-for="path in paths"
            :key="path.title"
            :icon="path.icon"
            :title="path.title"
            :description="path.description"
            spotlight
            :spotlight-color="path.color"
            variant="outline"
            class="transition-transform duration-300 hover:-translate-y-1"
            :ui="{
              icon: `text-${path.color}-500`
            }"
          >
            <template #footer>
              <UButton
                to="/roadmap"
                :color="path.color"
                variant="soft"
                size="sm"
                trailing-icon="i-lucide-arrow-left"
                block
              >
                استكشف المسار
              </UButton>
            </template>
          </UPageCard>
        </div>
      </div>
    </section>

    <!-- ==================== CTA SECTION ==================== -->
    <section class="border-t border-gray-200/50 dark:border-gray-800/50">
      <div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 px-8 py-14 text-center shadow-xl dark:from-blue-700 dark:to-blue-800 sm:px-16">
          <!-- Decorative circles -->
          <div class="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10" />
          <div class="pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full bg-white/5" />

          <div class="relative">
            <h2 class="text-3xl font-bold text-white sm:text-4xl">
              جاهز تبدأ؟
            </h2>
            <p class="mx-auto mt-4 max-w-xl text-lg text-blue-100">
              انضم الآن وابدأ رحلتك في تطوير الويب. مش محتاج خبرة سابقة.
            </p>
            <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <UButton
                to="/roadmap"
                size="xl"
                color="white"
                icon="i-lucide-rocket"
                trailing
              >
                ابدأ الآن مجاناً
              </UButton>
              <UButton
                to="/assessment"
                size="xl"
                variant="outline"
                class="border-white/30 text-white hover:bg-white/10"
                icon="i-lucide-clipboard-list"
                trailing
              >
                اكتشف مسارك المناسب
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
