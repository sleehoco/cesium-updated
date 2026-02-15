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

export const companyLinks: NavLink[] = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
];
