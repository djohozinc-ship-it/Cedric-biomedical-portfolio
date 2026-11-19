import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faExpand, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../i18n/LanguageContext';

type GalleryMedia = {
    type: 'image' | 'video';
    src: string;
    alt: string;
};

type PremiumMediaGalleryProps = {
    media: GalleryMedia[];
};

// Les médias sont servis depuis /public avec PUBLIC_URL : plus besoin de les relire depuis GitHub.
const resolveMediaSrc = (src: string) => src;

function PremiumMediaGallery({ media }: PremiumMediaGalleryProps) {
    const { t } = useLanguage();
    const prevLabel = t({ fr: 'Photo précédente', en: 'Previous photo', tr: 'Önceki fotoğraf', zh: '上一张', ru: 'Предыдущее фото' });
    const nextLabel = t({ fr: 'Photo suivante', en: 'Next photo', tr: 'Sonraki fotoğraf', zh: '下一张', ru: 'Следующее фото' });
    const closeLabel = t({ fr: 'Fermer', en: 'Close', tr: 'Kapat', zh: '关闭', ru: 'Закрыть' });
    const enlargeLabel = t({ fr: 'Agrandir', en: 'Enlarge', tr: 'Büyüt', zh: '放大', ru: 'Увеличить' });
    const images = useMemo(() => media.filter((item) => item.type === 'image'), [media]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const activeMedia = images[activeIndex];
    const activeSrc = activeMedia ? resolveMediaSrc(activeMedia.src) : '';

    useEffect(() => {
        if (!lightboxOpen) return undefined;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setLightboxOpen(false);
            if (event.key === 'ArrowRight') setActiveIndex((index) => (index + 1) % images.length);
            if (event.key === 'ArrowLeft') setActiveIndex((index) => (index - 1 + images.length) % images.length);
        };

        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [lightboxOpen, images.length]);

    if (!images.length) return null;

    const showPrevious = () => setActiveIndex((index) => (index - 1 + images.length) % images.length);
    const showNext = () => setActiveIndex((index) => (index + 1) % images.length);

    return (
        <>
            <div className="premium-gallery">
                <button
                    type="button"
                    className="premium-gallery-main"
                    onClick={() => setLightboxOpen(true)}
                    aria-label={`${enlargeLabel} : ${activeMedia.alt}`}
                >
                    <img src={activeSrc} alt={activeMedia.alt} />
                    <span className="premium-gallery-main-overlay" />
                    <span className="premium-gallery-expand"><FontAwesomeIcon icon={faExpand} /> Agrandir</span>
                    <span className="premium-gallery-counter">{String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
                </button>

                <div className="premium-gallery-caption">
                    <div>
                        <span>DOCUMENTATION VISUELLE</span>
                        <strong>{activeMedia.alt}</strong>
                    </div>
                    <div className="premium-gallery-arrows">
                        <button type="button" onClick={showPrevious} aria-label={prevLabel}><FontAwesomeIcon icon={faChevronLeft} /></button>
                        <button type="button" onClick={showNext} aria-label={nextLabel}><FontAwesomeIcon icon={faChevronRight} /></button>
                    </div>
                </div>

                <div className="premium-gallery-thumbnails" role="list" aria-label={t({ fr: 'Galerie photos', en: 'Photo gallery', tr: 'Fotoğraf galerisi', zh: '照片图库', ru: 'Фотогалерея' })}>
                    {images.map((item, index) => (
                        <button
                            type="button"
                            key={`${item.src}-${index}`}
                            className={`premium-gallery-thumbnail ${index === activeIndex ? 'is-active' : ''}`}
                            onClick={() => setActiveIndex(index)}
                            aria-label={`${t({ fr: 'Afficher la photo', en: 'Show photo', tr: 'Fotoğrafı göster', zh: '显示照片', ru: 'Показать фото' })} ${index + 1}`}
                            aria-current={index === activeIndex ? 'true' : undefined}
                        >
                            <img src={resolveMediaSrc(item.src)} alt="" loading="lazy" />
                            <span>{String(index + 1).padStart(2, '0')}</span>
                        </button>
                    ))}
                </div>
            </div>

            {lightboxOpen && (
                <div className="premium-lightbox" role="dialog" aria-modal="true" aria-label={t({ fr: 'Agrandissement de la galerie', en: 'Enlarged gallery view', tr: 'Galeri büyütülmüş görünümü', zh: '图库放大视图', ru: 'Увеличенный просмотр галереи' })} onMouseDown={(event) => { if (event.target === event.currentTarget) setLightboxOpen(false); }}>
                    <button type="button" className="premium-lightbox-close" onClick={() => setLightboxOpen(false)} aria-label={closeLabel}><FontAwesomeIcon icon={faXmark} /></button>
                    <button type="button" className="premium-lightbox-nav premium-lightbox-prev" onClick={showPrevious} aria-label={prevLabel}><FontAwesomeIcon icon={faChevronLeft} /></button>
                    <div className="premium-lightbox-content">
                        <img src={activeSrc} alt={activeMedia.alt} />
                        <div className="premium-lightbox-info">
                            <span>{String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
                            <strong>{activeMedia.alt}</strong>
                        </div>
                    </div>
                    <button type="button" className="premium-lightbox-nav premium-lightbox-next" onClick={showNext} aria-label={nextLabel}><FontAwesomeIcon icon={faChevronRight} /></button>
                </div>
            )}
        </>
    );
}

export default PremiumMediaGallery;
