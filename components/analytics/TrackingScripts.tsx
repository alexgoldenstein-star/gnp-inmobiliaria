import Script from 'next/script'

const GA_ID  = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
const META_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

// Google Tag unifica GA4 + Google Ads en un solo snippet
const GTAG_ID = ADS_ID ?? GA_ID

export default function TrackingScripts() {
  if (!GA_ID && !ADS_ID && !META_ID) return null

  return (
    <>
      {/* ── Google Tag (Analytics 4 + Google Ads) ── */}
      {GTAG_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            ${GA_ID ? `gtag('config', '${GA_ID}', { page_path: window.location.pathname });` : ''}
            ${ADS_ID ? `gtag('config', '${ADS_ID}');` : ''}
          `}</Script>
        </>
      )}

      {/* ── Meta Pixel ── */}
      {META_ID && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${META_ID}');fbq('track','PageView');
          `}</Script>
          <noscript>
            <img height="1" width="1" style={{display:'none'}}
              src={`https://www.facebook.com/tr?id=${META_ID}&ev=PageView&noscript=1`} alt="" />
          </noscript>
        </>
      )}
    </>
  )
}
