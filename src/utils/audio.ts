// Audio synthesizer for micro-interactions (Disabled as per user request)

export function getSoundEnabled(): boolean {
  return false;
}

export function setSoundEnabled(_val: boolean): void {
  // Sounds permanently disabled
}

export function playClickSound(): void {
  // No-op: micro-interaction sounds disabled
}

export function playHoverSound(): void {
  // No-op: micro-interaction sounds disabled
}

export function playShutterSound(): void {
  // No-op: micro-interaction sounds disabled
}

