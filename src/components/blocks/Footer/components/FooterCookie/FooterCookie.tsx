import { safeLocalStorage, safeSessionStorage } from "@helpers/browserStorage";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./FooterCookie.module.scss";
const COOKIE_CONSENT_KEY = "provokativelook.cookie-consent";
const COOKIE_CONSENT_DATE_KEY = "provokativelook.cookie-consent-date";
const COOKIE_POLICY_VERSION_KEY = "provokativelook.cookie-policy-version";
const COOKIE_DISMISSED_KEY = "provokativelook.cookie-dismissed";
const COOKIE_POLICY_VERSION = "2026-09-03";
const COOKIE_CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;

const hasCurrentConsent = () => {
    const choice = safeLocalStorage.getItem(COOKIE_CONSENT_KEY);
    const savedAt = Number(safeLocalStorage.getItem(COOKIE_CONSENT_DATE_KEY));
    const version = safeLocalStorage.getItem(COOKIE_POLICY_VERSION_KEY);

    return ((choice === "accepted" || choice === "rejected") &&
        Number.isFinite(savedAt) &&
        savedAt > 0 &&
        Date.now() - savedAt < COOKIE_CONSENT_MAX_AGE &&
        version === COOKIE_POLICY_VERSION);
};

const FooterCookie = () => {
    const [isVisible, setIsVisible] = useState(() => {
        try {
            return (!hasCurrentConsent() &&
                !safeSessionStorage.getItem(COOKIE_DISMISSED_KEY));
        }
        catch {
            return true;
        }
    });
    const saveConsent = (value: "accepted" | "rejected") => {
        try {
            safeLocalStorage.setItem(COOKIE_CONSENT_KEY, value);
            safeLocalStorage.setItem(COOKIE_CONSENT_DATE_KEY, String(Date.now()));
            safeLocalStorage.setItem(COOKIE_POLICY_VERSION_KEY, COOKIE_POLICY_VERSION);
        }
        catch {
            // Баннер всё равно закрывается, даже если хранилище браузера недоступно.
        }
        window.dispatchEvent(new CustomEvent("provokativelook:cookie-consent", {
            detail: { value },
        }));
        setIsVisible(false);
    };
    const dismiss = () => {
        try {
            safeSessionStorage.setItem(COOKIE_DISMISSED_KEY, "1");
        }
        catch {
            // Закрытие работает и при заблокированном sessionStorage.
        }
        setIsVisible(false);
    };
    if (!isVisible)
        return null;
    return (<div className={styles.cookie} role="region" aria-label="Настройки файлов cookie">
      <p className={styles.cookie__text}>
        Мы используем файлы cookie, чтобы обеспечить корректную работу сайта и улучшить обслуживание.{" "}
        <Link className={styles.cookie__details} to="/cookie-policy/">
          Подробнее
        </Link>
      </p>

      <div className={styles.cookie__actions}>
        <button type="button" className={`${styles.cookie__choice} ${styles.cookie__choice_accept}`} onClick={() => saveConsent("accepted")}>
          Согласен
        </button>
        <button type="button" className={styles.cookie__choice} onClick={() => saveConsent("rejected")}>
          Не согласен
        </button>
      </div>

      <button type="button" className={styles.cookie__button} onClick={dismiss} aria-label="Закрыть уведомление о cookie">
        <span className={styles.cookie__button_line}></span>
        <span className={styles.cookie__button_line}></span>
      </button>
    </div>);
};
export default FooterCookie;
