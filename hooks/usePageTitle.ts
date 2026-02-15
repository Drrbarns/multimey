'use client';

import { useEffect } from 'react';

const SITE_NAME = 'Classy Debbie Collection';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Premium Women's Fashion & Accessories`;
  }, [title]);
}
