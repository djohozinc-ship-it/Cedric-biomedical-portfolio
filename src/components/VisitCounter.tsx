import React, { useEffect, useState } from 'react';
import './VisitCounter.scss';

const VISIT_STORAGE_KEY = 'cedric-biomedical-portfolio-visit-count';
const ANIMATION_DURATION = 900;

function readAndIncrementVisits() {
  try {
    const stored = Number.parseInt(
      window.localStorage.getItem(VISIT_STORAGE_KEY) ?? '0',
      10
    );

    const visits = Number.isFinite(stored) && stored >= 0
      ? stored + 1
      : 1;

    window.localStorage.setItem(VISIT_STORAGE_KEY, String(visits));
    return visits;
  } catch {
    return 1;
  }
}

function VisitCounter() {
  const [visits, setVisits] = useState(0);
  const [displayedVisits, setDisplayedVisits] = useState(0);

  useEffect(() => {
    setVisits(readAndIncrementVisits());
  }, []);

  useEffect(() => {
    if (!visits) return;

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      setDisplayedVisits(visits);
      return;
    }

    const start = performance.now();
    let animationFrame = 0;

    const animate = (now: number) => {
      const progress = Math.min(
        (now - start) / ANIMATION_DURATION,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayedVisits(Math.round(visits * eased));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [visits]);

  return (
    <section
      className="visit-counter"
      aria-label={`${visits} visites de ce portfolio depuis ce navigateur`}
    >
      <div className="visit-counter-orbit" aria-hidden="true">
        <span />
      </div>

      <div className="visit-counter-copy">
        <span className="visit-counter-label">VOTRE PARCOURS ICI</span>

        <strong>{displayedVisits.toLocaleString('fr-FR')}</strong>

        <span className="visit-counter-description">
          {visits === 1
            ? 'première visite depuis ce navigateur'
            : 'visites depuis ce navigateur'}
        </span>
      </div>

      <div className="visit-counter-signal" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    </section>
  );
}

export default VisitCounter;