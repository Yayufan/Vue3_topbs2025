import request from '@/utils/request';
import { AxiosPromise } from 'axios';


export function fetchScheduleEmailTaskPageApi(page: number, size: number, options?: { recipientCategory: string | undefined, status: number | undefined }): AxiosPromise<any> {
  return request({
    url: '/schedule-email-task/pagination',
    method: 'get',
    params: {
      page,
      size,
      ...options
    }
  })
}

export function cancelScheduleEmailTaskApi(scheduleEmailTaskId: string): AxiosPromise<any> {
  return request({
    url: `/schedule-email-task/${scheduleEmailTaskId}`,
    method: 'put'
  })
}