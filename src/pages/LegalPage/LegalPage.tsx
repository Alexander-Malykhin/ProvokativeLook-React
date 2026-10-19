import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageStack from '@layouts/PageStack/PageStack';
import LegalPageBlock from '@components/blocks/LegalPage/LegalPage';
const LEGAL_PAGE_CODES: Record<string, string> = {
  '/public-offer': 'public-offer',
  '/terms-of-use': 'terms-of-use',
  '/privacy-policy': 'privacy-policy',
  '/cookie-policy': 'cookie-policy',
  '/personal-data-consent': 'personal-data-consent',
};
const LegalPage = () => {
  const { pathname } = useLocation();
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  const pageCode = LEGAL_PAGE_CODES[normalizedPath] ?? '';
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pageCode]);
  return (
    <PageStack>
      <LegalPageBlock pageCode={pageCode} />
    </PageStack>
  );
};
export default LegalPage;
