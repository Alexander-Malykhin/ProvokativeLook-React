import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import type { ProfileAddress } from '@components/blocks/Profile/subpages/ProfileAddresses/model/types';
import styles from './SavedAddressSelect.module.scss';

export default function SavedAddressSelect({ addresses, selectedId, label, disabled, onSelect }: {
    addresses: ProfileAddress[];
    selectedId?: number;
    label: string;
    disabled: boolean;
    onSelect: (address: ProfileAddress) => void;
}) {
    const id = useId();
    const root = useRef<HTMLDivElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const expanded = open && !disabled && addresses.length > 0;
    const selectedIndex = addresses.findIndex(address => address.id === selectedId);
    const currentIndex = Math.min(activeIndex, Math.max(0, addresses.length - 1));

    useEffect(() => {
        if (!expanded) return;
        const outside = (event: PointerEvent) => {
            if (!root.current?.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener('pointerdown', outside);
        return () => document.removeEventListener('pointerdown', outside);
    }, [expanded]);

    useEffect(() => {
        if (expanded) root.current?.querySelectorAll('[role="option"]')[currentIndex]?.scrollIntoView({ block: 'nearest' });
    }, [expanded, currentIndex]);

    const choose = (address: ProfileAddress) => {
        setOpen(false);
        onSelect(address);
        trigger.current?.focus({ preventScroll: true });
    };
    const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Escape') {
            if (expanded) { event.preventDefault(); event.stopPropagation(); setOpen(false); }
            return;
        }
        if (event.key === 'Tab') { setOpen(false); return; }
        if (!addresses.length) return;
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? addresses.length - 1
                : !expanded ? Math.max(0, selectedIndex)
                : Math.max(0, Math.min(addresses.length - 1, currentIndex + (event.key === 'ArrowDown' ? 1 : -1)));
            setActiveIndex(next); setOpen(true);
        } else if (expanded && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault(); choose(addresses[currentIndex]);
        }
    };

    return <div ref={root} className={styles.select} onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
        <span id={`${id}-label`} className={styles.label}>{label}</span>
        <button ref={trigger} type="button" role="combobox" aria-labelledby={`${id}-label`}
            aria-expanded={expanded} aria-haspopup="listbox" aria-controls={`${id}-list`}
            aria-activedescendant={expanded ? `${id}-option-${currentIndex}` : undefined}
            className={styles.trigger} disabled={disabled || addresses.length === 0} onKeyDown={onKeyDown}
            onClick={() => { setActiveIndex(Math.max(0, selectedIndex)); setOpen(!expanded); }}>
            <span>{addresses[selectedIndex]?.formattedAddress || (addresses.length ? 'Выберите сохранённый адрес' : 'Пока нет сохранённых адресов')}</span>
            <span className={styles.arrow} aria-hidden="true"/>
        </button>
        {expanded && <div id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`} className={styles.list}>
            {addresses.map((address, index) => <button key={address.id} id={`${id}-option-${index}`} type="button"
                role="option" aria-selected={address.id === selectedId} tabIndex={-1} className={styles.option}
                data-active={index === currentIndex} onPointerMove={() => setActiveIndex(index)}
                onMouseDown={event => event.preventDefault()} onClick={() => choose(address)}>
                <span>{address.formattedAddress}</span>
                {address.id === selectedId && <span className={styles.check} aria-hidden="true"/>}
            </button>)}
        </div>}
    </div>;
}
