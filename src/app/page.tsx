import { HeroSection } from '@/components/home/HeroSection';
import { ComingSoonSection } from '@/components/home/ComingSoonSection';
import { ToolsPreviewSection } from '@/components/home/ToolsPreviewSection';
import { AccessCodeForm } from '@/components/home/AccessCodeForm';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ComingSoonSection />
      <ToolsPreviewSection />

      {/* Bottom CTA */}
      <section className="bg-[#050505] py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-white font-display">
              Have an Access Code?
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Unlock the full Cesium platform with your access code.
            </p>
            <div className="flex justify-center pt-2">
              <AccessCodeForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
