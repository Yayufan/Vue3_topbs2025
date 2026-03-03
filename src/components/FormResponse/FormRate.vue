<template>
  <el-rate class="rate-component" v-model="model" :max="field.validationRules?.max ?? 5" />
</template>

<script setup lang="ts">
import type { FormField } from '@/api/formField/types'

const props = defineProps<{
  modelValue: number
  field: FormField
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
</script>

<style scoped lang="scss">
.rate-component {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  --el-rate-icon-size: 32px;

  @media screen and (max-width:500px) {
    --el-rate-icon-size: 26px;
  }
}
</style>