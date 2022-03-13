export interface Message {
  message: string;
  type: string;
}

export const MessageType = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  normal: 'normal',
};
