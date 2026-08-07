import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, HelpCircle, PhoneCall, ChevronRight, Compass } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const cards = [
    {
      title: 'New Staff Tutorials',
      description: 'Step by step guide for Registration, Triage, Doctor, Pharmacy, and Admin roles.',
      link: '/help/tutorials',
      icon: Compass,
      badge: '5 Role Guides',
    },
    {
      title: 'Module Reference Docs',
      description: 'Detailed explanation of fields, rules, and stock warning thresholds for every station.',
      link: '/help/docs',
      icon: FileText,
      badge: 'Field Specs',
    },
    {
      title: 'Frequently Asked Questions',
      description: 'Answers about local network connection, triage levels, and system permissions.',
      link: '/help/faq',
      icon: HelpCircle,
      badge: 'Searchable FAQ',
    },
    {
      title: 'Who to Contact On-Site',
      description: 'Direct contact info for technical support, mission leads, and bug procedures.',
      link: '/help/contact',
      icon: PhoneCall,
      badge: 'Support Directory',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Scripture Banner */}
      <div className="bg-white rounded-2xl border border-[var(--line)] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 text-[var(--gold-700)] mb-2">
          <BookOpen className="w-5 h-5" />
          <span className="font-serif italic text-sm font-semibold">
            "Trust in the Lord with all thine heart, and lean not unto thine own understanding." Proverbs 3:5
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--emerald-900)] mt-2">
          Orientation and Training Center
        </h2>
        <p className="text-sm text-[var(--ink-soft)] mt-2 max-w-2xl leading-relaxed">
          Welcome to the Missions Clinic support center. Whether you are serving on your first shift or looking up a specific medication threshold rule, select a guide below to get started.
        </p>
      </div>

      {/* 4 Primary Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.link}
              to={card.link}
              className="bg-white rounded-2xl border border-[var(--line)] p-6 hover:border-[var(--emerald-700)] hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[var(--emerald-100)] text-[var(--emerald-700)] flex items-center justify-center group-hover:bg-[var(--emerald-700)] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--cream-deep)] text-[var(--ink-soft)] border border-[var(--line)]">
                    {card.badge}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-xl text-[var(--emerald-900)] group-hover:text-[var(--emerald-700)] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-[var(--emerald-700)] pt-2 border-t border-[var(--line)]">
                <span>Open Guide</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
