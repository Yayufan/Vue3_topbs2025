export interface ScheduleEmailTaskQueryCondition {
  currentPage: number;
  pageSize: number;
  recipientCategory: 'paper' | 'member' | 'attendees' | 'paperReviewer' | '';
  status: '0' | '1' | '2' | '3' | '4' | '';
}

export interface ScheduleEmailTask {
  scheduleEmailTaskId: string;
  recipientCategory: 'paper' | 'member' | 'attendees' | 'paperReviewer';
  subject: string;
  description: string;
  design: string;
  htmlContent: string;
  plainText: string;
  expectedEmailVolume: number;
  status: 0 | 1 | 2 | 3 | 4; // 0:待寄送, 1:執行中, 2:已完成, 3:失敗, 4:取消
}

export interface ScheduleEmailTaskRes {
  current: number;
  pages: number;
  records: Array<ScheduleEmailTask>;
  size: number;
  total: number;
}