<template>
  <el-select v-model="model" style="width: 100%" placeholder="Select">
    <el-option v-for="opt in field.options?.choices ?? []" :key="opt.id" :label="opt.label" :value="opt.label" />
  </el-select>
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