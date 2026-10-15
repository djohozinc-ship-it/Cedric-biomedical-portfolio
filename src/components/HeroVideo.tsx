import React, { useEffect, useRef } from 'react';
import './HeroVideo.scss';

// Place ta vidéo dans public/videos/presentation.mp4 (et, en option, une image
// d'aperçu dans public/videos/presentation-poster.jpg).
const publicUrl = process.env.PUBLIC_URL || '';
const VIDEO_SRC = `${publicUrl}/videos/presentation.mp4`;
const VIDEO_POSTER = `${publicUrl}/videos/presentation-poster.jpg`;

function HeroVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let visible = false;
        let unlocked = false; // le navigateur autorise-t-il le son ?

        const play = () => {
            if (!visible) return;
            video.muted = !unlocked;
            video.play().catch(() => {
                // Son refusé par le navigateur : on relance sans le son, il sera activé au premier geste.
                video.muted = true;
                video.play().catch(() => { /* lecture impossible pour l'instant */ });
            });
        };

        // Les navigateurs interdisent le son tant que la personne n'a pas interagi avec la page :
        // au premier clic / toucher / touche, on active le son sans rien afficher.
        const unlock = () => {
            unlocked = true;
            video.muted = false;
            if (visible && video.paused) play();
            removeListeners();
        };
        const events: Array<keyof WindowEventMap> = ['pointerdown', 'touchend', 'keydown', 'click'];
        const removeListeners = () => events.forEach((e) => window.removeEventListener(e, unlock));
        events.forEach((e) => window.addEventListener(e, unlock, { passive: true }));

        // Lecture quand la vidéo est à l'écran (en haut de page), pause quand on descend.
        let observer: IntersectionObserver | undefined;
        if (typeof IntersectionObserver === 'undefined') {
            visible = true;
            play();
        } else {
            observer = new IntersectionObserver(([entry]) => {
                visible = entry.isIntersecting;
                if (visible) play();
                else video.pause();
            }, { threshold: 0.35 });
            observer.observe(video);
        }

        return () => {
            observer?.disconnect();
            removeListeners();
            video.pause();
        };
    }, []);

    return (
        <div className="hero-video">
            <video
                ref={videoRef}
                src={VIDEO_SRC}
                poster={VIDEO_POSTER}
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                controlsList="nodownload noplaybackrate noremoteplayback"
                onContextMenu={(e) => e.preventDefault()}
            />
        </div>
    );
}

export default HeroVideo;
