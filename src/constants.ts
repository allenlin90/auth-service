export enum ProviderKeys {
  UUID = 'UUID',
  UUIDV4 = 'UUIDV4',
  NANO_ID = 'NANO_ID',
  EMAIL_SERVICE = 'EMAIL_SERVICE',
}

export const QUEUE_ROUTE = '/queues';

export const EMAIL_QUEUE_NAME = 'email';

export enum EmailTasks {
  SEND_RESET_MAIL = 'sendResetMail',
}

export enum Prefixes {
  RESET = 'reset',
  REFRESH = 'refresh',
}
