// components/MobileNoticeWrapper.tsx
"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MobileNotice = dynamic(
    () => import('@/components/MobileNotice'),
    { ssr: false }
);

const MobileNoticeWrapper = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return <MobileNotice />;
};

export default MobileNoticeWrapper;