<script setup lang="ts">
const colorMode = useColorMode()

function toggleDarkMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-gray-200/80 bg-white/80 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/80">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div class="flex size-8 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500">
            <UIcon
              name="i-lucide-code-xml"
              class="size-5 text-white"
            />
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">
            DevPath
          </span>
        </NuxtLink>

        <!-- Right side: dark mode toggle -->
        <UButton
          :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
          color="neutral"
          variant="ghost"
          size="lg"
          aria-label="Toggle dark mode"
          @click="toggleDarkMode"
        />
      </div>
    </header>

    <!-- Main content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <!-- Brand -->
          <div class="flex items-center gap-2.5">
            <div class="flex size-7 items-center justify-center rounded-md bg-blue-600 dark:bg-blue-500">
              <UIcon
                name="i-lucide-code-xml"
                class="size-4 text-white"
              />
            </div>
            <span class="font-semibold text-gray-900 dark:text-white">DevPath</span>
          </div>

          <!-- Social links -->
          <div class="flex items-center gap-1">
            <UButton
              to="https://github.com"
              target="_blank"
              icon="i-simple-icons-github"
              color="neutral"
              variant="ghost"
              size="lg"
              aria-label="GitHub"
            />
            <UButton
              to="https://linkedin.com"
              target="_blank"
              icon="i-simple-icons-linkedin"
              color="neutral"
              variant="ghost"
              size="lg"
              aria-label="LinkedIn"
            />
          </div>
        </div>

        <USeparator class="my-6" />

        <p class="text-center text-sm text-gray-500 dark:text-gray-400">
          Built with &hearts; for GDG on Campus dev community
        </p>
      </div>
    </footer>
  </div>
</template>
