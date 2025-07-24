export const salesProcess = {
  discovery: {
    phase: "Discovery & Consultation",
    duration: "30-60 minutes",
    description: "We start with a comprehensive consultation to understand your business goals, target audience, current challenges, and growth objectives.",
    questions: [
      "What are your primary business goals for the next 6-12 months?",
      "Who is your target audience and ideal customer?",
      "What marketing channels are you currently using?",
      "What's your biggest challenge in attracting new customers?",
      "What's your current monthly marketing budget?",
      "What does success look like for your business?"
    ],
    deliverables: [
      "Business goals assessment",
      "Target audience analysis",
      "Current marketing audit",
      "Competitive landscape review"
    ]
  },
  
  strategy: {
    phase: "Strategy Development",
    duration: "3-5 business days",
    description: "Based on our discovery session, we develop a customized digital marketing strategy tailored to your specific needs and budget.",
    deliverables: [
      "Custom marketing strategy document",
      "Recommended service mix",
      "Timeline and milestones",
      "Budget allocation recommendations",
      "Expected ROI projections"
    ]
  },
  
  proposal: {
    phase: "Proposal & Agreement",
    duration: "1-2 business days",
    description: "We present a detailed proposal with transparent pricing, timelines, and expected outcomes.",
    includes: [
      "Detailed scope of work",
      "Transparent pricing breakdown",
      "Project timeline",
      "Success metrics and KPIs",
      "Contract terms and conditions"
    ]
  },
  
  onboarding: {
    phase: "Onboarding & Setup",
    duration: "1-2 weeks",
    description: "Once you're ready to move forward, we begin the onboarding process to set up all necessary tools and systems.",
    activities: [
      "Account setup and access provisioning",
      "Analytics and tracking implementation",
      "Brand asset collection and organization",
      "Initial campaign setup",
      "Team introductions and communication protocols"
    ]
  },
  
  execution: {
    phase: "Execution & Optimization",
    description: "We implement your marketing strategy with continuous monitoring and optimization for maximum results.",
    approach: [
      "Weekly performance reviews",
      "Monthly strategy adjustments",
      "Quarterly business reviews",
      "Continuous A/B testing",
      "Regular reporting and communication"
    ]
  }
};

export const pricingStructure = {
  webDesign: {
    basic: {
      name: "Business Website",
      priceRange: "$2,500 - $5,000",
      timeline: "2-4 weeks",
      includes: [
        "5-10 page custom design",
        "Mobile responsive",
        "Basic SEO setup",
        "Contact forms",
        "Google Analytics integration",
        "1 month of support"
      ],
      idealFor: "Small businesses, service providers, professionals"
    },
    
    advanced: {
      name: "Advanced Business Website",
      priceRange: "$5,000 - $10,000",
      timeline: "4-6 weeks",
      includes: [
        "10-20 page custom design",
        "Advanced functionality",
        "CMS integration",
        "Advanced SEO optimization",
        "Lead generation tools",
        "3 months of support"
      ],
      idealFor: "Growing businesses, multiple locations, complex needs"
    },
    
    ecommerce: {
      name: "E-commerce Website",
      priceRange: "$7,500 - $15,000",
      timeline: "6-8 weeks",
      includes: [
        "Custom e-commerce design",
        "Product catalog setup",
        "Payment gateway integration",
        "Inventory management",
        "Order management system",
        "6 months of support"
      ],
      idealFor: "Online retailers, product-based businesses"
    }
  },
  
  digitalMarketing: {
    ppc: {
      name: "Pay-Per-Click Advertising",
      managementFee: "$1,500 - $3,000/month",
      adSpend: "Separate (recommended $3,000+ monthly)",
      includes: [
        "Google Ads management",
        "Facebook/Instagram ads",
        "Keyword research and optimization",
        "Ad copy creation and testing",
        "Landing page optimization",
        "Monthly performance reports"
      ]
    },
    
    seo: {
      name: "Search Engine Optimization",
      priceRange: "$1,200 - $2,500/month",
      timeline: "3-6 months to see results",
      includes: [
        "Technical SEO audit and fixes",
        "Keyword research and strategy",
        "Content optimization",
        "Link building campaigns",
        "Local SEO (if applicable)",
        "Monthly ranking reports"
      ]
    },
    
    socialMedia: {
      name: "Social Media Management",
      priceRange: "$800 - $2,000/month",
      includes: [
        "Content creation and posting",
        "Community management",
        "Social media advertising",
        "Brand monitoring",
        "Monthly analytics reports",
        "Strategy development"
      ]
    }
  },
  
  packages: {
    starter: {
      name: "Digital Starter Package",
      price: "$2,500/month",
      commitment: "6 months minimum",
      includes: [
        "Basic website maintenance",
        "Google Ads management",
        "Basic SEO",
        "Monthly reporting"
      ],
      idealFor: "Small businesses just starting with digital marketing"
    },
    
    growth: {
      name: "Business Growth Package",
      price: "$4,500/month",
      commitment: "6 months minimum",
      includes: [
        "Comprehensive SEO",
        "PPC advertising management",
        "Social media management",
        "Content marketing",
        "Monthly strategy calls"
      ],
      idealFor: "Established businesses ready to scale"
    },
    
    enterprise: {
      name: "Enterprise Solution",
      price: "Custom pricing",
      includes: [
        "Full-service digital marketing",
        "Dedicated account manager",
        "Custom reporting dashboard",
        "Weekly strategy calls",
        "Priority support"
      ],
      idealFor: "Large businesses with complex needs"
    }
  }
};