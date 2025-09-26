import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Globe,
  Play,
  Users,
  BookOpen,
  Award,
  Clock,
  Star,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail
} from 'lucide-react'
import { Navbar, Nav, Container, Offcanvas, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

// LinguaNest — Enhanced Landing Page (single-file React component)
// Adjusted image positions: hero image lifted up slightly and the three overlapping
// cards have been moved upwards for a stronger visual overlap and nicer composition.

export default function LandingPageAlt() {
  const [mounted, setMounted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showOffcanvas, setShowOffcanvas] = useState(false)

  useEffect(() => setMounted(true), [])

  const steps = [
    {
      icon: Users,
      title: 'Find your trainer',
      desc: 'Smart filters: language, accent, price, availability and student ratings.'
    },
    {
      icon: BookOpen,
      title: 'Book a session',
      desc: 'One-click booking, instant calendar sync and secure payments.'
    },
    {
      icon: Play,
      title: 'Practice & improve',
      desc: 'Live lessons, role-plays, recordings and tailored homework.'
    },
    {
      icon: Award,
      title: 'Track progress',
      desc: 'Personal dashboard, streaks, and certificates.'
    }
  ]

  const features = [
    { icon: Clock, title: 'Flexible Hours', text: 'Lessons at any time — morning, night or weekends.' },
    { icon: Star, title: 'Expert Trainers', text: 'Certified tutors with real teaching experience.' },
    { icon: MessageSquare, title: 'Immersive Tools', text: 'Live transcripts, quizzes and pronunciation scoring.' }
  ]

  const faqs = [
    { q: 'How do I choose a trainer?', a: 'Use filters (experience, rating, price) and send a short message to get a feel. Look for video intros and student reviews.' },
    { q: 'What languages are available?', a: '50+ languages including Spanish, French, German, Chinese, Japanese, Arabic and many dialects.' },
    { q: 'Can I try before I pay?', a: 'Yes — we offer a free trial credit for first-time students. Trial availability depends on the trainer.' },
    { q: 'How do payments work?', a: 'We use Stripe for secure checkout. Cards and Apple/Google Pay are accepted where available.' },
    { q: 'Can I reschedule or cancel?', a: 'Reschedule up to 24 hours before a session. Some trainers may have different policies — check their profile.' },
    { q: 'Do trainers provide materials?', a: 'Many trainers include PDFs, flashcards or audio. You can also upload your own material before a lesson.' },
    { q: 'Is there a mobile app?', a: 'Coming soon — our PWA works great on mobile and can be installed to your home screen.' }
  ]

  const reviews = [
    {
      name: 'Sarah J.',
      role: 'Business professional',
      text: 'The trainers are excellent — practical and patient. After a month I was comfortable conducting client calls in Spanish. The homework and recorded sessions were invaluable.',
      rating: 5
    },
    {
      name: 'Marco P.',
      role: 'University student',
      text: 'Lessons are structured but flexible. My speaking confidence improved rapidly. The trainer recommended focused listening tasks that really helped.',
      rating: 5
    },
    {
      name: 'Aiko S.',
      role: 'Traveler',
      text: 'The cultural mini-lessons helped me with real conversations while traveling. The trainer prepared a short phrase sheet for my trip — super useful!',
      rating: 5
    },
    {
      name: 'Neha R.',
      role: 'Designer',
      text: 'Easy scheduling and consistent progress checks. I love the micro-lessons between full sessions.',
      rating: 4
    }
  ]

  // Curated images (Unsplash)
  const heroImage = 'https://ufhealthjax.org/assets/images/stories/_860x573_crop_center-center_line/Overcoming-Language-Barriers-in-Health-Care.jpg'
  const cardImage1 = 'https://gurmentor.com/wp-content/uploads/2020/11/gurmentor.com-best-language-learning-methods-and-teaching-approaches-explained-2020-11-17_16-21-09_140956.png'
  const cardImage2 = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop'
  const cardImage3 = 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=900&auto=format&fit=crop'

  return (
    <div className="min-h-screen font-inter bg-[linear-gradient(180deg,#f8fbff_0%,#fffef9_60%)] text-slate-900">
      

      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-sm border-b border-white/40">
        <Container className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#0ea5a3] rounded-xl flex items-center justify-center shadow-md" aria-hidden>
                <Globe className="text-white" />
              </div>
              <div>
                <div className="text-lg font-semibold">LearnOSphere</div>
                <div className="text-xs text-slate-500 -mt-1">Live lessons · Micro-courses</div>
              </div>
            </div>

            <nav className="hidden sm:flex items-center gap-6">
              <Link to="/trainers" className="text-sm font-medium hover:text-[#0ea5a3]">Trainers</Link>
              
              
              <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900">Sign in</Link>
              <Link to="/register" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0ea5a3] text-white text-sm font-semibold shadow hover:scale-105 transition">Get started</Link>
            </nav>

            <div className="sm:hidden">
              <Button variant="light" onClick={() => setShowOffcanvas(true)} aria-label="Open menu">☰</Button>

              <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end" aria-labelledby="offcanvas-nav">
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title id="offcanvas-nav">Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Nav className="flex-column gap-2">
                    <Nav.Link as={Link} to="/main" onClick={() => setShowOffcanvas(false)}>Trainers</Nav.Link>
                    <Nav.Link as={Link} to="/plans" onClick={() => setShowOffcanvas(false)}>Pricing</Nav.Link>
                    <Nav.Link as={Link} to="/about" onClick={() => setShowOffcanvas(false)}>About</Nav.Link>
                    <Nav.Link as={Link} to="/login" onClick={() => setShowOffcanvas(false)}>Sign in</Nav.Link>
                    <div className="mt-3">
                      <Link to="/register" onClick={() => setShowOffcanvas(false)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0ea5a3] text-white text-sm font-semibold">Get started</Link>
                    </div>
                  </Nav>
                </Offcanvas.Body>
              </Offcanvas>
            </div>
          </div>
        </Container>
      </header>

      <main className="pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-left"
            >
              <h1 className="text-4xl md:text-6xl font-serif leading-tight text-slate-900">
                Speak with confidence — <span className="text-[#0ea5a3]">real tutors, real conversations</span>
              </h1>

              <p className="mt-6 text-lg text-slate-600 max-w-xl">
                Quickly gain practical speaking skills with 1:1 lessons, micro-modules and conversation practice designed by expert tutors.
                Start with a free trial, learn at your pace and see measurable progress every week.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border text-sm text-slate-700 shadow-sm">⭐ 4.9 average rating</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border text-sm text-slate-700 shadow-sm">✅ Verified tutors</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border text-sm text-slate-700 shadow-sm">⏱️ 15–60 min lessons</div>
              </div>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl">
                {['english','Spanish'].map((l) => (
                  <button key={l} className="flex items-center gap-3 px-4 py-3 rounded-full bg-white shadow-sm border hover:scale-[1.02] transition-transform focus:outline-none focus:ring-2 focus:ring-[#0ea5a3]" aria-label={`Browse ${l}`}>
                    <div className="w-7 h-7 rounded-full bg-[#fde68a] flex items-center justify-center text-sm">{l[0]}</div>
                    <span className="text-sm font-medium">{l}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/trainers" className="inline-flex items-center gap-3 px-6 py-3 bg-[#0ea5a3] text-white rounded-lg shadow hover:scale-105 transition" aria-label="Start learning"> 
                  <Play />
                  Start learning
                </Link>
                <Link to="/register?role=trainer" className="inline-flex items-center gap-3 px-6 py-3 border border-[#0ea5a3] text-[#0ea5a3] rounded-lg hover:bg-[#ecfdf5] transition" aria-label="Become a trainer">
                  <Users /> Become a trainer
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
                <motion.div initial={{ scale: 0.95 }} animate={mounted ? { scale: 1 } : {}} className="text-center">
                  <div className="text-2xl font-bold text-[#0ea5a3]">400+</div>
                  <div className="text-sm text-slate-600">Trainers</div>
                </motion.div>
                <motion.div initial={{ scale: 0.95 }} animate={mounted ? { scale: 1.03 } : {}} className="text-center">
                  <div className="text-2xl font-bold text-[#f59e0b]">60+</div>
                  <div className="text-sm text-slate-600">Languages</div>
                </motion.div>
                <motion.div initial={{ scale: 0.95 }} animate={mounted ? { scale: 1.06 } : {}} className="text-center">
                  <div className="text-2xl font-bold text-[#ef4444]">12K+</div>
                  <div className="text-sm text-slate-600">Students</div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl -translate-y-6 md:-translate-y-12">
              <img loading="lazy" src={heroImage} alt="students practicing a language together" className="w-full h-[420px] md:h-96 lg:h-[520px] object-cover" />

              {/* Left card - moved up */}
              <div className="absolute left-6 bottom-24 w-52 rounded-xl overflow-hidden shadow-lg border-2 border-white bg-white">
                <img loading="lazy" src={cardImage1} alt="culture and conversation" className="w-full h-32 object-cover" />
                <div className="p-3">
                  <div className="text-sm font-semibold">Cultural conversations</div>
                  <div className="text-xs text-slate-500">Contextual lessons you’ll actually use</div>
                </div>
              </div>

              {/* Right top card - nudged slightly higher */}
              <div className="absolute right-6 top-2 w-44 rounded-xl overflow-hidden shadow-lg border-2 border-white bg-white">
                <img loading="lazy" src={cardImage2} alt="tutor profile" className="w-full h-40 object-cover" />
                <div className="p-3">
                  <div className="text-sm font-semibold">Meet tutors</div>
                  <div className="text-xs text-slate-500">See video intros & ratings</div>
                </div>
              </div>

              {/* Lower-right card - lifted up and pulled inwards */}
              <div className="absolute -right-6 bottom-36 w-64 rounded-xl overflow-hidden shadow-lg border-2 border-white bg-white">
                <div className="p-4">
                  <div className="text-lg font-bold">Practice </div>
                  <div className="text-xs text-slate-500 mt-2">Short tasks to try between lessons</div>
                </div>
                <img loading="lazy" src={cardImage3} alt="mini lesson" className="w-full h-20 object-cover" />
              </div>

            </motion.div>
          </div>
        </div>
      </main>

      <section className="py-16 bg-white" aria-labelledby="how-it-works">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="how-it-works" className="text-3xl md:text-4xl font-serif">How it works — in 4 simple steps</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Designed to get you speaking fast: pick, book, practice and track.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={i} whileHover={{ y: -6 }} className="bg-gradient-to-b from-[#f0fdf4] to-white rounded-2xl p-6 shadow hover:shadow-xl transition" role="article">
                <div className="w-14 h-14 rounded-lg bg-white shadow flex items-center justify-center mb-4">
                  <s.icon className="text-[#0ea5a3]" aria-hidden />
                </div>
                <h3 className="font-semibold text-lg">{s.title}</h3>
                <p className="text-sm text-slate-600 mt-2">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#fff7ed]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-serif">Why learners love HIREGENIUS</h3>
              <p className="mt-4 text-slate-600 max-w-xl">Short lessons, lots of speaking time and tutors focused on practical outcomes. Learn phrases you’ll use the very next day.</p>

              <div className="mt-8 grid sm:grid-cols-3 gap-4">
                {features.map((f, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl shadow hover:scale-[1.02] transition" role="group">
                    <f.icon className="w-9 h-9 text-[#0ea5a3]" aria-hidden />
                    <div className="font-semibold mt-3">{f.title}</div>
                    <div className="text-sm text-slate-600 mt-1">{f.text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[#fde68a] flex items-center justify-center">⭐</div>
                  <div>
                    <div className="font-semibold">Real outcomes</div>
                    <div className="text-xs text-slate-500">Progress reports every 4 lessons</div>
                  </div>
                </div>
                <p className="text-slate-700">From small talk to business calls — our curriculum is outcome-focused so you can see measurable improvement.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow">Quick lessons</div>
                <div className="bg-white p-4 rounded-xl shadow">Excellent Material</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16" aria-labelledby="reviews">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 id="reviews" className="text-3xl font-serif">What learners say</h3>
            <p className="mt-2 text-slate-600">Real reviews from students and professionals who used LinguaNest.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((r, i) => (
              <article key={i} className="bg-white rounded-xl shadow p-6 hover:shadow-2xl transition" aria-label={`Review by ${r.name}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#fde68a] flex items-center justify-center font-semibold">{r.name.split(' ')[0][0]}</div>
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.role}</div>
                  </div>
                </div>
                <p className="text-slate-700">“{r.text}”</p>
                <div className="mt-4 text-sm text-slate-500">{Array.from({ length: r.rating }).map((_, idx) => '★').join('')}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16" aria-labelledby="faq-heading">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h3 id="faq-heading" className="text-3xl font-serif text-center">Frequently Asked Questions</h3>
          <div className="mt-8 space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between" aria-expanded={openFaq === i} aria-controls={`faq-${i}`}>
                  <div className="text-left">
                    <div className="font-semibold">{f.q}</div>
                    {openFaq === i && <div id={`faq-${i}`} className="text-sm text-slate-600 mt-2">{f.a}</div>}
                  </div>
                  <div className="ml-4">
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown />
                    </motion.div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-[#0ea5a3]/10 to-[#f97316]/8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h4 className="text-2xl font-semibold">Start speaking confidently</h4>
          <p className="text-slate-600 mt-2">Sign up now and claim your free trial lesson. Get personalized recommendations and a 7-day plan after your first session.</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/main" className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-[#0ea5a3] text-white">Browse trainers <ChevronRight /></Link>
            <Link to="/register" className="inline-flex items-center gap-3 px-6 py-3 rounded-lg border border-[#0ea5a3] text-[#0ea5a3]">Become a trainer</Link>
          </div>
        </div>
      </section>

      {/* Footer - expanded */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-semibold text-lg">LinguaNest</div>
            <div className="text-sm text-slate-400 mt-2">© {new Date().getFullYear()} LinguaNest — All rights reserved</div>
            <div className="mt-4 text-sm text-slate-400">Email: hello@linguanest.example</div>
            <div className="text-sm text-slate-400">Phone: +1 (555) 123-4567</div>
          </div>

          <div>
            <div className="font-semibold">Company</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/careers" className="hover:underline">Careers</Link></li>
              <li><Link to="/blog" className="hover:underline">Blog</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold">Resources</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li><Link to="/help" className="hover:underline">Help Center</Link></li>
              <li><Link to="/terms" className="hover:underline">Terms</Link></li>
              <li><Link to="/privacy" className="hover:underline">Privacy</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold">Stay in touch</div>
            

            <div className="mt-4 flex items-center gap-3 text-slate-300">
              <a href="#" aria-label="Facebook"><Facebook /></a>
              <a href="#" aria-label="Twitter"><Twitter /></a>
              <a href="#" aria-label="Instagram"><Instagram /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin /></a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-8 border-t border-white/10 pt-6 text-sm text-slate-400 flex flex-col sm:flex-row justify-between">
          <div>Made with ❤️ in LinguaNest — 123 Language St, Suite 4, New York, NY</div>
          <div className="mt-3 sm:mt-0">Version 1.0 • Privacy policy</div>
        </div>
      </footer>
    </div>
  )
}
