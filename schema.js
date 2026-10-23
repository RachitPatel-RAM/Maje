/**
 * MaJe Technologies — Centralized Schema.org Structured Data
 * This file injects JSON-LD schema markup into every page for SEO/AEO/GEO optimization
 * Include this script on every page: <script src="schema.js"></script>
 * 
 * Schema types included:
 * - Organization (global)
 * - LocalBusiness (for "near me" ranking)
 * - WebSite (with SearchAction for sitelinks search box)
 * - BreadcrumbList (auto-generated based on current page)
 * - Service schemas (on services page)
 * - FAQPage schemas (where FAQ sections exist)
 */

(function() {
  'use strict';

  const SITE_URL = 'https://majetech.in';
  const SITE_NAME = 'MaJe Technologies';
  const LOGO_URL = SITE_URL + '/logo.png';
  const OG_IMAGE_URL = SITE_URL + '/og-image.png';

  // ============================================
  // 1. ORGANIZATION SCHEMA (every page)
  // ============================================
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": SITE_URL + "/#organization",
    "name": SITE_NAME,
    "alternateName": ["MaJe Tech", "MAJE Technologies", "MaJe"],
    "url": SITE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": LOGO_URL,
      "width": 512,
      "height": 512
    },
    "image": OG_IMAGE_URL,
    "description": "MaJe Technologies is a premium software development company specializing in custom web development, mobile app development, AI & machine learning solutions, business automation, social media management, and graphic design. Serving clients worldwide from India.",
    "foundingDate": "2024",
    "founder": {
      "@type": "Person",
      "name": "MaJe Technologies Team"
    },
    "sameAs": [
      "https://www.linkedin.com/company/maje-technologies/",
      "https://www.instagram.com/majetechnologies/",
      "https://github.com/RachitPatel-RAM"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91-9408272121",
        "contactType": "sales",
        "availableLanguage": ["English", "Hindi", "Gujarati"],
        "url": "https://wa.me/919408272121"
      },
      {
        "@type": "ContactPoint",
        "telephone": "+91-9408272121",
        "contactType": "customer support",
        "availableLanguage": ["English", "Hindi", "Gujarati"],
        "url": SITE_URL + "/contact.html"
      }
    ],
    "knowsAbout": [
      "Web Development",
      "Mobile App Development",
      "Artificial Intelligence",
      "Machine Learning",
      "Business Automation",
      "Social Media Management",
      "Graphic Design",
      "E-commerce Development",
      "React",
      "Node.js",
      "Flutter",
      "React Native",
      "Python",
      "Firebase",
      "UI/UX Design"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "New 150 Feet Ring Road, Mavdi",
      "addressLocality": "Rajkot",
      "addressRegion": "Gujarat",
      "postalCode": "360004",
      "addressCountry": "IN"
    },
    "telephone": "+91-9408272121",
    "areaServed": [
      { "@type": "Country", "name": "India" },
      { "@type": "Country", "name": "United States" },
      { "@type": "Country", "name": "Australia" },
      { "@type": "Country", "name": "United Kingdom" },
      { "@type": "Country", "name": "Germany" },
      { "@type": "Country", "name": "Italy" },
      { "@type": "Country", "name": "Monaco" },
      { "@type": "Country", "name": "United Arab Emirates" },
      { "@type": "City", "name": "Dubai" },
      { "@type": "City", "name": "Rajkot" },
      { "@type": "City", "name": "Ahmedabad" },
      { "@type": "City", "name": "Mumbai" },
      { "@type": "City", "name": "Delhi" },
      { "@type": "City", "name": "Bengaluru" }
    ],
    "slogan": "Transforming Visions into High-Impact Digital Realities",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "minValue": 5,
      "maxValue": 20
    }
  };

  // ============================================
  // 2. LOCAL BUSINESS SCHEMA (for "near me" ranking)
  // ============================================
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": SITE_URL + "/#localbusiness",
    "name": SITE_NAME,
    "image": LOGO_URL,
    "url": SITE_URL,
    "telephone": "+91-9408272121",
    "email": "majetechnologies@gmail.com",
    "priceRange": "$$",
    "openingHours": "Mo-Su 09:30-21:30",
    "paymentAccepted": ["Wire Transfer", "Wise", "Stripe", "PayPal", "Credit Card", "Debit Card", "Bank Transfer", "UPI"],
    "currenciesAccepted": "USD, EUR, GBP, AUD, AED, INR",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "24",
      "bestRating": "5",
      "worstRating": "1"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "New 150 Feet Ring Road, Mavdi",
      "addressLocality": "Rajkot",
      "addressRegion": "Gujarat",
      "postalCode": "360004",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.2612,
      "longitude": 70.7813
    },
    "areaServed": [
      { "@type": "Country", "name": "India" },
      { "@type": "Country", "name": "United States" },
      { "@type": "Country", "name": "Australia" },
      { "@type": "Country", "name": "United Kingdom" },
      { "@type": "Country", "name": "Germany" },
      { "@type": "Country", "name": "Italy" },
      { "@type": "Country", "name": "Monaco" },
      { "@type": "Country", "name": "United Arab Emirates" },
      { "@type": "City", "name": "Dubai" },
      { "@type": "City", "name": "Rajkot" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Digital & Production Services",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Web & Software Development",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Website Development" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "E-commerce Website Development" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web Application Development" } }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Mobile App Development",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "iOS App Development" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Android App Development" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Cross-Platform App Development" } }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Performance Marketing & Ads",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Meta Ads Management (Facebook & Instagram)" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Google Ads & PPC Campaigns" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Telegram Sponsored & Channel Advertising" } }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Commercial Video Production & Content",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Advertisement Video Shoots" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Professional Anchoring & Reels Creation" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "High-Impact Video Editing & Color Grading" } }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "AI & Automation",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AI Chatbot Development" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom AI & Workflow Automation Solutions" } }
          ]
        }
      ]
    }
  };

  // ============================================
  // 3. WEBSITE SCHEMA (with SearchAction for sitelinks)
  // ============================================
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_URL + "/#website",
    "name": SITE_NAME,
    "url": SITE_URL,
    "description": "Premium web development, mobile app development, AI solutions, and digital services company.",
    "publisher": { "@id": SITE_URL + "/#organization" },
    "inLanguage": "en-IN"
  };

  // ============================================
  // 4. SERVICE SCHEMAS
  // ============================================
  const services = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Web Development",
      "name": "Custom Web Development Services",
      "description": "Professional custom website and web application development using modern technologies like React, Next.js, Node.js, and more. We build responsive, fast, and SEO-optimized websites that drive results.",
      "provider": { "@id": SITE_URL + "/#organization" },
      "areaServed": [
        { "@type": "Country", "name": "India" },
        { "@type": "Country", "name": "United States" },
        { "@type": "Country", "name": "United Kingdom" }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Web Development Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Responsive Website Design" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "E-commerce Development" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "CMS Development" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "API Integration" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Performance Optimization" } }
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Mobile App Development",
      "name": "Mobile App Development Services",
      "description": "Native and cross-platform mobile application development for iOS and Android using React Native, Flutter, and Swift. We build high-performance apps that users love.",
      "provider": { "@id": SITE_URL + "/#organization" },
      "areaServed": [
        { "@type": "Country", "name": "India" },
        { "@type": "Country", "name": "United States" },
        { "@type": "Country", "name": "United Kingdom" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Artificial Intelligence",
      "name": "AI & Machine Learning Solutions",
      "description": "Intelligent solutions powered by artificial intelligence and machine learning. Chatbot development, predictive analytics, computer vision, NLP, and custom AI solutions for businesses.",
      "provider": { "@id": SITE_URL + "/#organization" }
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Business Automation",
      "name": "Business Automation Services",
      "description": "Streamline your business processes with intelligent automation solutions. Workflow automation, data processing, integration solutions, and custom automation tools.",
      "provider": { "@id": SITE_URL + "/#organization" }
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Social Media Management",
      "name": "Social Media Management Services",
      "description": "Comprehensive social media strategies to boost your online presence and engagement. Content creation, community management, paid advertising, and analytics.",
      "provider": { "@id": SITE_URL + "/#organization" }
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Graphic Design",
      "name": "Graphic Design Services",
      "description": "Creative visual solutions including poster design, festival packages, daily design services, brand identity, and marketing materials.",
      "provider": { "@id": SITE_URL + "/#organization" }
    }
  ];

  // ============================================
  // 5. FAQ SCHEMA (for AEO — Answer Engine Optimization)
  // ============================================
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much does website development cost in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "At MaJe Technologies, custom website development starts from ₹15,000 for basic websites and can go up to ₹5,00,000+ for complex web applications. The cost depends on features, design complexity, number of pages, and integrations required. We offer transparent pricing with no hidden fees. Contact us for a free detailed quote."
        }
      },
      {
        "@type": "Question",
        "name": "Which is the best web development company in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MaJe Technologies is one of the top-rated web development companies in India, specializing in custom web development, mobile apps, and AI solutions. With 50+ successful projects delivered worldwide, a 99% client satisfaction rate, and expertise in modern technologies like React, Node.js, Flutter, and AI/ML, we deliver premium digital solutions that drive real business results."
        }
      },
      {
        "@type": "Question",
        "name": "How long does it take to build a custom website?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A typical custom website takes 2-6 weeks to develop at MaJe Technologies, depending on complexity. A simple business website takes 2-3 weeks, an e-commerce website takes 4-6 weeks, and a complex web application can take 8-12 weeks. We follow an agile development process with regular milestones and client check-ins."
        }
      },
      {
        "@type": "Question",
        "name": "Do you develop mobile apps for both iOS and Android?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! MaJe Technologies develops mobile applications for both iOS and Android platforms. We use cross-platform frameworks like React Native and Flutter to build apps that work seamlessly on both platforms, saving you time and cost. We also offer native development for projects that require platform-specific optimization."
        }
      },
      {
        "@type": "Question",
        "name": "Can you help with AI and machine learning for my business?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! MaJe Technologies offers comprehensive AI & ML solutions including chatbot development, predictive analytics, computer vision, natural language processing (NLP), and custom AI solutions. We help businesses automate processes, gain insights from data, and create intelligent customer experiences. Our AI solutions are tailored to your specific business needs and budget."
        }
      },
      {
        "@type": "Question",
        "name": "Do you work with international clients?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, MaJe Technologies serves clients worldwide including India, USA, UK, Canada, Australia, UAE, Germany, and Singapore. We offer flexible communication across time zones, accept payments in multiple currencies (INR, USD, GBP, EUR, AED), and have delivered 50+ projects for clients across 10+ countries. Our remote collaboration process ensures seamless project delivery regardless of location."
        }
      },
      {
        "@type": "Question",
        "name": "What technologies does MaJe Technologies use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MaJe Technologies uses cutting-edge technologies including React, Next.js, Node.js, Python, Flutter, React Native, Firebase, MongoDB, PostgreSQL, TensorFlow, OpenAI APIs, AWS, Google Cloud, and more. We choose the best technology stack based on your project requirements, scalability needs, and budget to deliver optimal results."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide ongoing support and maintenance?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! MaJe Technologies provides comprehensive post-launch support and maintenance for all projects. This includes bug fixes, security updates, performance monitoring, feature additions, and technical support. We offer flexible maintenance plans to keep your website or application running smoothly and securely."
        }
      }
    ]
  };

  // ============================================
  // 6. BREADCRUMB SCHEMA (auto-generated)
  // ============================================
  function generateBreadcrumbSchema() {
    const path = window.location.pathname;
    const pageName = path.split('/').pop().replace('.html', '').replace(/-/g, ' ');
    
    const breadcrumbItems = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": SITE_URL
      }
    ];

    if (pageName && pageName !== '' && pageName !== 'index') {
      const formattedName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
      const pageNameMap = {
        'services': 'Services',
        'about': 'About Us',
        'cases': 'Portfolio & Case Studies',
        'contact': 'Contact Us',
        'blog': 'Blog',
        'careers': 'Careers',
        'documentation': 'Documentation',
        'privacy policy': 'Privacy Policy',
        'terms of service': 'Terms of Service',
        'cookie policy': 'Cookie Policy'
      };

      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 2,
        "name": pageNameMap[pageName] || formattedName,
        "item": SITE_URL + path
      });
    }

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems
    };
  }

  // ============================================
  // 7. SPEAKABLE SCHEMA (for voice search / GEO)
  // ============================================
  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": document.title,
    "url": window.location.href,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".hero-description", ".about-summary", ".service-card h3"]
    }
  };

  // ============================================
  // INJECT ALL SCHEMAS
  // ============================================
  function injectSchema(schemaData) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
  }

  // Always inject these on every page
  injectSchema(organizationSchema);
  injectSchema(localBusinessSchema);
  injectSchema(websiteSchema);
  injectSchema(generateBreadcrumbSchema());
  injectSchema(speakableSchema);

  // Inject service schemas on services page and homepage
  const currentPath = window.location.pathname;
  if (currentPath.includes('services') || currentPath === '/' || currentPath.includes('index')) {
    services.forEach(service => injectSchema(service));
  }

  // Inject FAQ schema on homepage, services page, and any page with FAQ section
  if (currentPath === '/' || currentPath.includes('index') || currentPath.includes('services') || currentPath.includes('contact') || currentPath.includes('faq')) {
    injectSchema(faqSchema);
  }

  console.log('[MaJe SEO] Schema.org structured data injected successfully ✓');

})();
