import { FieldType } from "@/api/formField/types";
import type { FormField, Choice } from "@/api/formField/types";

const OPTION_TYPES = [
  FieldType.RADIO,
  FieldType.CHECKBOX,
  FieldType.SELECT,
];

const TEXT_TYPES = [
  FieldType.TEXT,
  FieldType.TEXTAREA,
];

export function patchByFieldTypeChange(
  prev: FormField,
  nextType: FieldType
): Partial<FormField> {
  const patch: Partial<FormField> = {
    fieldType: nextType,
  };

  const fromOption = OPTION_TYPES.includes(prev.fieldType);
  const toText = TEXT_TYPES.includes(nextType);

  // 從選擇型 -> 簡答型，移除 options / validation
  if (fromOption && toText) {
    patch.options = null;
    patch.validationRules = null;
  }


  // 從簡答型 -> 選擇型，如果 options 不存在，給預設選項
  if (!fromOption && OPTION_TYPES.includes(nextType)) {
    const defaultChoice: Choice = {
      id: crypto.randomUUID(),
      label: "選項 1",
      imgUrl: "",
    };

    patch.options = {
      choices: [defaultChoice],
      allowCustom: false,
    };
  }

  return patch;
}