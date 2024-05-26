import { isObject } from './is_object';

export function isMessage(message) {
  return message && isObject(message) && 'type' in message;
}
