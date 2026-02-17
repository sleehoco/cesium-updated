export interface NavLink {
  name: string;
  href: string;
}

export const serviceLinks: NavLink[] = [
  { name: 'Security Assessment', href: '/services#security-assessment' },
  { name: 'Compliance & Risk Management', href: '/services#compliance-risk' },
  { name: 'Penetration Testing', href: '/services#penetration-testing' },
  { name: 'Cloud Security (M365)', href: '/services#cloud-security-m365' },
  { name: 'AI Integration', href: '/services#ai-business-integration' },
  { name: 'Managed Security', href: '/services#managed-security' },
];

export const industryLinks: NavLink[] = [
  { name: 'Healthcare', href: '/industries/healthcare' },
  { name: 'Manufacturing', href: '/industries/manufacturing' },
  { name: 'Legal', href: '/industries/legal' },
  { name: 'Financial Services', href: '/industries/financial' },
  { name: 'Retail & Consumer Business', href: '/industries/retail' },
];

export const resourceLinks: NavLink[] = [
  { name: 'Blog / Insights', href: '/blog' },
  { name: 'Compliance Guides', href: '/resources/guides' },
  { name: 'Case Studies', href: '/resources/case-studies' },
];

export const toolLinks: NavLink[] = [
  { name: 'Threat Intelligence', href: '/tools/threat-intel' },
  { name: 'Password Tester', href: '/tools/password-tester' },
  { name: 'Email Security', href: '/tools/email-security' },
  { name: 'Headers Scanner', href: '/tools/headers-scanner' },
  { name: 'Compliance Quiz', href: '/tools/compliance-quiz' },
  { name: 'Email Header Analyzer', href: '/tools/email-header-analyzer' },
];

export const companyLinks: NavLink[] = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export const legalLinks: NavLink[] = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
];

// Combined "For Business" links for nav dropdown
export const businessLinks: NavLink[] = [
  ...serviceLinks.slice(0, 3),
  ...industryLinks.slice(0, 3),
];
