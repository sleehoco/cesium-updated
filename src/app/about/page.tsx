import { Metadata } from 'next';
import { Shield, Target, Award, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about CesiumCyber - our mission, values, and expert team protecting organizations worldwide.',
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
    <main className="min-h-screen bg-gradient-to-b from-cyber-dark via-cyber to-cyber-light">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 font-[var(--font-orbitron)]">
            About CesiumCyber
          </h1>
          <p className="text-xl text-gray-300">
            Protecting organizations worldwide with cutting-edge cybersecurity solutions and expert guidance
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="bg-cesium/10 border-cesium/30 backdrop-blur max-w-4xl mx-auto mb-20">
          <CardHeader>
            <CardTitle className="text-white text-3xl text-center">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-lg text-center leading-relaxed">
              To empower organizations with proactive cybersecurity solutions that anticipate and neutralize threats before they impact business operations.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12 font-[var(--font-orbitron)]">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={value.title}
                  className="bg-cyber-light/50 border-cesium/20 backdrop-blur hover:border-cesium/40 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center">
                    <Icon className="h-12 w-12 text-cesium mx-auto mb-4" />
                    <CardTitle className="text-white">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-center text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-4 font-[var(--font-orbitron)]">
            Leadership Team
          </h2>
          <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Our team brings together decades of experience from top cybersecurity firms, government agencies, and research institutions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card
                key={member.name}
                className="bg-cyber-light/50 border-cesium/20 backdrop-blur hover:border-cesium/40 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 bg-muted border-2 border-cesium/30">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-white">{member.name}</CardTitle>
                      <CardDescription className="text-cesium">{member.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm">{member.bio}</p>
                  <div>
                    <h4 className="text-white font-semibold mb-2 text-sm">Expertise:</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-cesium/20 text-cesium text-xs rounded-full border border-cesium/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { number: '500+', label: 'Clients Protected' },
              { number: '15+', label: 'Years Experience' },
              { number: '10k+', label: 'Threats Mitigated' },
              { number: '99.9%', label: 'Client Satisfaction' },
            ].map((stat, index) => (
              <Card
                key={stat.label}
                className="bg-cesium/10 border-cesium/30 backdrop-blur text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="text-cesium text-4xl font-bold">{stat.number}</CardTitle>
                  <CardDescription className="text-gray-300">{stat.label}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-cesium/10 border-cesium/30 backdrop-blur max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">Ready to Work Together?</CardTitle>
            <CardDescription className="text-gray-300 text-center">
              Let&apos;s discuss how we can help secure your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="gold" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-cesium text-cesium hover:bg-cesium hover:text-cyber-dark">
              <Link href="/services">View Services</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

    </main>
  );
}
