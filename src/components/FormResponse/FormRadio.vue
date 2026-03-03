<template>
  <el-radio-group v-model="model">
    <el-radio v-for="opt in field.options?.choices ?? []" :key="opt.id" :value="opt.label">
      {{ opt.label }}
    </el-radio>
  </el-radio-group>
</template>

<script setup lang="ts">
import type { FormField } from '@/api/formField/types'

const props = defineProps<{
  modelValue: string
  field: FormField
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
</script>
