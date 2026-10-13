// Keep the same identifier when retrying an uncertain result; editing the order
// starts a distinct attempt. Do not automatically retry a purchase request.
export class CheckoutAttempt {
    private signature = '';
    private id = '';
    private readonly createId: () => string;
    constructor(createId: () => string = () => crypto.randomUUID()) { this.createId = createId; }
    forPayload(payload: unknown): string {
        const signature = JSON.stringify(payload);
        if (!this.id || signature !== this.signature) {
            this.id = this.createId();
            this.signature = signature;
        }
        return this.id;
    }
}
