export class CheckoutAttempt {
  private signature = '';
  private id = '';
  private readonly createId: () => string;
  constructor(createId: () => string = () => crypto.randomUUID()) {
    this.createId = createId;
  }
  forPayload(payload: unknown): string {
    const signature = JSON.stringify(payload);
    if (!this.id || signature !== this.signature) {
      this.id = this.createId();
      this.signature = signature;
    }
    return this.id;
  }
}
