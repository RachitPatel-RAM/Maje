/**
 * MaJe Technologies — SEO Meta Tags Manager
 * Injects Open Graph, Twitter Card, and additional SEO meta tags
 * Include this script on every page: <script src="seo-meta.js"></script>
 */

(function() {
  'use strict';

  const SITE_URL = 'https://majetech.in';
  const SITE_NAME = 'MaJe Technologies';
  const DEFAULT_IMAGE = SITE_URL + '/og-image.png';
  const TWITTER_HANDLE = '@majetech';

  // Page-specific meta configurations
  const pageMetaConfig = {
    'index': {
      title: 'MaJe Technologies | Web Development, Video Production & Digital Growth Agency',
      description: 'MaJe Technologies (Est. 2024, Rajkot) delivers elite web development, mobile apps, 4K commercial video production, anchoring reels, and high-ROAS Meta, Google & Telegram ad campaigns for clients across India, USA, UK, Australia, Europe & Dubai.',
      keywords: 'web development company Rajkot, website development near me, custom web application, commercial video production, anchoring reels, Meta ads agency, Google ads specialist, Telegram advertising, web development India USA Australia UK Dubai, MaJe Technologies, majetech.in',
      ogType: 'website',
      canonical: '/'
    },
    'services': {
      title: 'Services | Web, Mobile, AI, Video Shoots & Paid Ads | MaJe Technologies',
      description: 'Full-spectrum digital services: Custom Web Development, Mobile Apps, AI Automation, Commercial Video Production, Professional Anchoring Reels, and High-Performance Meta, Google & Telegram Ads.',
      keywords: 'web development services, mobile app development, commercial video shoot, reel anchoring, Meta ads management, Google PPC ads, Telegram sponsored ads, AI automation, Rajkot India global',
      ogType: 'website',
      canonical: '/services.html'
    },
    'about': {
      title: 'About MaJe Technologies | Founded 2024 | Mavdi, Rajkot & Global',
      description: 'Founded in 2024 on New 150 Feet Ring Road, Mavdi, Rajkot, MaJe Technologies empowers ambitious brands in India, the US, UK, Australia, Germany, Italy, Monaco, and Dubai with world-class digital solutions and creative media.',
      keywords: 'about MaJe Technologies, tech company Rajkot Gujarat, software development agency Mavdi, video production company, digital agency founded 2024',
      ogType: 'website',
      canonical: '/about.html'
    },
    'cases': {
      title: 'Work Portfolio & Proof | Video Production, Ads & Web Apps | MaJe Technologies',
      description: 'Explore verified portfolio projects by MaJe Technologies: commercial video advertisements, viral anchoring reels, multi-channel ad campaigns (Meta, Google, Telegram), and web platforms.',
      keywords: 'portfolio MaJe Technologies, video production proof, commercial ad reel, Meta ads case studies, Telegram ad campaigns, web development portfolio, client projects',
      ogType: 'website',
      canonical: '/cases.html'
    },
    'contact': {
      title: 'Contact MaJe Technologies | Mavdi, Rajkot | Call & WhatsApp +91-9408272121',
      description: 'Reach MaJe Technologies: New 150 Feet Ring Road, Mavdi, Rajkot, Gujarat 360004. Call or WhatsApp +91-9408272121 or email majetechnologies@gmail.com for instant consultations.',
      keywords: 'contact MaJe Technologies, phone +919408272121, WhatsApp MaJe Tech, Rajkot web developer contact, Mavdi tech agency, hire developers India USA UK Dubai',
      ogType: 'website',
      canonical: '/contact.html'
    },
    'blog': {
      title: 'Blog | Web Development Tips, AI Trends & Tech Insights | MaJe Technologies',
      description: 'Stay updated with MaJe Technologies blog — latest web development tips, AI trends, mobile app development guides, industry insights, and technology news.',
      keywords: 'tech blog, web development tips, AI trends, mobile development guide, technology insights, MaJe Technologies blog',
      ogType: 'blog',
      canonical: '/blog.html'
    },
    'careers': {
      title: 'Careers at MaJe Technologies | Join India\'s Growing Tech Company',
      description: 'Join MaJe Technologies and build the future of technology. Explore exciting career opportunities in web development, app development, AI, and digital marketing.',
      keywords: 'careers, jobs, tech jobs India, web developer jobs, app developer jobs, AI engineer jobs, MaJe Technologies careers',
      ogType: 'website',
      canonical: '/careers.html'
    },
    'documentation': {
      title: 'Developer Documentation | APIs & SDKs | MaJe Technologies',
      description: 'Comprehensive developer documentation for MaJe Technologies APIs, SDKs, and tools. Get started with detailed guides, code examples, and best practices.',
      keywords: 'API documentation, developer docs, SDK, integration guide, MaJe Technologies API',
      ogType: 'website',
      canonical: '/documentation.html'
    }
  };

  // Detect current page
  function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    return filename === '' ? 'index' : filename;
  }

  // Set or update a meta tag
  function setMeta(name, content, isProperty) {
    const attr = isProperty ? 'property' : 'name';
    let meta = document.querySelector(`meta[${attr}="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attr, name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  // Set canonical link
  function setCanonical(href) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', SITE_URL + href);
  }

  // Inject meta tags
  function injectMetaTags() {
    const page = getCurrentPage();
    const config = pageMetaConfig[page];

    if (!config) return;

    // Basic SEO Meta
    setMeta('description', config.description, false);
    setMeta('keywords', config.keywords, false);
    setMeta('author', SITE_NAME, false);
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1', false);

    // Open Graph
    setMeta('og:title', config.title, true);
    setMeta('og:description', config.description, true);
    setMeta('og:type', config.ogType, true);
    setMeta('og:url', SITE_URL + config.canonical, true);
    setMeta('og:image', DEFAULT_IMAGE, true);
    setMeta('og:image:width', '1200', true);
    setMeta('og:image:height', '630', true);
    setMeta('og:site_name', SITE_NAME, true);
    setMeta('og:locale', 'en_IN', true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image', false);
    setMeta('twitter:title', config.title, false);
    setMeta('twitter:description', config.description, false);
    setMeta('twitter:image', DEFAULT_IMAGE, false);
    setMeta('twitter:site', TWITTER_HANDLE, false);

    // Additional SEO
    setMeta('theme-color', '#1a1a1a', false);
    setMeta('apple-mobile-web-app-title', SITE_NAME, false);
    setMeta('application-name', SITE_NAME, false);
    setMeta('msapplication-TileColor', '#1a1a1a', false);

    // Geo Meta Tags (for location-based search & local near-me queries)
    setMeta('geo.region', 'IN-GJ', false);
    setMeta('geo.placename', 'Rajkot, Gujarat, India', false);
    setMeta('geo.position', '22.2612;70.7813', false);
    setMeta('ICBM', '22.2612, 70.7813', false);
    
    // Content Language
    setMeta('content-language', 'en', false);
    
    // Revisit
    setMeta('revisit-after', '7 days', false);

    // Canonical
    setCanonical(config.canonical);

    // Update title if needed
    if (document.title !== config.title) {
      document.title = config.title;
    }

    console.log('[MaJe SEO] Meta tags injected for page: ' + page + ' ✓');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectMetaTags);
  } else {
    injectMetaTags();
  }

})();
