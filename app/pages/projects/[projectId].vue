<script setup lang="ts">
import type { Project, Step } from '~/types'
import projectsData from '../../../data/projects.json'
import stepsData from '../../../data/steps.json'

const route = useRoute()

const projectId = computed(() => route.params.projectId as string)

const project = computed(() =>
  (projectsData as Project[]).find(p => p.id === projectId.value)
)

const relatedSteps = computed(() => {
  if (!project.value) return []
  return project.value.stepIds
    .map(id => (stepsData as Step[]).find(s => s.id === id))
    .filter((s): s is Step => s !== undefined)
})

if (!project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'المشروع غير موجود'
  })
}

useSeoMeta({
  title: `${project.value.title} - DevPath`
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
    <!-- Back link -->
    <div class="mb-6">
      <UButton
        to="/roadmap"
        variant="ghost"
        color="neutral"
        icon="i-lucide-arrow-right"
        size="sm"
      >
        العودة للخريطة
      </UButton>
    </div>

    <template v-if="project">
      <!-- Project Detail -->
      <ProjectDetail
        :project="project"
        :related-steps="relatedSteps"
      />

      <!-- Tutorials -->
      <div class="mt-10">
        <ProjectTutorialList :tutorials="project.tutorials" />
      </div>

      <!-- Submission -->
      <div class="mt-10">
        <ProjectSubmission
          :project-id="project.id"
          :project="project"
          @completed="() => {}"
        />
      </div>
    </template>
  </div>
</template>
