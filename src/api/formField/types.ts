
/** QuestionEditor 共用的 Emits 介面 */
export interface QuestionEditorBaseEmits {
  (e: "update-local", patch: Partial<FormField>): void;
  (e: "commit"): void;
  (e: "copy"): void;
  (e: "delete"): void;
  (e: "move-up"): void;
  (e: "move-down"): void;
}

export enum FieldType {
  TEXT = "text",
  TEXTAREA = "textarea",
  NUMBER = "number",
  EMAIL = "email",
  SELECT = "select",
  RADIO = "radio",
  RATE = "rate",
  CHECKBOX = "checkbox",
  DATE = "date",
  SECTION = "section",
  IMAGE = "image",
}

export interface Choice {
  id: string;
  label: string;
  imgUrl: string;
}


export interface Option {
  /**
   * 選項欄位
   */
  choices: Choice[];
  /**
   * 使否允許填入 '其他' 選項
   */
  allowCustom: boolean;
}

export interface ShowIf {
  /**
   * 	依賴的問題 ID
   */
  fieldId: string;
  /**
   * 依賴的問題 觸發顯示的值
   */
  value: string;
}

export interface ValidationRule {
  max: number;
  min: number;
  showIf: ShowIf | null;
}

// 定義一個純 Type，用於更寬鬆的場景
export type NumericBoolean = 0 | 1;

export interface FormField {
  formFieldId?: string;
  formId: string;
  fieldType: FieldType;
  label: string;
  description: string;
  placeholder: string;
  imageUrl: string;
  imageCaption: string;
  isRequired: NumericBoolean;
  fieldOrder: number;
  options: null | Option;
  validationRules: null | ValidationRule;
}
