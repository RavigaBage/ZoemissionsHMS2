// @ts-ignore: Suppress missing declaration file for 'react' in this environment
import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-[var(--cream)] text-[var(--ink)] font-sans min-h-screen">
      {/* TOP BAR */}
      <div className="sticky top-0 z-50 bg-[var(--cream)]/92 backdrop-blur-md border-b border-[var(--line)]">
        <div className="max-w-[1180px] mx-auto px-7 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-serif font-semibold text-xl text-[var(--emerald-900)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--gold-600)] inline-block"></span>
            <span>Missions Clinic</span>
          </div>
          <Link
            to="/login"
            className="bg-[var(--emerald-700)] text-[var(--cream)] hover:translate-y-[-1px] hover:shadow-lg font-bold text-sm px-6 py-2.5 rounded-full border-none cursor-pointer transition-all min-h-[44px] flex items-center"
          >
            Log in
          </Link>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-7">
        {/* HERO */}
        <section className="py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7">
              <div className="text-xs font-bold tracking-widest uppercase text-[var(--gold-700)] mb-4 flex items-center gap-2.5">
                <span>Missions Clinic System</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--emerald-900)] leading-tight">
                Every record here is <em className="italic text-[var(--gold-700)]">someone we serve.</em>
              </h1>
              <p className="mt-5 text-lg text-[var(--ink-soft)] max-w-xl leading-relaxed">
                This system helps our team register, treat, and care for patients, even when the power and the signal don't cooperate. Take a minute to look around before you sign in.
              </p>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Link
                  to="/login"
                  className="bg-[var(--emerald-700)] text-[var(--cream)] hover:bg-[var(--emerald-900)] font-bold text-base px-7 py-3 rounded-full transition-all min-h-[48px] inline-flex items-center shadow-md"
                >
                  Log in
                </Link>
                <a
                  href="#navigate"
                  className="border-1.5 border-[var(--emerald-700)] text-[var(--emerald-700)] hover:bg-[var(--emerald-100)] font-bold text-base px-7 py-3 rounded-full transition-all min-h-[48px] inline-flex items-center"
                >
                  See how it works
                </a>
              </div>
            </div>

            <div className="md:col-span-5 relative flex justify-center py-4">
              <div className="absolute inset-0 m-auto w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,_rgba(201,154,46,0.28)_0%,_rgba(201,154,46,0)_70%)] z-0"></div>
              <svg viewBox="0 0 360 420" fill="none" className="w-full max-w-[340px] h-auto relative z-10" role="img" aria-label="Illustration of a glowing lantern">
                <g stroke="#C99A2E" strokeWidth="2.5" strokeLinecap="round" opacity="0.55">
                  <line x1="180" y1="70" x2="180" y2="30"/>
                  <line x1="238" y1="95" x2="268" y2="65"/>
                  <line x1="122" y1="95" x2="92" y2="65"/>
                  <line x1="255" y1="140" x2="292" y2="140"/>
                  <line x1="105" y1="140" x2="68" y2="140"/>
                </g>
                <path d="M180 30 C180 30 168 15 180 8 C192 1 196 18 186 22" stroke="#0B4530" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <line x1="180" y1="30" x2="180" y2="70" stroke="#0B4530" strokeWidth="3"/>
                <rect x="150" y="70" width="60" height="14" rx="4" fill="#135C3D"/>
                <circle cx="180" cy="175" r="80" fill="#F3DFA0" opacity="0.55"/>
                <circle cx="180" cy="175" r="58" fill="#C99A2E" opacity="0.9"/>
                <rect x="120" y="100" width="120" height="150" rx="18" stroke="#0B4530" strokeWidth="4" fill="none"/>
                <line x1="120" y1="130" x2="240" y2="130" stroke="#0B4530" strokeWidth="3"/>
                <line x1="120" y1="220" x2="240" y2="220" stroke="#0B4530" strokeWidth="3"/>
                <line x1="180" y1="100" x2="180" y2="250" stroke="#0B4530" strokeWidth="2" opacity="0.4"/>
                <rect x="140" y="250" width="80" height="16" rx="4" fill="#135C3D"/>
                <rect x="160" y="266" width="40" height="10" rx="3" fill="#0B4530"/>
                <path d="M100 330 C 70 320, 60 290, 80 270 C 100 300, 100 320, 100 330 Z" fill="#1C7A52"/>
                <path d="M260 330 C 290 320, 300 290, 280 270 C 260 300, 260 320, 260 330 Z" fill="#1C7A52"/>
                <path d="M180 340 C 150 330, 140 300, 160 280 C 180 305, 180 325, 180 340 Z" fill="#0B4530"/>
                <path d="M180 340 C 210 330, 220 300, 200 280 C 180 305, 180 325, 180 340 Z" fill="#135C3D"/>
              </svg>
            </div>
          </div>

          <nav className="bg-white border border-[var(--line)] rounded-full p-2 flex gap-1 overflow-x-auto my-10 shadow-xs" aria-label="Page sections">
            <a href="#welcome" className="px-4 py-2 rounded-full font-bold text-sm text-[var(--ink-soft)] hover:bg-[var(--emerald-100)] hover:text-[var(--emerald-900)] whitespace-nowrap transition-colors">
              Welcome
            </a>
            <a href="#navigate" className="px-4 py-2 rounded-full font-bold text-sm text-[var(--ink-soft)] hover:bg-[var(--emerald-100)] hover:text-[var(--emerald-900)] whitespace-nowrap transition-colors">
              How it works
            </a>
            <a href="#faq" className="px-4 py-2 rounded-full font-bold text-sm text-[var(--ink-soft)] hover:bg-[var(--emerald-100)] hover:text-[var(--emerald-900)] whitespace-nowrap transition-colors">
              Questions
            </a>
            <a href="#errors" className="px-4 py-2 rounded-full font-bold text-sm text-[var(--ink-soft)] hover:bg-[var(--emerald-100)] hover:text-[var(--emerald-900)] whitespace-nowrap transition-colors">
              Errors explained
            </a>
            <a href="#power" className="px-4 py-2 rounded-full font-bold text-sm text-[var(--ink-soft)] hover:bg-[var(--emerald-100)] hover:text-[var(--emerald-900)] whitespace-nowrap transition-colors">
              When power fails
            </a>
          </nav>
        </section>

        {/* WELCOME */}
        <section className="py-12 scroll-mt-24" id="welcome">
          <div className="max-w-xl mb-8">
            <div className="text-xs font-bold tracking-widest uppercase text-[var(--gold-700)] mb-3">Before you begin</div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[var(--emerald-900)]">Why this system exists</h2>
          </div>
          <div className="bg-white border border-[var(--line)] rounded-2xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-7 items-start">
            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" className="shrink-0">
              <circle cx="23" cy="23" r="22" stroke="#C99A2E" strokeWidth="1.5" strokeDasharray="3 4"/>
              <circle cx="23" cy="23" r="10" fill="#F3DFA0"/>
              <circle cx="23" cy="23" r="5" fill="#C99A2E"/>
            </svg>
            <div className="space-y-4 text-[var(--ink-soft)] text-base leading-relaxed">
              <p>We're here because every person who walks through that door deserves to be seen, treated, and treated with dignity , whether the clinic has electricity that day or not. This system exists to make that care faster and more accurate. It should never get in its way.</p>
              <p>It was built for teams working in places where a stable connection is the exception, not the rule, and where not everyone comes in with computer experience. If something feels unclear anywhere in here, that's on us to fix — not a sign you're doing something wrong.</p>
              <p className="font-serif italic text-[var(--emerald-700)] font-semibold text-lg pt-2">A light doesn't need perfect conditions to be worth carrying.</p>
            </div>
          </div>
        </section>

        <hr className="border-t border-[var(--line)] my-8" />

        {/* HOW IT WORKS */}
        <section className="py-12 scroll-mt-24" id="navigate">
          <div className="max-w-xl mb-10">
            <div className="text-xs font-bold tracking-widest uppercase text-[var(--gold-700)] mb-3">How to navigate</div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[var(--emerald-900)]">A patient's path through the system</h2>
            <p className="text-[var(--ink-soft)] mt-3 text-base">Every visit moves through four stops, in order. You'll usually only work in one or two of these — but knowing the whole path helps everything make sense.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-[var(--line)] rounded-2xl p-6 h-full shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[var(--emerald-700)] text-[var(--cream)] font-serif font-semibold text-xl flex items-center justify-center mb-4 shadow-sm">1</div>
              <h3 className="font-serif font-bold text-lg text-[var(--emerald-900)] mb-2">Register</h3>
              <p className="text-[var(--ink-soft)] text-sm">Enter the patient once. Their name, encounter, and history follow them through every stop after this.</p>
            </div>

            <div className="bg-white border border-[var(--line)] rounded-2xl p-6 h-full shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[var(--emerald-700)] text-[var(--cream)] font-serif font-semibold text-xl flex items-center justify-center mb-4 shadow-sm">2</div>
              <h3 className="font-serif font-bold text-lg text-[var(--emerald-900)] mb-2">Vitals</h3>
              <p className="text-[var(--ink-soft)] text-sm">Record temperature, pulse, oxygen, and more. Fields are large on purpose — minimal typing, maximum clarity.</p>
            </div>

            <div className="bg-white border border-[var(--line)] rounded-2xl p-6 h-full shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[var(--emerald-700)] text-[var(--cream)] font-serif font-semibold text-xl flex items-center justify-center mb-4 shadow-sm">3</div>
              <h3 className="font-serif font-bold text-lg text-[var(--emerald-900)] mb-2">Consult</h3>
              <p className="text-[var(--ink-soft)] text-sm">The doctor's screen: complaint, findings, diagnosis, and next steps, all in one place.</p>
            </div>

            <div className="bg-white border border-[var(--line)] rounded-2xl p-6 h-full shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[var(--emerald-700)] text-[var(--cream)] font-serif font-semibold text-xl flex items-center justify-center mb-4 shadow-sm">4</div>
              <h3 className="font-serif font-bold text-lg text-[var(--emerald-900)] mb-2">Pharmacy</h3>
              <p className="text-[var(--ink-soft)] text-sm">Prescriptions arrive here automatically. Dispense the medication, and stock updates on its own.</p>
            </div>
          </div>
        </section>

        <hr className="border-t border-[var(--line)] my-8" />

        {/* FAQ */}
        <section className="py-12 scroll-mt-24" id="faq">
          <div className="max-w-xl mb-8">
            <div className="text-xs font-bold tracking-widest uppercase text-[var(--gold-700)] mb-3">Questions & Answers</div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[var(--emerald-900)]">Things people usually ask</h2>
          </div>

          <div className="space-y-3">
            <details className="bg-white border border-[var(--line)] rounded-xl px-6 py-2 group [&[open]]:border-[var(--gold-600)]">
              <summary className="cursor-pointer list-none py-4 font-bold text-base text-[var(--emerald-900)] flex justify-between items-center gap-4">
                Do I need internet to use this?
                <span className="w-6 h-6 rounded-full bg-[var(--gold-100)] text-[var(--gold-700)] flex items-center justify-center text-xs font-extrabold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="text-[var(--ink-soft)] pb-5 text-sm max-w-2xl">
                No. The system runs over our own private clinic network — one laptop hosts it, and every device connects to that laptop directly. You don't need internet access at all, just a connection to the clinic's own WiFi.
              </div>
            </details>

            <details className="bg-white border border-[var(--line)] rounded-xl px-6 py-2 group [&[open]]:border-[var(--gold-600)]">
              <summary className="cursor-pointer list-none py-4 font-bold text-base text-[var(--emerald-900)] flex justify-between items-center gap-4">
                What if I type a patient's name wrong?
                <span className="w-6 h-6 rounded-full bg-[var(--gold-100)] text-[var(--gold-700)] flex items-center justify-center text-xs font-extrabold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="text-[var(--ink-soft)] pb-5 text-sm max-w-2xl">
                Open the patient's profile and correct it — nothing is locked in permanently. If you're not sure how, ask an admin to walk through it with you the first time.
              </div>
            </details>

            <details className="bg-white border border-[var(--line)] rounded-xl px-6 py-2 group [&[open]]:border-[var(--gold-600)]">
              <summary className="cursor-pointer list-none py-4 font-bold text-base text-[var(--emerald-900)] flex justify-between items-center gap-4">
                Can two staff use the system at the same time?
                <span className="w-6 h-6 rounded-full bg-[var(--gold-100)] text-[var(--gold-700)] flex items-center justify-center text-xs font-extrabold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="text-[var(--ink-soft)] pb-5 text-sm max-w-2xl">
                Yes. Registration, vitals, consults, and pharmacy can all happen at once on different computers — that's the whole point of the queue.
              </div>
            </details>

            <details className="bg-white border border-[var(--line)] rounded-xl px-6 py-2 group [&[open]]:border-[var(--gold-600)]">
              <summary className="cursor-pointer list-none py-4 font-bold text-base text-[var(--emerald-900)] flex justify-between items-center gap-4">
                Where is all the data actually stored?
                <span className="w-6 h-6 rounded-full bg-[var(--gold-100)] text-[var(--gold-700)] flex items-center justify-center text-xs font-extrabold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="text-[var(--ink-soft)] pb-5 text-sm max-w-2xl">
                On the host laptop, in one place. It's backed up regularly, but treat that laptop with care — it's carrying every record for the whole mission.
              </div>
            </details>

            <details className="bg-white border border-[var(--line)] rounded-xl px-6 py-2 group [&[open]]:border-[var(--gold-600)]">
              <summary className="cursor-pointer list-none py-4 font-bold text-base text-[var(--emerald-900)] flex justify-between items-center gap-4">
                What do I do if I forget my PIN?
                <span className="w-6 h-6 rounded-full bg-[var(--gold-100)] text-[var(--gold-700)] flex items-center justify-center text-xs font-extrabold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="text-[var(--ink-soft)] pb-5 text-sm max-w-2xl">
                Find an admin on-site. They can look up your account and reset it in the staff screen — there's no self-service reset, by design.
              </div>
            </details>
          </div>
        </section>

        <hr className="border-t border-[var(--line)] my-8" />

        {/* ERRORS */}
        <section className="py-12 scroll-mt-24" id="errors">
          <div className="max-w-xl mb-8">
            <div className="text-xs font-bold tracking-widest uppercase text-[var(--gold-700)] mb-3">Error glossary</div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[var(--emerald-900)]">What the messages mean</h2>
            <p className="text-[var(--ink-soft)] mt-3 text-base">None of these mean you broke something. Here's what each one is actually telling you, and what to do next.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white border border-[var(--line)] rounded-2xl p-6">
              <span className="inline-block font-mono font-bold text-xs bg-[var(--emerald-900)] text-[var(--gold-200)] px-3 py-1 rounded-md mb-3">Invalid credentials</span>
              <h3 className="font-bold text-base text-[var(--ink)] mb-2">Your name or PIN doesn't match</h3>
              <p className="text-[var(--ink-soft)] text-sm">One of the two was typed incorrectly, or the account doesn't exist yet.</p>
              <p className="mt-3 text-[var(--emerald-700)] font-bold text-xs">Try again slowly, or ask an admin to confirm your login.</p>
            </div>

            <div className="bg-white border border-[var(--line)] rounded-2xl p-6">
              <span className="inline-block font-mono font-bold text-xs bg-[var(--emerald-900)] text-[var(--gold-200)] px-3 py-1 rounded-md mb-3">404 Not Found</span>
              <h3 className="font-bold text-base text-[var(--ink)] mb-2">That record doesn't exist</h3>
              <p className="text-[var(--ink-soft)] text-sm">The patient, encounter, or item you're looking for may have been deleted, or the link is old.</p>
              <p className="mt-3 text-[var(--emerald-700)] font-bold text-xs">Go back and search again from the list.</p>
            </div>

            <div className="bg-white border border-[var(--line)] rounded-2xl p-6">
              <span className="inline-block font-mono font-bold text-xs bg-[var(--emerald-900)] text-[var(--gold-200)] px-3 py-1 rounded-md mb-3">Network error</span>
              <h3 className="font-bold text-base text-[var(--ink)] mb-2">Your device lost the connection</h3>
              <p className="text-[var(--ink-soft)] text-sm">This computer can't currently reach the host laptop over WiFi.</p>
              <p className="mt-3 text-[var(--emerald-700)] font-bold text-xs">See "When the screen won't load" below.</p>
            </div>

            <div className="bg-white border border-[var(--line)] rounded-2xl p-6">
              <span className="inline-block font-mono font-bold text-xs bg-[var(--emerald-900)] text-[var(--gold-200)] px-3 py-1 rounded-md mb-3">Missing required field</span>
              <h3 className="font-bold text-base text-[var(--ink)] mb-2">Something was left blank</h3>
              <p className="text-[var(--ink-soft)] text-sm">A box the system needs wasn't filled in before you submitted the form.</p>
              <p className="mt-3 text-[var(--emerald-700)] font-bold text-xs">Scroll up and look for the field marked in red.</p>
            </div>
          </div>
        </section>

        <hr className="border-t border-[var(--line)] my-8" />

        {/* POWER / OFFLINE */}
        <section className="py-12 scroll-mt-24" id="power">
          <div className="max-w-xl mb-8">
            <div className="text-xs font-bold tracking-widest uppercase text-[var(--gold-700)] mb-3">When conditions aren't ideal</div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[var(--emerald-900)]">Keeping the light on</h2>
            <p className="text-[var(--ink-soft)] mt-3 text-base">These two situations come up in the field more than any error message ever will. Here's exactly what to do.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--gold-100)] border-1.5 border-dashed border-[var(--gold-600)] rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 8h4l-2 5 8-7h-4l2-5-8 7z" fill="#A97B1F"/></svg>
                </div>
                <h3 className="font-serif text-lg font-bold text-[var(--emerald-900)]">When the screen won't load</h3>
              </div>
              <ul className="space-y-3 pl-0 list-none text-sm text-[var(--ink-soft)]">
                <li className="flex gap-2.5"><span className="text-[var(--emerald-700)] font-bold">✓</span> Check the WiFi icon — make sure you're connected to the clinic network, not a phone hotspot.</li>
                <li className="flex gap-2.5"><span className="text-[var(--emerald-700)] font-bold">✓</span> Confirm the host laptop is powered on and awake, not asleep or closed.</li>
                <li className="flex gap-2.5"><span className="text-[var(--emerald-700)] font-bold">✓</span> Wait about 30 seconds and refresh the page once.</li>
                <li className="flex gap-2.5"><span className="text-[var(--emerald-700)] font-bold">✓</span> Still down? Keep treating patients — use the paper triage sheet, and enter everything once the system returns.</li>
              </ul>
            </div>

            <div className="bg-[var(--gold-100)] border-1.5 border-dashed border-[var(--gold-600)] rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="5" y="3" width="8" height="15" rx="2" stroke="#A97B1F" strokeWidth="1.5"/><rect x="8" y="1" width="2" height="2.5" fill="#A97B1F"/><rect x="6.5" y="12" width="5" height="4.5" fill="#A97B1F"/></svg>
                </div>
                <h3 className="font-serif text-lg font-bold text-[var(--emerald-900)]">When your battery is about to die</h3>
              </div>
              <ul className="space-y-3 pl-0 list-none text-sm text-[var(--ink-soft)]">
                <li className="flex gap-2.5"><span className="text-[var(--emerald-700)] font-bold">✓</span> Save or submit whatever form is open right now, first.</li>
                <li className="flex gap-2.5"><span className="text-[var(--emerald-700)] font-bold">✓</span> Plug in immediately if a charger is available anywhere nearby.</li>
                <li className="flex gap-2.5"><span className="text-[var(--emerald-700)] font-bold">✓</span> No power source? Switch to a paper triage card and continue by hand.</li>
                <li className="flex gap-2.5"><span className="text-[var(--emerald-700)] font-bold">✓</span> Never let a device die in the middle of typing — a half-saved entry is harder to fix than a late one.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <footer className="bg-[var(--emerald-900)] text-[var(--cream)] py-14 mt-12">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-[var(--cream)] font-serif text-2xl font-semibold max-w-md">Ready to get started?</h2>
              <p className="text-[var(--cream)]/70 mt-2 max-w-lg text-sm">If anything on this page didn't answer your question, ask a teammate before you guess — someone here has run into it before.</p>
            </div>
            <Link
              to="/login"
              className="bg-[var(--cream)] text-[var(--emerald-900)] hover:bg-[var(--gold-100)] font-bold text-sm px-7 py-3 rounded-full transition-all min-h-[44px] flex items-center shadow-md"
            >
              Log in
            </Link>
          </div>
          <div className="mt-12 pt-6 border-t border-[var(--cream)]/15 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[var(--cream)]/55">
            <span>Missions Clinic System</span>
            <span>Built for the field. Built for the mission.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
