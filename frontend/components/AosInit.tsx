'use client';

import { useEffect } from 'react';
import 'aos/dist/aos.css';
// @ts-ignore
import AOS from 'aos';

export default function AosInit() {
    useEffect(() => {
        AOS.init({ once: true, offset: 50, duration: 800 });
    }, []);
    return null;
}
