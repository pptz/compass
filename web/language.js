(() => {
  'use strict';
  const supported = ['en', 'he', 'ru'];
  const normalize = tag => {
    const base = String(tag || '').toLowerCase().split('-')[0];
    return base === 'iw' ? 'he' : base;
  };
  window.compassInitialLanguage = () => {
    const requested = normalize(new URLSearchParams(location.search).get('lang'));
    if (supported.includes(requested)) return requested;
    const preferences = navigator.languages?.length ? navigator.languages : [navigator.language];
    return preferences.map(normalize).find(lang => supported.includes(lang)) || 'en';
  };
})();
