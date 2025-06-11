// components/MobileNotice.tsx
"use client"; // Adicione esta diretiva no topo

import { useState, useEffect } from 'react';
import styles from './MobileNotice.module.css';

const MobileNotice = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Verifica se é mobile
        const checkIsMobile = () => {
            const isMobile = window.innerWidth <= 768;
            setIsVisible(isMobile);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => setIsVisible(false), 500);
    };

    if (!isVisible) return null;

    return (
        <div className={`${styles.container} ${isClosing ? styles.fadeOut : styles.pulse}`}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <span className={styles.icon}>📱</span>
                    <h3 className={styles.title}>Versão Mobile</h3>
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        aria-label="Fechar aviso"
                    >
                        &times;
                    </button>
                </div>

                <div className={styles.message}>
                    <p>Estamos trabalhando na melhor experiência para seu dispositivo!</p>
                    <div className={styles.progressBar}>
                        <div className={styles.progress} />
                    </div>
                    <p className={styles.footerNote}>Use um computador para a melhor experiência atual</p>
                </div>
            </div>
        </div>
    );
};

export default MobileNotice;