import React, { useCallback, useEffect, useRef, useState } from 'react';
import './HeroVideo.scss';

const publicUrl = process.env.PUBLIC_URL || '';
const VIDEO_SRC = `${publicUrl}/videos/presentation.mp4`;
const VIDEO_POSTER = `${publicUrl}/videos/presentation-poster.jpg`;

// Seuls ces gestes comptent pour le navigateur comme une « vraie » interaction qui autorise le son.
// (pointerdown tactile, scroll, survol… ne comptent PAS.)
const ACTIVATION_EVENTS = ['click', 'keydown', 'touchend', 'mousedown', 'pointerup'] as const;

// Certains navigateurs anciens (et les environnements de test) renvoient undefined au lieu d'une promesse.
const safePlay = (video: HTMLVideoElement): Promise<void> | undefined => {
    try { return video.play() as Promise<void> | undefined; } catch { return undefined; }
};

function HeroVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const visibleRef = useRef(false);
    const [muted, setMuted] = useState(true);

    const startMuted = useCallback(() => {
        const video = videoRef.current;
        if (!video || !visibleRef.current) return;
        video.muted = true;
        safePlay(video)?.catch(() => { /* lecture impossible pour l'instant */ });
    }, []);

    // Tente d'activer le son. Ne réussit que pendant un vrai geste de la personne.
    const enableSound = useCallback(() => {
        const video = videoRef.current;
        if (!video) return Promise.resolve(false);
        video.muted = false;
        video.volume = 1;
        // Hors de l'écran : on débloque seulement le son, sans relancer la lecture.
        if (!visibleRef.current) { video.pause(); return Promise.resolve(true); }
        return (safePlay(video) ?? Promise.resolve()).then(() => true).catch(() => {
            // Refusé : on repasse en muet pour que l'image continue de jouer.
            startMuted();
            return false;
        });
    }, [startMuted]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onGesture = () => {
            enableSound().then((ok) => {
                if (ok) ACTIVATION_EVENTS.forEach((e) => window.removeEventListener(e, onGesture));
            });
        };
        ACTIVATION_EVENTS.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));

        // Lecture quand la vidéo est à l'écran (haut de page), pause quand on descend.
        let observer: IntersectionObserver | undefined;
        const onVisibility = (isVisible: boolean) => {
            visibleRef.current = isVisible;
            if (!isVisible) { video.pause(); return; }
            // Si le son est déjà débloqué on le garde, sinon on démarre en muet.
            (safePlay(video) ?? Promise.resolve()).catch(startMuted);
        };
        if (typeof IntersectionObserver === 'undefined') {
            onVisibility(true);
        } else {
            observer = new IntersectionObserver(([entry]) => onVisibility(entry.isIntersecting), { threshold: 0.35 });
            observer.observe(video);
        }

        // Onglet masqué : pause ; retour sur l'onglet : reprise seulement si la vidéo est à l'écran.
        const onTabChange = () => {
            if (document.hidden) video.pause();
            else if (visibleRef.current) (safePlay(video) ?? Promise.resolve()).catch(startMuted);
        };
        document.addEventListener('visibilitychange', onTabChange);

        return () => {
            document.removeEventListener('visibilitychange', onTabChange);
            observer?.disconnect();
            ACTIVATION_EVENTS.forEach((e) => window.removeEventListener(e, onGesture));
            video.pause();
        };
    }, [enableSound, startMuted]);

    const toggleSound = (event: React.MouseEvent) => {
        event.stopPropagation();
        const video = videoRef.current;
        if (!video) return;
        if (video.muted) enableSound();
        else video.muted = true;
    };

    return (
        <div className="hero-video">
            <video
                ref={videoRef}
                src={VIDEO_SRC}
                poster={VIDEO_POSTER}
                muted
                loop
                playsInline
                preload="metadata"
                disablePictureInPicture
                onVolumeChange={(e) => setMuted((e.currentTarget as HTMLVideoElement).muted)}
                onContextMenu={(e) => e.preventDefault()}
            />
            <button
                type="button"
                className={`hero-video-sound${muted ? ' is-muted' : ''}`}
                onClick={toggleSound}
                aria-label={muted ? 'Activer le son' : 'Couper le son'}
                aria-pressed={!muted}
            >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                    <path d="M3 9v6h4l5 4V5L7 9H3z" />
                    {muted
                        ? <path d="M16.5 9.5l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                        : <path d="M15 8.5a5 5 0 010 7M17.5 6a8.5 8.5 0 010 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />}
                </svg>
            </button>
        </div>
    );
}

export default HeroVideo;
