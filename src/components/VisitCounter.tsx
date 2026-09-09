import React, { useEffect, useState } from 'react';
import './VisitCounter.scss';

const VISITOR_API = 'https://visitor.6developer.com/visit';
const FALLBACK_COUNTER_API =
  'https://countapi.mileshilliard.com/api/v1/hit/cedric-biomedical-portfolio-visits';
const PORTFOLIO_DOMAIN = window.location.hostname;

function VisitCounter() {
  const [visitors, setVisitors] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const registerVisitor = async () => {
      try {
        const response = await fetch(VISITOR_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domain: PORTFOLIO_DOMAIN,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            page_path: window.location.pathname,
            page_title: document.title,
            referrer: document.referrer,
          }),
        });

        if (!response.ok) throw new Error('Primary visitor API failed');

        const data = await response.json();
        const totalCount = Number(data.totalCount);

        if (!Number.isFinite(totalCount)) {
          throw new Error('Primary visitor API returned an invalid count');
        }

        if (!cancelled) setVisitors(totalCount);
      } catch {
        // Fallback for when the primary visitor service is unavailable.
        // This counter is a persistent page-visit counter and does not use localStorage.
        try {
          const fallbackResponse = await fetch(FALLBACK_COUNTER_API, {
            method: 'GET',
            cache: 'no-store',
          });

          if (!fallbackResponse.ok) throw new Error('Fallback counter failed');

          const fallbackData = await fallbackResponse.json();
          const fallbackCount = Number(fallbackData.value);

          if (!Number.isFinite(fallbackCount)) {
            throw new Error('Fallback counter returned an invalid count');
          }

          if (!cancelled) setVisitors(fallbackCount);
        } catch {
          if (!cancelled) setVisitors(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    registerVisitor();

    return () => {
      cancelled = true;
    };
  }, []);

  const formattedVisitors = visitors?.toLocaleString('fr-FR') ?? '—';

  return (
    <section
      className="visit-counter"
      aria-label={
        visitors === null
          ? 'Compteur de visiteurs du portfolio'
          : `${formattedVisitors} visiteurs du portfolio`
      }
    >
      <div className="visit-counter-icon" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="visit-counter-copy">
        <span className="visit-counter-label">VISITEURS DU PORTFOLIO</span>

        <strong aria-live="polite">{loading ? '…' : formattedVisitors}</strong>

        <span className="visit-counter-description">
          visiteurs enregistrés depuis toutes les plateformes
        </span>
      </div>

      <span className="visit-counter-status" aria-hidden="true" />
    </section>
  );
}

export default VisitCounter;
