import { safeLocalStorage } from "@helpers/browserStorage";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGetLegalPageQuery } from "@store/api/legal/legalApi";
import { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_KEY, getCookiePolicyVersion, hasCurrentCookieConsent, readCookieConsent } from './cookieConsent';
import styles from "./FooterCookie.module.scss";
const subscribe = (onChange: () => void) => {
    const storageChanged = (event: StorageEvent) => {
        if (event.key === COOKIE_CONSENT_KEY || event.key === null) onChange();
    };
    window.addEventListener('storage', storageChanged);
    window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
    return () => {
        window.removeEventListener('storage', storageChanged);
        window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
    };
};
const getSnapshot = () => safeLocalStorage.getItem(COOKIE_CONSENT_KEY);

const CookieBanner = () => {
    const { data, isError, isFetching, refetch } = useGetLegalPageQuery('cookie-policy', {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
        pollingInterval: 60_000,
        skipPollingIfUnfocused: true,
    });
    const rawConsent = useSyncExternalStore(subscribe, getSnapshot, () => null);
    const consent = readCookieConsent(rawConsent);
    const policyVersion = getCookiePolicyVersion(data);
    const [dismissedPolicyVersion, setDismissedPolicyVersion] = useState<string | null>(null);
    const [now, setNow] = useState(() => Date.now());
    const [bannerHeight, setBannerHeight] = useState(0);
    const measureBanner = useCallback((node: HTMLElement | null) => {
        if (!node) return;
        const measure = () => setBannerHeight(node.getBoundingClientRect().height);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(node);
        return () => observer.disconnect();
    }, []);
    useEffect(() => {
        const refreshClock = () => setNow(Date.now());
        const timer = window.setInterval(refreshClock, 60_000);
        window.addEventListener('focus', refreshClock);
        window.addEventListener('storage', refreshClock);
        window.addEventListener(COOKIE_CONSENT_EVENT, refreshClock);
        return () => {
            window.clearInterval(timer);
            window.removeEventListener('focus', refreshClock);
            window.removeEventListener('storage', refreshClock);
            window.removeEventListener(COOKIE_CONSENT_EVENT, refreshClock);
        };
    }, []);
    const saveConsent = useCallback((choice: 'accepted' | 'rejected') => {
        if (!policyVersion || isError) return;
        safeLocalStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ choice, policyVersion, savedAt: Date.now() }));
        window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: { value: choice } }));
        setDismissedPolicyVersion(choice === 'rejected' ? policyVersion : null);
    }, [policyVersion, isError]);
    if (hasCurrentCookieConsent(consent, policyVersion, now)) return null;
    if (policyVersion && dismissedPolicyVersion === policyVersion && consent?.choice === 'rejected') return null;
    // Do not flash a prompt while checking a previously accepted revision.
    if (!policyVersion && isFetching && consent?.choice === 'accepted') return null;
    return (<>
      <div style={{ height: bannerHeight }} aria-hidden="true" />
      <section ref={measureBanner} className={styles.cookie} aria-label="Настройки файлов cookie">
      <div className={styles.cookie__copy}>
      <p className={styles.cookie__text}>
        Мы используем файлы cookie, чтобы обеспечить корректную работу сайта и улучшить обслуживание.{" "}
        <Link className={styles.cookie__details} to="/cookie-policy/">
          Подробнее
        </Link>
      </p>
      {(isError || (!isFetching && !policyVersion)) && <p className={styles.cookie__status} role="status">
        Не удалось загрузить условия.{' '}
        <button type="button" className={styles.cookie__details} onClick={() => void refetch()} disabled={isFetching}>Повторить</button>
      </p>}
      </div>

      <div className={styles.cookie__actions}>
        <button type="button" className={`${styles.cookie__choice} ${styles.cookie__choice_accept}`} disabled={!policyVersion || isError} onClick={() => saveConsent("accepted")}>
          Согласен
        </button>
        <button type="button" className={styles.cookie__choice} disabled={!policyVersion || isError} onClick={() => saveConsent("rejected")}>
          Не согласен
        </button>
      </div>

    </section>
    </>);
};
const FooterCookie = () => {
    const { key } = useLocation();
    // Rejection dismisses only this page visit; navigation also rechecks the policy.
    return <CookieBanner key={key} />;
};
export default FooterCookie;
