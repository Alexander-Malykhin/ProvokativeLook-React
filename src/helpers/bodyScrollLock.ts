const locks = new Set<symbol>();
let originalOverflow = '';
let originalPriority = '';

// Modal transitions can overlap. Only the last owner restores page scrolling.
export const lockBodyScroll = (): (() => void) => {
    const token = Symbol('body-scroll-lock');
    if (locks.size === 0) {
        originalOverflow = document.body.style.getPropertyValue('overflow');
        originalPriority = document.body.style.getPropertyPriority('overflow');
        document.body.style.setProperty('overflow', 'hidden');
    }
    locks.add(token);
    return () => {
        if (!locks.delete(token) || locks.size > 0) return;
        if (originalOverflow) document.body.style.setProperty('overflow', originalOverflow, originalPriority);
        else document.body.style.removeProperty('overflow');
    };
};
