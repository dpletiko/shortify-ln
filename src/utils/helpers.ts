// src/utils/helpers.ts

export const isValidURL = (url: string, protocol = 'http'): boolean => {
  try {
    const _url = new URL(url);
    return _url.protocol.includes(protocol);
  } catch (_) {
    return false;  
  }
} 