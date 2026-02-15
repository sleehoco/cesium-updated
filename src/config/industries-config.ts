export interface IndustryConfig {
  slug: string;
  name: string;
  headline: string;
  heroStat: string;
  complianceBadges: string[];
  threats: Array<{
    title: string;
    description: string;
  }>;
  servicesMapping: Array<{
    requirement: string;
    delivery: string;
  }>;
  ctaHeadline: string;
  ctaButtonText: string;
  ctaHref: string;
}

const healthcare: IndustryConfig = {
  slug: 'healthcare',
  name: 'Healthcare',
  headline: 'Protecting Patient Data & Meeting HIPAA Requirements',
  heroStat:
    '72% of healthcare organizations experienced a cyber incident affecting patient care in the past year',
  complianceBadges: ['HIPAA', 'HITECH'],
  threats: [
    {
      title: 'Ransomware Targeting Healthcare',
      description:
        'Healthcare is the #1 targeted industry for ransomware. Attacks can shut down EHR systems, delay patient care, and cost millions in recovery.',
    },
    {
      title: 'EHR & Medical Device Vulnerabilities',
      description:
        'Electronic health records and connected medical devices create an expanding attack surface that requires specialized security approaches.',
    },
    {
      title: 'Phishing Targeting Billing Staff',
      description:
        'Billing and administrative staff are prime targets for phishing attacks that can expose patient data and enable insurance fraud.',
    },
    {
      title: 'Insider Threats & Access Control',
      description:
        'Healthcare employees need access to sensitive data to do their jobs, making proper access controls and monitoring critical.',
    },
  ],
  servicesMapping: [
    {
      requirement: 'Risk Analysis (§164.308(a)(1))',
      delivery:
        'Comprehensive security risk assessments identifying vulnerabilities in your systems, processes, and physical safeguards',
    },
    {
      requirement: 'Access Controls (§164.312(a)(1))',
      delivery:
        'Role-based access control implementation ensuring only authorized personnel access patient data',
    },
    {
      requirement: 'Audit Controls (§164.312(b))',
      delivery:
        'Continuous monitoring and logging of all access to electronic protected health information (ePHI)',
    },
    {
      requirement: 'Transmission Security (§164.312(e)(1))',
      delivery:
        'End-to-end encryption for all ePHI in transit, including email, file transfers, and telehealth systems',
    },
  ],
  ctaHeadline: 'Get Your Free HIPAA Risk Assessment',
  ctaButtonText: 'Schedule Assessment',
  ctaHref: '/contact',
};

const manufacturing: IndustryConfig = {
  slug: 'manufacturing',
  name: 'Manufacturing',
  headline: 'CMMC Readiness & OT/IT Security for Manufacturers',
  heroStat:
    'DoD contractors must achieve CMMC Level 2 certification by 2025 — non-compliance means losing contracts',
  complianceBadges: ['CMMC 2.0', 'NIST 800-171'],
  threats: [
    {
      title: 'CMMC Compliance Deadline Pressure',
      description:
        'The CMMC 2.0 framework requires DoD contractors to demonstrate cybersecurity maturity. Missing the deadline means losing government contracts worth millions.',
    },
    {
      title: 'OT/IT Convergence Risks',
      description:
        'As manufacturing systems connect to IT networks, operational technology becomes vulnerable to cyber attacks that can halt production lines.',
    },
    {
      title: 'Supply Chain Attacks',
      description:
        'Attackers increasingly target smaller manufacturers as entry points into larger defense supply chains.',
    },
    {
      title: 'Intellectual Property Theft',
      description:
        'Manufacturing designs, processes, and trade secrets are prime targets for nation-state actors and competitors.',
    },
  ],
  servicesMapping: [
    {
      requirement: 'Access Control (AC)',
      delivery:
        'Implementing least-privilege access controls across IT and OT systems to protect CUI',
    },
    {
      requirement: 'Incident Response (IR)',
      delivery:
        'Developing and testing incident response plans specific to manufacturing environments',
    },
    {
      requirement: 'Risk Assessment (RA)',
      delivery:
        'Comprehensive risk assessments covering both IT infrastructure and operational technology',
    },
    {
      requirement: 'System & Communications Protection (SC)',
      delivery:
        'Network segmentation between IT and OT, encrypted communications, and boundary protection',
    },
  ],
  ctaHeadline: 'Check Your CMMC Readiness',
  ctaButtonText: 'Start CMMC Assessment',
  ctaHref: '/contact',
};

