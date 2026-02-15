import { Metadata } from 'next';
import { IndustryPage } from '@/components/shared/IndustryPage';
import { industries } from '@/config/industries-config';

const industry = industries.retail;

export const metadata: Metadata = {
  title: industry.name,
  description: industry.headline,
};

export default function RetailPage() {
  return <IndustryPage config={industry} />;
}
