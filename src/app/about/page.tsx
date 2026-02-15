import { Metadata } from 'next';
import { Shield, Target, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about CesiumCyber - our mission, values, and expert team protecting Maryland businesses with expert cybersecurity.',
};

const team = [
  {
    name: 'Julia Morrison',
    role: 'CEO & Co-Founder',
    image: '/julia-morrison.jpeg',
    bio: 'Expert in cybersecurity - vulnerability management, Operational Technology, Threat Intelligence. Her unique legal background (Law degree, BS in Law) combined with MS in Cyber Security provides deep understanding of compliance, risk frameworks, and regulatory requirements. Led security transformations with 15+ years of experience.',
    expertise: ['Threat Intelligence', 'Enterprise Security', 'Risk Management', 'AI'],
  },
  {
    name: 'Sung Lee',
    role: 'CTO & Co-Founder',
    image: '/sung-lee.png',
    bio: 'Expert in cybersecurity - incident response, cloud security, and AI-driven threat detection. Specialized in developing advanced security architectures for enterprise environments with 12+ years of experience.',
    expertise: ['Incident Response', 'Cloud Security', 'AI Security', 'Enterprise Architecture'],
  },
  {
    name: 'Siarhei Katliarou',
    role: 'Director of Business Development',
    image: '/siarhei-katliarou.png',
    bio: 'Brings 30 years of experience in business operations and strategic growth, supported by a strong military background that shaped his discipline, precision, and ability to move fast when it matters. Builds partnerships, opens new markets, and strengthens our position in the cyber domain.',
    expertise: ['Strategic Growth', 'Business Operations', 'Partnership Development', 'Market Expansion'],
  },
  {
    name: 'Mila Katliarova',
    role: 'Director of Business Operations',
    image: '/mila-katliarova.png',
    bio: 'Brings 30 years of hands-on experience building processes, managing teams, and keeping complex operations running without friction. Her leadership keeps our structure solid, our workflow sharp, and our execution reliable, anchoring daily operations in the fast-paced cybersecurity space.',
    expertise: ['Process Management', 'Team Leadership', 'Operations Excellence', 'Workflow Optimization'],
  },
];

const values = [
  {
    icon: Shield,
    title: 'Innovation',
    description: 'We continuously explore and implement the latest advancements in cybersecurity to stay ahead of emerging threats.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work closely with our clients to understand their unique needs and develop tailored security strategies.',
  },
  {
    icon: Target,
    title: 'Proactive Defense',
    description: 'We focus on preventing security breaches before they occur, minimizing potential damage and downtime.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We are committed to delivering the highest quality cybersecurity services and solutions.',
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section - Dark */}
      <section className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 font-display">
              About CesiumCyber
            </h1>
            <p className="text-xl text-gray-300">
              Protecting Maryland businesses with expert cybersecurity solutions and trusted guidance
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement - Light */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 font-display">Our Mission</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              To empower Maryland businesses with proactive cybersecurity solutions that anticipate and neutralize threats before they impact operations. Based in Columbia, MD, we understand the unique challenges local businesses face and deliver security that fits.
            </p>
          </div>
        </div>
      </section>

      {/* Values - Dark */}
      <section className="bg-navy-900 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12 font-display">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="rounded-lg border border-navy-700 bg-navy-800 p-6 text-center"
                >
                  <Icon className="h-12 w-12 text-sky-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-slate-300 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section - Light */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4 font-display">
            Leadership Team
          </h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Our team brings together decades of experience from top cybersecurity firms, government agencies, and research institutions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-lg border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 border-2 border-sky-200">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                    <p className="text-sky-600 font-medium text-sm">{member.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
                <div>
                  <h4 className="text-slate-900 font-semibold mb-2 text-sm">Expertise:</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-sky-50 text-sky-700 text-xs rounded-full border border-sky-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Dark */}
      <section className="bg-navy-950 py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { number: '500+', label: 'Clients Protected' },
              { number: '15+', label: 'Years Experience' },
              { number: '10k+', label: 'Threats Mitigated' },
              { number: '99.9%', label: 'Client Satisfaction' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center"
              >
                <div className="text-4xl font-bold text-sky-400 font-display">{stat.number}</div>
                <div className="text-gray-300 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Light */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 font-display">Ready to Work Together?</h2>
            <p className="text-slate-600">
              Let&apos;s discuss how we can help secure your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="accent" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
                asChild
              >
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
