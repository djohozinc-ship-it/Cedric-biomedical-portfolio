import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import { galleryItems, GalleryItem } from '../data/gallery';
import '../assets/styles/Gallery.scss';
import { Lang, Tr, useLanguage } from '../i18n/LanguageContext';
import { galleryCategories, galleryTitles } from '../i18n/galleryTranslations';

const publicUrl = process.env.PUBLIC_URL || '';
const ALL = 'Tous';
const PAGE_SIZE = 9;
const srcOf = (item: GalleryItem) => `${publicUrl}/images/gallery/${item.file}`;

// Titre et description d'une photo dans la langue choisie (repli : français).
// Hors français, la description pour lecteurs d'écran reprend le titre traduit.
const titleOf = (item: GalleryItem, lang: Lang) => (lang === 'fr' ? item.title : galleryTitles[item.file]?.[lang as Exclude<Lang, 'fr'>] ?? item.title);
const altOf = (item: GalleryItem, lang: Lang) => {
    const translated = titleOf(item, lang);
    return lang === 'fr' || translated === item.title ? item.alt || item.title : translated;
};
const ALL_LABEL: Tr = { fr: 'Tous', en: 'All', tr: 'Tümü', zh: '全部', ru: 'Все' };
const categoryLabel = (category: string, t: <T = string>(text: Tr<T>) => T) =>
    category === ALL ? t(ALL_LABEL) : galleryCategories[category] ? t(galleryCategories[category]) : category;

/* ---------- Vignette : apparaît en douceur quand elle entre à l’écran ---------- */

function Tile({ item, index, onOpen }: { item: GalleryItem; index: number; onOpen: () => void }) {
    const { t, lang } = useLanguage();
    const title = titleOf(item, lang);
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
            <button type="button" className="gl-tile" onClick={onOpen} aria-label={`${t({ fr: 'Agrandir la photo', en: 'Enlarge photo', tr: 'Fotoğrafı büyüt', zh: '放大照片', ru: 'Увеличить фото' })} : ${title}`}>
                <img
                    src={srcOf(item)}
                    alt={altOf(item, lang)}
                    width={item.width}
                    height={item.height}
                    style={ratio ? { aspectRatio: ratio } : undefined}
                    loading="lazy"
                    decoding="async"
                />
                <span className="gl-caption">
                    <span className="gl-caption-category">{categoryLabel(item.category, t)}</span>
                    <span className="gl-caption-title">{title}</span>
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
    const { t, lang } = useLanguage();
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
            aria-label={t({ fr: 'Visionneuse de photos', en: 'Photo viewer', tr: 'Fotoğraf görüntüleyici', zh: '照片查看器', ru: 'Просмотр фотографий' })}
            onClick={onClose}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <div className="gl-lightbox-top" onClick={(event) => event.stopPropagation()}>
                <span className="gl-lightbox-count" aria-live="polite">{index + 1} / {total}</span>
                <button ref={closeRef} type="button" className="gl-lightbox-btn" onClick={onClose} aria-label={t({ fr: 'Fermer', en: 'Close', tr: 'Kapat', zh: '关闭', ru: 'Закрыть' })}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>

            {total > 1 && (
                <button type="button" className="gl-lightbox-btn gl-prev" onClick={(event) => { event.stopPropagation(); go(-1); }} aria-label={t({ fr: 'Photo précédente', en: 'Previous photo', tr: 'Önceki fotoğraf', zh: '上一张', ru: 'Предыдущее фото' })}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
            )}

            <figure className="gl-lightbox-stage" onClick={(event) => event.stopPropagation()}>
                <img key={item.file} src={srcOf(item)} alt={altOf(item, lang)} />
                <figcaption>
                    <span className="gl-caption-category">{categoryLabel(item.category, t)}</span>
                    <span className="gl-lightbox-title">{titleOf(item, lang)}</span>
                </figcaption>
            </figure>

            {total > 1 && (
                <button type="button" className="gl-lightbox-btn gl-next" onClick={(event) => { event.stopPropagation(); go(1); }} aria-label={t({ fr: 'Photo suivante', en: 'Next photo', tr: 'Sonraki fotoğraf', zh: '下一张', ru: 'Следующее фото' })}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            )}
        </div>,
        document.body
    );
}

/* ---------- Section ---------- */

function Gallery() {
    const { t } = useLanguage();
    const [filter, setFilter] = useState<string>(ALL);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const categories = useMemo(() => [ALL, ...Array.from(new Set(galleryItems.map((item) => item.category)))], []);
    const items = useMemo(() => (filter === ALL ? galleryItems : galleryItems.filter((item) => item.category === filter)), [filter]);

    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    useEffect(() => { setVisibleCount(PAGE_SIZE); }, [filter]);
    const shown = items.slice(0, visibleCount);

    const closeLightbox = useCallback(() => setOpenIndex(null), []);

    return (
        <div className="gallery-container" id="gallery">
            <header className="gl-heading">
                <h1 aria-level={2}>{t({ fr: 'Galerie', en: 'Gallery', tr: 'Galeri', zh: '图库', ru: 'Галерея' })}</h1>
                <p>{t({ fr: 'Des images du terrain, de l’atelier et de l’écran : ce que le travail donne à voir.', en: 'Images from the field, the workshop and the screen: what the work gives to see.', tr: 'Sahadan, atölyeden ve ekrandan görüntüler: çalışmanın gözle görülen yüzü.', zh: '来自现场、工作坊和屏幕的画面：工作的可见成果。', ru: 'Кадры с объекта, из мастерской и с экрана — то, что можно увидеть в работе.' })}</p>
            </header>

            {categories.length > 2 && (
                <div className="gl-filters" role="group" aria-label={t({ fr: 'Filtrer les photos par catégorie', en: 'Filter photos by category', tr: 'Fotoğrafları kategoriye göre filtrele', zh: '按类别筛选照片', ru: 'Фильтр фотографий по категории' })}>
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            className="gl-chip"
                            aria-pressed={filter === category}
                            onClick={() => setFilter(category)}
                        >
                            {categoryLabel(category, t)}
                            <span className="gl-chip-count">
                                {category === ALL ? galleryItems.length : galleryItems.filter((item) => item.category === category).length}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            <ul className="gl-grid" key={filter}>
                {shown.map((item, index) => (
                    <Tile key={item.file} item={item} index={index} onOpen={() => setOpenIndex(index)} />
                ))}
            </ul>

            {items.length > visibleCount && (
                <div className="gl-more">
                    <button type="button" className="gl-chip" onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}>
                        {t({ fr: 'Voir plus de photos', en: 'See more photos', tr: 'Daha fazla fotoğraf', zh: '查看更多照片', ru: 'Показать больше фото' })}
                        <span className="gl-chip-count">{items.length - visibleCount}</span>
                    </button>
                </div>
            )}

            {openIndex !== null && (
                <Lightbox items={items} index={openIndex} onClose={closeLightbox} onChange={setOpenIndex} />
            )}
        </div>
    );
}

export default Gallery;
