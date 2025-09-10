export interface Member {
  memberId?: string;
  idCard: string;
  group?: string | null;
  groupRule?: string | null;
  title: string;
  email: string;
  chineseName: string | null;
  firstName: string;
  lastName: string;
  country: string;
  remitAccountLast5?: string | null;
  affiliation: string;
  jobTitle: string;
  phone: string;
  receipt: string | null;
  food: string;
  foodTaboo: string;
  category: number;
  categoryExtra?: string | null;
  status: number;
  amount?: number;
  tagSet?: Set<any>;
  password?: string;
  confirmPassword?: string;
  countryCode: string;
}