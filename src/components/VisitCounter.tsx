import React, { useEffect, useState } from 'react';
import './VisitCounter.scss';

const VISITOR_API = 'https://visitor.6developer.com/visit';
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

        if (!response.ok) throw new Error('Visitor counter request failed');

        const data = await response.json();

        if (!cancelled && Number.isFinite(data.totalCount)) {
          setVisitors(data.totalCount);
        }
      } catch {
        if (!cancelled) setVisitors(null);
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

        <strong aria-live="polite">
          {loading ? '…' : formattedVisitors}
        </strong>

        <span className="visit-counter-description">
          visiteurs enregistrés depuis toutes les plateformes
        </span>
      </div>

      <span className="visit-counter-status" aria-hidden="true" />
    </section>
  );
}

export default VisitCounter;
