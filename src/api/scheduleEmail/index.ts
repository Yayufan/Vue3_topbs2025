import request from '@/utils/request';
import { AxiosPromise } from 'axios';

export function fetchScheduleEmailTaskPageApi(page: number, size: number, recipientCategory: string | null, status: number | null): AxiosPromise<any> {
  return request({
    url: '/schedule-email-task/pagination',
    method: 'get',
    params: {
      page,
      size,
      recipientCategory,
      status
    }
  })
}

export function cancelScheduleEmailTaskApi(scheduleEmailTaskId: string): AxiosPromise<any> {
  return request({
    url: `/schedule-email-task/${scheduleEmailTaskId}`,
    method: 'put'
  })
}