(function (w: Window, d: Document, s: string, l: string, i: string): void {
  (w as any)[l] = (w as any)[l] || [];
  (w as any)[l].push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });
  const f = d.getElementsByTagName(s)[0];
  const j = d.createElement(s) as HTMLScriptElement;
  const dl = l !== 'dataLayer' ? `&l=${l}` : '';
  j.async = true;
  j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`;
  f.parentNode?.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-M5MBN9D9');
