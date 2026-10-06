import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import { galleryItems, GalleryItem } from '../data/gallery';
import '../assets/styles/Gallery.scss';

const publicUrl = process.env.PUBLIC_URL || '';
const ALL = 'Tous';
const srcOf = (item: GalleryItem) => `${publicUrl}/images/gallery/${item.file}`;

/* ---------- Vignette : apparaît en douceur quand elle entre à l’écran ---------- */

function Tile({ item, index, onOpen }: { item: GalleryItem; index: number; onOpen: () => void }) {
    const ref = useRef<HTMLLIElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element || typeof IntersectionObserver === 'undefined') {
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true);
                observer.disconnect();
            }
        }, { rootMargin: '0px 0px -8% 0px' });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    const ratio = item.width && item.height ? `${item.width} / ${item.height}` : undefined;

    return (
        <li ref={ref} className={`gl-item${visible ? ' is-visible' : ''}`} style={{ transitionDelay: `${(index % 3) * 90}ms` }}>
            <button type="button" className="gl-tile" onClick={onOpen} aria-label={`Agrandir la photo : ${item.title}`}>
                <img
                    src={srcOf(item)}
                    alt={item.alt || item.title}
                    width={item.width}
                    height={item.height}
                    style={ratio ? { aspectRatio: ratio } : undefined}
                    loading="lazy"
                    decoding="async"
                />
                <span className="gl-caption">
                    <span className="gl-caption-category">{item.category}</span>
                    <span className="gl-caption-title">{item.title}</span>
                </span>
            </button>
        </li>
    );
}

/* ---------- Agrandissement plein écran ---------- */

type LightboxProps = {
    items: GalleryItem[];
    index: number;
    onClose: () => void;
    onChange: (index: number) => void;
};

function Lightbox({ items, index, onClose, onChange }: LightboxProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const touchStartX = useRef<number | null>(null);
    const item = items[index];
    const total = items.length;

    const go = useCallback((step: number) => onChange((index + step + total) % total), [index, total, onChange]);

    // Clavier : Échap, flèches, et piège à focus (Tab reste dans la fenêtre).
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') { onClose(); return; }
            if (event.key === 'ArrowRight') { go(1); return; }
            if (event.key === 'ArrowLeft') { go(-1); return; }
            if (event.key === 'Tab' && dialogRef.current) {
                const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled])'));
                if (!focusable.length) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
                else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [go, onClose]);

    // Bloque le défilement de la page derrière, et rend le focus au bouton d’origine à la fermeture.
    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        return () => {
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus?.();
        };
    }, []);

    // Précharge les photos voisines pour que le passage soit instantané.
    useEffect(() => {
        [index - 1, index + 1].forEach((i) => {
            const neighbour = items[(i + total) % total];
            if (neighbour) new Image().src = srcOf(neighbour);
        });
    }, [index, items, total]);

    const onTouchStart = (event: React.TouchEvent) => { touchStartX.current = event.touches[0].clientX; };
    const onTouchEnd = (event: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const delta = event.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
    };

    return createPortal(
        <div
            ref={dialogRef}
            className="gl-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Visionneuse de photos"
            onClick={onClose}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <div className="gl-lightbox-top" onClick={(event) => event.stopPropagation()}>
                <span className="gl-lightbox-count" aria-live="polite">{index + 1} / {total}</span>
                <button ref={closeRef} type="button" className="gl-lightbox-btn" onClick={onClose} aria-label="Fermer">
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>

            {total > 1 && (
                <button type="button" className="gl-lightbox-btn gl-prev" onClick={(event) => { event.stopPropagation(); go(-1); }} aria-label="Photo précédente">
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
            )}

            <figure className="gl-lightbox-stage" onClick={(event) => event.stopPropagation()}>
                <img key={item.file} src={srcOf(item)} alt={item.alt || item.title} />
                <figcaption>
                    <span className="gl-caption-category">{item.category}</span>
                    <span className="gl-lightbox-title">{item.title}</span>
                </figcaption>
            </figure>

            {total > 1 && (
                <button type="button" className="gl-lightbox-btn gl-next" onClick={(event) => { event.stopPropagation(); go(1); }} aria-label="Photo suivante">
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            )}
        </div>,
        document.body
    );
}

/* ---------- Section ---------- */

function Gallery() {
    const [filter, setFilter] = useState<string>(ALL);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const categories = useMemo(() => [ALL, ...Array.from(new Set(galleryItems.map((item) => item.category)))], []);
    const items = useMemo(() => (filter === ALL ? galleryItems : galleryItems.filter((item) => item.category === filter)), [filter]);

    const closeLightbox = useCallback(() => setOpenIndex(null), []);

    return (
        <div className="gallery-container" id="gallery">
            <header className="gl-heading">
                <h1>Galerie</h1>
                <p>Des images du terrain, de l’atelier et de l’écran : ce que le travail donne à voir.</p>
            </header>

            {categories.length > 2 && (
                <div className="gl-filters" role="group" aria-label="Filtrer les photos par catégorie">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            className="gl-chip"
                            aria-pressed={filter === category}
                            onClick={() => setFilter(category)}
                        >
                            {category}
                            <span className="gl-chip-count">
                                {category === ALL ? galleryItems.length : galleryItems.filter((item) => item.category === category).length}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            <ul className="gl-grid" key={filter}>
                {items.map((item, index) => (
                    <Tile key={item.file} item={item} index={index} onOpen={() => setOpenIndex(index)} />
                ))}
            </ul>

            {openIndex !== null && (
                <Lightbox items={items} index={openIndex} onClose={closeLightbox} onChange={setOpenIndex} />
            )}
        </div>
    );
}

export default Gallery;
