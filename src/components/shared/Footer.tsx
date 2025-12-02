import Link from 'next/link';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';

const navigation = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ],
  services: [
    { name: 'Penetration Testing', href: '/services#penetration-testing' },
    { name: 'Security Assessment', href: '/services#security-assessment' },
    { name: 'Incident Response', href: '/services#incident-response' },
    { name: 'Compliance', href: '/services#compliance' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-cyber-dark border-t border-cesium/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-cesium" />
              <span className="text-xl font-bold text-white font-[var(--font-orbitron)]">
                Cesium<span className="text-cesium">Cyber</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Protecting organizations worldwide with cutting-edge cybersecurity solutions.
            </p>
            <div className="flex space-x-4">
              {/* Social links can be added here */}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-cesium text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-cesium text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Mail className="h-4 w-4 text-cesium flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:information@cesiumcyber.com"
                  className="text-gray-400 hover:text-cesium text-sm transition-colors"
                >
                  information@cesiumcyber.com
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 text-cesium flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+17175434981"
                  className="text-gray-400 hover:text-cesium text-sm transition-colors"
                >
                  +1 (717) 543-4981
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-cesium flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  3500 Cedar Ave<br />
                  Columbia, MD 21044
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cesium/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} CesiumCyber. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-cesium text-sm transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
