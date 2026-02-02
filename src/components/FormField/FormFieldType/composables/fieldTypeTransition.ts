import { FieldType } from "@/api/formField/types";
import type { FormField, Choice, ValidationRule } from "@/api/formField/types";

const OPTION_TYPES = [
  FieldType.RADIO,
  FieldType.CHECKBOX,
  FieldType.SELECT,
];

const TEXT_TYPES = [
  FieldType.TEXT,
  FieldType.TEXTAREA,
];

const RATE_TYPES = [
  FieldType.RATE
]

export function patchByFieldTypeChange(
  prev: FormField,
  nextType: FieldType
): Partial<FormField> {
  const patch: Partial<FormField> = {
    fieldType: nextType,
  };

  const fromText = TEXT_TYPES.includes(prev.fieldType);
  const fromOption = OPTION_TYPES.includes(prev.fieldType);
  const fromRate = RATE_TYPES.includes(prev.fieldType);


  const toText = TEXT_TYPES.includes(nextType);
  const toOption = OPTION_TYPES.includes(nextType);
  const toRate = RATE_TYPES.includes(nextType)

  // 從選擇型 & 評分型 -> 簡答型，移除 options / validation
  if (!fromText && toText) {
    patch.options = null;
    patch.validationRules = null;
  }

  // 從簡答型 & 評分型 -> 選擇型，如果 options 不存在，給預設選項
  if (!fromOption && toOption) {
    const defaultChoice: Choice = {
      id: crypto.randomUUID(),
      label: "選項 1",
      imgUrl: "",
    };

    patch.options = {
      choices: [defaultChoice],
      allowCustom: false,
    };

    patch.validationRules = null;

  }

  // 從簡答型 & 選擇型 -> 評分型 , 給預設選項
  if (!fromRate && toRate) {
    patch.options = null;
    patch.validationRules = {
      max: 5,
      min: 1,
      showIf: null
    }
  }

  return patch;
}