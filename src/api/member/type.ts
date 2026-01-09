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
  tagList?: Iterable<any> | ArrayLike<any>;
  password?: string;
  confirmPassword?: string;
  countryCode: string;
  remark?: string | null;
}

export interface PutMemberForAdminInterface {
  memberId: string;
  idCard?: string;
  title: string;
  chineseName: string | null;
  firstName: string;
  lastName: string;
  country: string;
  remitAccountLast5: string | null;
  categoryExtra: string | null;
  affiliation: string | null;
  jobTitle: string | null;
  phone: string | null;
  remark: string | null;
  receipt: string | null;
  food: string;
  foodTaboo: string;
}