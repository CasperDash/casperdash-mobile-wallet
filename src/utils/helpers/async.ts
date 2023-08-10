export function rejectAfterTimeout<T>(promise: Promise<T>, timeoutMs: number, error?: Error): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(error || new Error('Timeout'));
      }, timeoutMs);
    }),
  ]);
}
