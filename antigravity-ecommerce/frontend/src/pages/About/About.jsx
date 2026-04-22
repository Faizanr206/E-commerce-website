import React from 'react';
import { Shield, Sparkles, Smile, Star } from 'lucide-react';

const About = () => {
  const features = [
    { icon: <Smile size={24} />, title: 'Curated Joy', text: 'We hand-pick toys that inspire wonder and are built to last.' },
    { icon: <Shield size={24} />, title: 'Built Safely', text: 'Nothing is more important than safety. Every item passes strict standards.' },
    { icon: <Sparkles size={24} />, title: 'Imaginative', text: 'Products designed to unlock creativity rather than strictly guide it.' },
    { icon: <Star size={24} />, title: 'Premium Quality', text: 'Materials that feel right, offering satisfying tactical responses.' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 md:px-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-[var(--text)] mb-4">
          About LittleLegends
        </h1>
        <p className="text-xl text-[var(--muted)] font-semibold max-w-2xl mx-auto leading-relaxed">
          Crafting minimalist experiences and curating premium toys for a legendary generation. We believe play is serious development.
        </p>
      </div>

      <div className="soft-card p-10 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--text)] opacity-[0.03] rounded-bl-full pointer-events-none" />
        <h2 className="text-2xl font-bold mb-4">Our Philosophy</h2>
        <p className="text-[var(--text)] mt-4 leading-relaxed font-medium">
          LittleLegends was born out of a desire to step away from excessive, disposable plastic toys and instead focus on meaningful, exceptionally crafted artifacts that children genuinely connect with.
        </p>
        <p className="text-[var(--text)] mt-4 leading-relaxed font-medium">
          We strip back the noise — loud colors, aggressive marketing, and chaotic shapes — to offer a calm, focused environment where creativity shapes the playtime, not the other way around. Welcome to a curated toy box.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, i) => (
          <div key={i} className="flex gap-6 items-start soft-card p-6">
            <div className="w-12 h-12 shrink-0 bg-[var(--text)] text-[var(--bg)] rounded-xl flex items-center justify-center shadow-md">
              {feature.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-[var(--text)]">{feature.title}</h3>
              <p className="text-[var(--muted)] text-sm">{feature.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <p className="text-[var(--muted)] font-semibold text-sm uppercase tracking-wider">
          ESTABLISHED 2026 • READY FOR ADVENTURE
        </p>
      </div>
    </div>
  );
};

export default About;
