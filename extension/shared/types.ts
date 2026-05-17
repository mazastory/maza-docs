/**
 * MAZA OS — shared/types.ts
 * 
 * 모든 메시지와 작업의 규격을 정의합니다. (Dumb Bridge 원칙)
 */

export type Platform = 'tistory' | 'wordpress' | 'blogger';

export type TaskType = 
  | 'CREATE_POST' 
  | 'UPLOAD_IMAGE' 
  | 'PUBLISH_POST' 
  | 'CREATE_POLICY_PAGE' 
  | 'INSERT_SEO'
  | 'INFRA_INJECT';

export interface MazaTask {
  id: string;
  type: TaskType;
  platform: Platform;
  domain: string;
  url: string;
  payload: any;
}

export type MazaMessage = 
  | { type: 'RUN_TASK', task: MazaTask }
  | { type: 'TASK_COMPLETE', taskId: string, result: any }
  | { type: 'TASK_ERROR', taskId: string, error: string }
  | { type: 'PING' }
  | { type: 'PONG' };
