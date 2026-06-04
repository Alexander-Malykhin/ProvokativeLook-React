import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToHash = () => {
    const { hash } = useLocation();

    useEffect(() => {
        if (!hash) return;

        document.querySelector(hash)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }, [hash]);

    return null;
};

export default ScrollToHash;