const legal: IndustryConfig = {
  slug: 'legal',
  name: 'Legal',
  headline:
    'Protecting Client Confidentiality & Meeting Cyber Insurance Requirements',
  heroStat:
    'Law firms are 3x more likely to be targeted by cyber attacks due to the sensitive nature of client data',
  complianceBadges: ['ABA Ethics Rules', 'State Bar Requirements'],
  threats: [
    {
      title: 'Business Email Compromise (BEC)',
      description:
        'Wire fraud through compromised email accounts costs law firms millions annually. Attackers intercept closing instructions and redirect funds.',
    },
    {
      title: 'Client Data Breaches',
      description:
        'Law firms hold privileged attorney-client communications, case strategies, and sensitive personal data that are high-value targets.',
    },
    {
      title: 'Ransomware & Case File Encryption',
      description:
        'Ransomware can lock firms out of critical case files, court deadlines, and client communications.',
    },
    {
      title: 'Cyber Insurance Compliance',
      description:
        'Insurers increasingly require specific security controls before issuing or renewing cyber liability policies.',
    },
  ],
  servicesMapping: [
    {
      requirement: 'ABA Rule 1.6 (Confidentiality)',
      delivery:
        'Implementing encryption, access controls, and monitoring to protect client communications and case files',
    },
    {
      requirement: 'ABA Rule 1.1 (Competence)',
      delivery:
        'Security awareness training ensuring attorneys understand cyber risks and their ethical obligations',
    },
    {
      requirement: 'Cyber Insurance Requirements',
      delivery:
        'Implementing MFA, endpoint protection, and backup systems required by cyber insurance carriers',
    },
    {
      requirement: "State Bar Data Protection Rules",
      delivery:
        "Compliance assessments tailored to your state bar's specific cybersecurity requirements",
    },
  ],
  ctaHeadline: 'Get Cyber Insurance Ready',
  ctaButtonText: 'Schedule Review',
  ctaHref: '/contact',
};

const financial: IndustryConfig = {
  slug: 'financial',
  name: 'Financial Services',
  headline: 'PCI-DSS Compliance & Financial Data Protection',
  heroStat:
    'Financial services firms face 300x more cyber attacks than other industries',
  complianceBadges: ['PCI-DSS 4.0', 'GLBA', 'IRS WISP'],
  threats: [
    {
      title: 'PCI-DSS 4.0 Compliance Changes',
      description:
        'PCI-DSS 4.0 introduces significant new requirements for payment card data protection. Non-compliance means fines and loss of processing ability.',
    },
    {
      title: 'Account Takeover & Fraud',
      description:
        'Sophisticated attacks targeting client accounts through credential stuffing, phishing, and social engineering.',
    },
    {
      title: 'Third-Party Vendor Risks',
      description:
        'Financial firms rely on numerous third-party vendors who may introduce security vulnerabilities into your environment.',
    },
    {
      title: 'IRS WISP Requirements (CPA Firms)',
      description:
        'The IRS requires all tax preparers to have a Written Information Security Plan. Non-compliance can result in penalties and loss of PTIN.',
    },
  ],
  servicesMapping: [
    {
      requirement: 'PCI-DSS Requirement 3 (Protect Stored Data)',
      delivery:
        'Implementing encryption, tokenization, and access controls for cardholder data environments',
    },
    {
      requirement: 'GLBA Safeguards Rule',
      delivery:
        'Comprehensive security program meeting the updated FTC Safeguards Rule requirements',
    },
    {
      requirement: 'IRS WISP Development',
      delivery:
        'Creating and maintaining Written Information Security Plans for CPA firms and tax preparers',
    },
    {
      requirement: 'SOX IT Controls',
      delivery:
        'IT general controls testing and remediation for Sarbanes-Oxley compliance',
    },
  ],
  ctaHeadline: 'Schedule a Compliance Review',
  ctaButtonText: 'Book Consultation',
  ctaHref: '/contact',
};

const retail: IndustryConfig = {
  slug: 'retail',
  name: 'Retail & Consumer Business',
  headline: 'POS Security & Customer Data Protection for Retailers',
  heroStat:
    '62% of retail cyber attacks target point-of-sale systems and customer payment data',
  complianceBadges: ['PCI-DSS', 'State Privacy Laws'],
  threats: [
    {
      title: 'POS System Attacks',
      description:
        'Point-of-sale malware can silently capture payment card data from every transaction, leading to massive data breaches.',
    },
    {
      title: 'E-commerce & Online Payment Fraud',
      description:
        'Online retailers face card-not-present fraud, account takeover, and payment page skimming attacks.',
    },
    {
      title: 'Customer Data Protection',
      description:
        'Retailers collect personal information, purchase history, and payment data that must be protected under state privacy laws.',
    },
    {
      title: 'Phishing & Social Engineering',
      description:
        'Retail employees handling transactions and customer data are common targets for phishing and social engineering attacks.',
    },
  ],
  servicesMapping: [
    {
      requirement: 'PCI-DSS SAQ Assessment',
      delivery:
        'Determining your correct SAQ type and guiding you through the self-assessment questionnaire process',
    },
    {
      requirement: 'Network Segmentation',
      delivery:
        'Isolating cardholder data environments from general business networks to reduce PCI scope',
    },
    {
      requirement: 'Employee Security Training',
      delivery:
        'Training retail staff to recognize phishing, social engineering, and suspicious POS activity',
    },
    {
      requirement: 'Vulnerability Scanning',
      delivery:
        'Regular ASV scans and internal vulnerability assessments as required by PCI-DSS',
    },
  ],
  ctaHeadline: 'Protect Your Customer Data',
  ctaButtonText: 'Get Started',
  ctaHref: '/contact',
};

export const industries = {
  healthcare,
  manufacturing,
  legal,
  financial,
  retail,
} as const;
