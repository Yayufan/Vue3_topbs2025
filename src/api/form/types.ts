
// 定義一個純 Type，用於更寬鬆的場景
export type NumericBoolean = 0 | 1;

export enum FormStatusEnum {
  DRAFT = "draft",
  PUBLISHED = "published",
  CLOSED = "closed",

}

export const FormStatusMeta: Record<
  FormStatusEnum,
  { label: string }
> = {
  [FormStatusEnum.DRAFT]: { label: "草稿" },
  [FormStatusEnum.PUBLISHED]: { label: "發佈" },
  [FormStatusEnum.CLOSED]: { label: "關閉" },
};

export interface Form {
  formId: string;
  title: string;
  description: string;
  status: FormStatusEnum;
  requireLogin: NumericBoolean;
  requiredForCheckout: NumericBoolean;
  allowMultipleSubmissions: NumericBoolean;
  startTime: string;
  endTime: string;

}
