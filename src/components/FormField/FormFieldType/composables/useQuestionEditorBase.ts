import type { FormField, FieldType, NumericBoolean } from "@/api/formField/types";
import { patchByFieldTypeChange } from "@/components/FormField/FormFieldType/composables/fieldTypeTransition";

// 定義 Emits 介面
interface QuestionEditorBaseEmits {
  (e: "update-local", patch: Partial<FormField>): void;
  (e: "commit"): void;
  (e: "copy"): void;
  (e: "delete"): void;
  (e: "move-up"): void;
  (e: "move-down"): void;
}


export function useQuestionEditorBase(
  props: {
    field: FormField;
  },
  emit: QuestionEditorBaseEmits
) {
  /** QuestionHeader */
  const handleLabelInput = (newLabel: string) => {
    emit("update-local", { label: newLabel });
  };

  const commitLabel = () => {
    emit("commit");
  };

  const handleTypeSelected = (newType: FieldType) => {
    emit("update-local", patchByFieldTypeChange(props.field, newType));
    emit("commit");
  };

  /** QuestionFooter */
  const handleRequiredChange = (value: NumericBoolean) => {
    emit("update-local", { isRequired: value });
    emit("commit");
  };

  const handleFieldDelete = () => emit("delete");
  const handleFieldCopy = () => emit("copy");
  const handleMoveUp = () => emit("move-up");
  const handleMoveDown = () => emit("move-down");

  return {
    handleLabelInput,
    commitLabel,
    handleTypeSelected,
    handleRequiredChange,
    handleFieldDelete,
    handleFieldCopy,
    handleMoveUp,
    handleMoveDown,
  };
}
