import Link from 'next/link';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';
import {
  serviceLinks,
  industryLinks,
  companyLinks,
} from '@/lib/navigation';

export function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-navy-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-sky-400" />
              <span className="text-xl font-bold text-white font-display">
                Cesium<span className="text-sky-400">Cyber</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Protecting Maryland businesses with expert cybersecurity solutions.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {serviceLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-sky-400 text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="text-white font-semibold mb-4">Industries</h3>
            <ul className="space-y-2">
              {industryLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-sky-400 text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-sky-400 text-sm transition-colors"
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
                <Mail className="h-4 w-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:information@cesiumcyber.com"
                  className="text-gray-400 hover:text-sky-400 text-sm transition-colors"
                >
                  information@cesiumcyber.com
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+17175434981"
                  className="text-gray-400 hover:text-sky-400 text-sm transition-colors"
                >
                  +1 (717) 543-4981
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  3500 Cedar Ave<br />
                  Columbia, MD 21044
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust badges */}
        <div className="border-t border-navy-700 mt-8 pt-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <span className="font-medium text-sky-400">HIPAA</span>
            <span className="text-navy-700">|</span>
            <span className="font-medium text-sky-400">CMMC</span>
            <span className="text-navy-700">|</span>
            <span className="font-medium text-sky-400">PCI-DSS</span>
            <span className="text-navy-700">|</span>
            <span className="font-medium text-sky-400">SOC 2</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-navy-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} CesiumCyber. All rights reserved.
              </p>
              <span className="hidden sm:inline text-navy-700">|</span>
              <p className="text-gray-500 text-sm">
                Serving Maryland businesses from Columbia, MD
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
