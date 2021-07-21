import { AxiosResponse } from 'axios';

export function getApiErrorMessage(apiResp: AxiosResponse): string {
  return apiResp.data.detail[0]?.msg || '';
}
