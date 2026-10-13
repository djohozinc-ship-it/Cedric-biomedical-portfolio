import React, { useEffect, useRef, useState } from 'react';
import './HeroVideo.scss';

// Place ta vidéo dans public/videos/presentation.mp4 (et, en option, une image
// d'aperçu dans public/videos/presentation-poster.jpg).
const publicUrl = process.env.PUBLIC_URL || '';
const VIDEO_SRC = `${publicUrl}/videos/presentation.mp4`;
const VIDEO_POSTER = `${publicUrl}/videos/presentation-poster.jpg`;

function HeroVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [paused, setPaused] = useState(true);

    // Met la vidéo en pause quand elle sort de l'écran (économise la batterie et évite le son hors de vue).
    useEffect(() => {
        const video = videoRef.current;
        if (!video || typeof IntersectionObserver === 'undefined') return;
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting && !video.paused) video.pause();
        }, { threshold: 0.25 });
        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    // Les navigateurs interdisent la lecture automatique avec du son : la lecture démarre au clic.
    const toggle = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play().catch(() => { /* lecture refusée : l'utilisateur peut réessayer */ });
        } else {
            video.pause();
        }
    };

    return (
        <div className={`hero-video${paused ? ' is-paused' : ''}`}>
            <video
                ref={videoRef}
                src={VIDEO_SRC}
                poster={VIDEO_POSTER}
                controls
                playsInline
                preload="metadata"
                onPlay={() => setPaused(false)}
                onPause={() => setPaused(true)}
                onEnded={() => setPaused(true)}
                onClick={toggle}
            />
            {paused && (
                <button type="button" className="hero-video-play" onClick={toggle} aria-label="Lancer la vidéo">
                    ▶
                </button>
            )}
        </div>
    );
}

export default HeroVideo;
