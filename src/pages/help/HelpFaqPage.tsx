import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, ChevronDown, ChevronUp, HelpCircle, BookOpen } from 'lucide-react';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: 'connection' | 'triage' | 'roles' | 'pharmacy' | 'data';
}

export const HelpFaqPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIds, setOpenIds] = useState<number[]>([1, 2, 4, 5]);

  const faqs: FaqItem[] = [
    {
      id: 1,
      category: 'connection',
      question: 'Is an active internet connection required to use Missions Clinic?',
      answer: 'No. Missions Clinic is designed specifically for local area network (LAN) deployment. The system runs entirely on a local router connected to the host laptop on site. No internet access is needed.',
    },
    {
      id: 2,
      category: 'triage',
      question: 'How do patient triage flags work during station queueing?',
      answer: 'Triage flags categorize patient severity. Red indicates emergency care needed immediately. Yellow indicates urgent care. Green is routine care. Unflagged is standard. Triage badges are displayed prominently across all station queues.',
    },
    {
      id: 3,
      category: 'connection',
      question: 'What happens if the WiFi momentarily drops out during a shift?',
      answer: 'The system displays a yellow non-blocking banner at the top informing you that connection is being restored. Your inputs remain intact in form drafts, and requests retry automatically when signal returns.',
    },
    {
      id: 4,
      category: 'roles',
      question: 'Why can I not see the Staff Management page in my sidebar?',
      answer: 'Only staff accounts with the Clinic Admin role can access Staff Management. If you need account changes, contact your on-site Clinic Admin.',
    },
    {
      id: 5,
      category: 'pharmacy',
      question: 'Why is a medication showing a warning color in the inventory list?',
      answer: 'A medication displays a yellow warning badge when its available stock quantity falls to or below its reorder threshold (default is 10). This alerts pharmacy staff to replenish stock.',
    },
    {
      id: 6,
      category: 'data',
      question: 'Can a patient record be edited after creation?',
      answer: 'Yes. Open Patient Records, select the patient profile, and click Edit Details to update demographic information such as village or phone number.',
    },
    {
      id: 7,
      category: 'pharmacy',
      question: 'How are prescription quantities tracked during dispensing?',
      answer: 'When a pharmacy tech dispenses a prescription, the quantity dispensed is automatically deducted from inventory. The system prevents dispensing quantities that exceed remaining stock.',
    },
    {
      id: 8,
      category: 'roles',
      question: 'What should I do if I forget my login PIN?',
      answer: 'Ask your on-site Clinic Admin to update your PIN in Staff Management. Administrators can set a new 4-digit numeric PIN for any team member instantly.',
    },
  ];

  const toggleAccordion = (id: number) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((item) => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const filteredFaqs = faqs.filter((faq) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    return faq.question.toLowerCase().includes(term) || faq.answer.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-8">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/help"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--emerald-700)] hover:text-[var(--emerald-900)] bg-white px-3 py-1.5 rounded-full border border-[var(--line)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Help Center</span>
        </Link>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions or keywords…"
            className="w-full bg-white border border-[var(--line)] rounded-full pl-9 pr-4 py-2 text-xs font-bold focus:outline-none focus:border-[var(--emerald-700)] shadow-xs"
          />
        </div>
      </div>

      {/* Scripture Banner */}
      <div className="bg-white rounded-2xl border border-[var(--line)] p-4 flex items-center gap-3">
        <BookOpen className="w-5 h-5 text-[var(--gold-700)] shrink-0" />
        <p className="font-serif italic text-xs text-[var(--emerald-900)] font-semibold">
          "Trust in the Lord with all thine heart, and lean not unto thine own understanding." Proverbs 3:5
        </p>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[var(--line)] p-8 text-center text-[var(--ink-soft)]">
            <p className="font-bold text-sm">No questions match your search keyword.</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[var(--line)] overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-[var(--cream)]/60 cursor-pointer min-h-[52px]"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-[var(--emerald-700)] shrink-0" />
                    <span className="font-serif font-bold text-base text-[var(--emerald-900)]">
                      {faq.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[var(--ink-soft)] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--ink-soft)] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 border-t border-[var(--line)] bg-[var(--cream)]/30 text-xs text-[var(--ink-soft)] leading-relaxed">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
