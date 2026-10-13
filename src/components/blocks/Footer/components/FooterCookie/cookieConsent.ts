import type { LegalPageData } from '../../../../../store/api/legal/types.ts';

export const COOKIE_CONSENT_KEY = 'provokativelook.cookie-consent.v2';
export const COOKIE_CONSENT_EVENT = 'provokativelook:cookie-consent';
export const COOKIE_CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;

export interface CookieConsent {
    choice: 'accepted' | 'rejected';
    policyVersion: string;
    savedAt: number;
}

// Keep the exact published revision. Admin text changes invalidate consent
// even when the editor leaves UPDATED_AT unchanged.
export function getCookiePolicyVersion(page: LegalPageData | undefined): string | null {
    if (!page || page.pageCode !== 'cookie-policy' || typeof page.title !== 'string'
        || !page.title.trim() || typeof page.content !== 'string' || !page.content.trim()) return null;
    return JSON.stringify([page.id, page.pageCode, page.title, page.intro ?? '', page.content, page.updatedAt ?? '']);
}

export function readCookieConsent(raw: string | null): CookieConsent | null {
    try {
        const value: unknown = JSON.parse(raw ?? 'null');
        if (!value || typeof value !== 'object') return null;
        const record = value as Partial<CookieConsent>;
        if ((record.choice !== 'accepted' && record.choice !== 'rejected')
            || typeof record.policyVersion !== 'string' || !record.policyVersion
            || typeof record.savedAt !== 'number' || !Number.isFinite(record.savedAt)) return null;
        return record as CookieConsent;
    } catch { return null; }
}

export function hasCurrentCookieConsent(consent: CookieConsent | null, version: string | null, now: number): boolean {
    return Boolean(version && consent?.choice === 'accepted' && consent.policyVersion === version
        && consent.savedAt > 0 && consent.savedAt <= now && now - consent.savedAt < COOKIE_CONSENT_MAX_AGE);
}
