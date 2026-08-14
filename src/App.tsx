import { useState, useEffect, useRef } from 'react'

// ─── Scroll-triggered visibility hook ────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, running: boolean, duration = 2000) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!running) return
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [running, target, duration])
  return count
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ target, label, prefix = '+', running }: { target: number; label: string; prefix?: string; running: boolean }) {
  const count = useCountUp(target, running)
  const formatted = count.toLocaleString('ar-EG')
  return (
    <div
      className="card-stroke card-stroke-hover rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300"
      style={{ background: '#0d1117' }}
    >
      <div
        className="text-5xl md:text-6xl font-black mb-3 text-glow"
        style={{ color: '#3b82f6', fontFamily: 'Cairo, sans-serif', letterSpacing: '-0.02em' }}
      >
        {prefix}{formatted}
      </div>
      <div className="text-base md:text-lg font-medium" style={{ color: '#8a9bb0' }}>{label}</div>
    </div>
  )
}

// ─── Management card ─────────────────────────────────────────────────────────
function ManagementCard({
  img, name, title, delay,
}: { img: string; name: string; title: string; delay: string }) {
  return (
    <div
      className={`card-stroke card-stroke-hover rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 section-enter visible animate-fade-up ${delay}`}
      style={{ background: '#0d1117' }}
    >
      <div
        className="w-44 h-44 rounded-full overflow-hidden mb-6 ring-2 blue-glow"
        style={{ ringColor: 'rgba(29,111,232,0.4)', background: '#111820' }}
      >
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
      <p className="text-sm font-medium" style={{ color: '#3b82f6' }}>{title}</p>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [complaint, setComplaint] = useState('')
  const statsSection = useInView(0.2)
  const c1 = useCountUp(25000, statsSection.visible)
  const c2 = useCountUp(8500, statsSection.visible)
  const c3 = useCountUp(2000, statsSection.visible)

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(complaint.trim() || 'شكوى من موقع المستشفى')
    window.open(`https://wa.me/201066719067?text=${msg}`, '_blank')
  }

  const mgmt = [
    {
      name: 'الدكتور وائل حسن أحمد',
      title: 'صيدلي أول — المدير',
      img: new URL('@/imports/____-3.png', import.meta.url).href,
    },
    {
      name: 'الدكتورة أمل السعيد',
      title: 'صيدلانية — نائبة المدير',
      img: new URL('@/imports/___.png', import.meta.url).href,
    },
    {
      name: 'الدكتور محمد حسنين',
      title: 'رئيس الصيدلية — صيدلي أول',
      img: new URL('@/imports/____-4.png', import.meta.url).href,
    },
  ]

  const delays = ['delay-100', 'delay-200', 'delay-300', 'delay-400']

  return (
    <div style={{ background: '#080a0f', minHeight: '100vh' }} dir="rtl">

      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between"
        style={{ background: 'rgba(8,10,15,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(231,237,237,0.08)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center blue-glow"
            style={{ background: '#1d6fe8' }}
          >
            <img src={new URL('@/imports/WhatsApp_Image_2026-08-13_at_10.44.01_PM.jpeg', import.meta.url).href} alt="شعار المستشفى" className="w-full h-full object-contain p-1" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">مستشفى شبراسندي</div>
            <div className="text-xs" style={{ color: '#8a9bb0' }}>المركزي</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['الرئيسية', 'الإدارة', 'إحصائيات', 'الشكاوى'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium transition-colors duration-200 hover:text-blue-400"
              style={{ color: '#8a9bb0' }}
            >
              {item}
            </a>
          ))}
        </div>
        <a
          href={`https://wa.me/201066719067`}
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 blue-glow"
          style={{ background: '#1d6fe8' }}
        >
          تواصل معنا
        </a>
      </nav>

      {/* ── Hero ── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden px-6 md:px-16 lg:px-24 py-20"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(29,111,232,0.10) 0%, transparent 70%), #080a0f' }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(29,111,232,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(29,111,232,0.08) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Blue orb */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(29,111,232,0.08)' }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div className="animate-fade-up">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
              style={{ background: 'rgba(29,111,232,0.12)', border: '1px solid rgba(29,111,232,0.3)', color: '#3b82f6' }}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" />
              خبر سار — إعلان هام
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6"
              style={{ fontFamily: 'Cairo, sans-serif', lineHeight: '1.25' }}
            >
              تركيب جهاز الأشعة
              <span className="block text-glow" style={{ color: '#3b82f6' }}>المقطعية الجديد</span>
              بالمستشفى
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed mb-8 max-w-lg"
              style={{ color: '#8a9bb0', lineHeight: '1.85' }}
            >
              يسعد إدارة مستشفى شبراسندي المركزي أن تُعلن عن تركيب جهاز أشعة مقطعية حديث من الجيل الأحدث، لتحسين مستوى الخدمات التشخيصية وتقديم رعاية صحية أفضل لجميع مرضانا الكرام.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                className="px-8 py-4 rounded-xl text-white font-bold text-base transition-all duration-200 hover:opacity-90 hover:scale-105 blue-glow"
                style={{ background: '#1d6fe8' }}
              >
                اعرف المزيد
              </button>
              <a
                href={`https://wa.me/201066719067`}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 hover:border-blue-400"
                style={{ border: '1px solid rgba(231,237,237,0.2)', color: '#e7eded' }}
              >
                احجز موعدك
              </a>
            </div>
          </div>

          {/* CT Scan Image */}
          <div className="relative animate-float animate-fade-up delay-300">
            <div
              className="relative rounded-3xl overflow-hidden blue-glow"
              style={{ border: '1px solid rgba(29,111,232,0.25)', aspectRatio: '4/3' }}
            >
              <img
                src="https://images.unsplash.com/photo-1666214280352-db292c05fd80?w=900&h=675&fit=crop&auto=format"
                alt="جهاز الأشعة المقطعية الجديد في مستشفى شبراسندي المركزي"
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(8,10,15,0.3) 0%, rgba(29,111,232,0.1) 100%)' }}
              />
              {/* Badge */}
              <div
                className="absolute bottom-4 right-4 px-4 py-2 rounded-xl text-sm font-bold text-white"
                style={{ background: 'rgba(8,10,15,0.85)', border: '1px solid rgba(29,111,232,0.4)', backdropFilter: 'blur(8px)' }}
              >
                🏥 تقنية طبية متطورة
              </div>
            </div>
            {/* Floating stat */}
            <div
              className="absolute -bottom-4 -left-4 px-5 py-3 rounded-2xl shadow-xl"
              style={{ background: '#0d1117', border: '1px solid rgba(231,237,237,0.12)', backdropFilter: 'blur(8px)' }}
            >
              <div className="text-2xl font-black" style={{ color: '#3b82f6' }}>+25K</div>
              <div className="text-xs" style={{ color: '#8a9bb0' }}>مريض تم خدمتهم</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Management Section ── */}
      <section className="px-6 md:px-16 lg:px-24 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
              style={{ background: 'rgba(29,111,232,0.10)', border: '1px solid rgba(29,111,232,0.25)', color: '#3b82f6' }}
            >
              الفريق القيادي
            </div>
            <h2
              className="text-3xl md:text-4xl font-black text-white"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              الإدارة
            </h2>
            <p className="mt-3 text-base" style={{ color: '#8a9bb0' }}>فريق متخصص يقود المستشفى نحو التميز في الرعاية الصحية</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {mgmt.map((person, i) => (
              <ManagementCard
                key={person.name}
                name={person.name}
                title={person.title}
                img={person.img}
                delay={delays[i]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Statistics ── */}
      <section
        className="px-6 md:px-16 lg:px-24 py-24"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(29,111,232,0.06) 0%, transparent 70%)' }}
      >
        <div className="max-w-7xl mx-auto" ref={statsSection.ref}>
          <div className="mb-14 text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
              style={{ background: 'rgba(29,111,232,0.10)', border: '1px solid rgba(29,111,232,0.25)', color: '#3b82f6' }}
            >
              أرقام وإنجازات
            </div>
            <h2
              className="text-3xl md:text-4xl font-black text-white"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              إحصائيات المستشفى
            </h2>
            <p className="mt-3 text-base" style={{ color: '#8a9bb0' }}>أرقام تعكس التزامنا بتقديم أعلى معايير الرعاية الصحية</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="card-stroke card-stroke-hover rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300"
              style={{ background: '#0d1117' }}
            >
              <div
                className="text-5xl md:text-6xl font-black mb-3 text-glow"
                style={{ color: '#3b82f6', fontFamily: 'Cairo, sans-serif' }}
              >
                +{statsSection.visible ? c1.toLocaleString('ar-EG') : '0'}
              </div>
              <div className="text-base md:text-lg font-medium" style={{ color: '#8a9bb0' }}>أكبر عدد مرضى تم خدمتهم</div>
            </div>
            <div
              className="card-stroke card-stroke-hover rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300"
              style={{ background: '#0d1117' }}
            >
              <div
                className="text-5xl md:text-6xl font-black mb-3 text-glow"
                style={{ color: '#3b82f6', fontFamily: 'Cairo, sans-serif' }}
              >
                +{statsSection.visible ? c2.toLocaleString('ar-EG') : '0'}
              </div>
              <div className="text-base md:text-lg font-medium" style={{ color: '#8a9bb0' }}>أكبر عدد عمليات ناجحة</div>
            </div>
            <div
              className="card-stroke card-stroke-hover rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300"
              style={{ background: '#0d1117' }}
            >
              <div
                className="text-5xl md:text-6xl font-black mb-3 text-glow"
                style={{ color: '#3b82f6', fontFamily: 'Cairo, sans-serif' }}
              >
                +{statsSection.visible ? c3.toLocaleString('ar-EG') : '0'}
              </div>
              <div className="text-base md:text-lg font-medium" style={{ color: '#8a9bb0' }}>شكوى تم حلها</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Complaint Section ── */}
      <section className="px-6 md:px-16 lg:px-24 py-24 relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(29,111,232,0.05)' }}
        />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="mb-10 text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
              style={{ background: 'rgba(29,111,232,0.10)', border: '1px solid rgba(29,111,232,0.25)', color: '#3b82f6' }}
            >
              نهتم برأيك
            </div>
            <h2
              className="text-3xl md:text-4xl font-black text-white mb-3"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              منظومة الشكاوى
            </h2>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#3b82f6' }}>اكتب شكوتك الآن</h3>
            <p className="text-base leading-relaxed" style={{ color: '#8a9bb0', lineHeight: '1.8' }}>
              نحن نهتم بآرائكم وملاحظاتكم، ساعدنا في تحسين مستوى الخدمة<br className="hidden md:block" />
              من خلال مشاركة شكواك أو ملاحظتك معنا.
            </p>
          </div>

          <div
            className="rounded-3xl p-8 md:p-10"
            style={{ background: '#0d1117', border: '1px solid rgba(231,237,237,0.10)' }}
          >
            <textarea
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder="اكتب شكوتك هنا..."
              rows={6}
              className="w-full rounded-2xl px-6 py-4 text-base resize-none outline-none transition-all duration-200 focus:ring-2"
              style={{
                background: '#111820',
                border: '1px solid rgba(231,237,237,0.12)',
                color: '#f0f4f8',
                fontFamily: 'Cairo, sans-serif',
                lineHeight: '1.8',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(29,111,232,0.5)'; e.target.style.boxShadow = '0 0 20px rgba(29,111,232,0.12)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(231,237,237,0.12)'; e.target.style.boxShadow = 'none' }}
            />
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={handleWhatsApp}
                className="flex-1 md:flex-none px-8 py-4 rounded-2xl text-white font-bold text-base transition-all duration-200 hover:opacity-90 hover:scale-105 flex items-center justify-center gap-3 blue-glow"
                style={{ background: '#1d6fe8' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                تواصل معنا عبر واتساب
              </button>
              <p className="text-xs hidden md:block" style={{ color: '#8a9bb0' }}>سيتم إرسال شكوتك مباشرة<br />لفريق خدمة العملاء</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="px-6 md:px-16 lg:px-24 pt-16 pb-8"
        style={{ background: '#060810', borderTop: '1px solid rgba(231,237,237,0.08)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12" style={{ borderBottom: '1px solid rgba(231,237,237,0.08)' }}>
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center blue-glow"
                  style={{ background: '#1d6fe8' }}
                >
                  <img src={new URL('@/imports/WhatsApp_Image_2026-08-13_at_10.44.01_PM.jpeg', import.meta.url).href} alt="شعار المستشفى" className="w-full h-full object-contain p-1" />
                </div>
                <div>
                  <div className="text-white font-bold text-base">مستشفى شبراسندي المركزي</div>
                  <div className="text-xs" style={{ color: '#3b82f6' }}>رعاية متميزة · تقنية متطورة</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#8a9bb0', lineHeight: '1.9' }}>
                مستشفى متكامل الخدمات يقدم رعاية طبية شاملة بأعلى معايير الجودة، مزود بأحدث التقنيات الطبية لخدمة مرضانا الكرام.
              </p>
            </div>
            {/* Links */}
            <div>
              <h4 className="text-white font-bold text-base mb-5">روابط سريعة</h4>
              <ul className="space-y-3">
                {['الصفحة الرئيسية', 'الإدارة', 'إحصائيات المستشفى', 'منظومة الشكاوى', 'احجز موعد'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-400" style={{ color: '#8a9bb0' }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="text-white font-bold text-base mb-5">تواصل معنا</h4>
              <div className="space-y-4">
                <a
                  href="https://wa.me/201066719067"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-sm transition-colors duration-200 hover:text-green-400"
                  style={{ color: '#8a9bb0' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#25d366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  01066719067
                </a>
                <div className="flex items-center gap-3 text-sm" style={{ color: '#8a9bb0' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  شبراسندي، السنبلاوين، المنصورة، محافظة الدقهلية، مصر
                </div>
                <div className="flex gap-3 mt-4">
                  {[
                    { href: '#', icon: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /> },
                  ].map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                      style={{ background: 'rgba(29,111,232,0.12)', border: '1px solid rgba(29,111,232,0.2)' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {s.icon}
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Bottom */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm" style={{ color: '#8a9bb0' }}>
              © {new Date().getFullYear()} مستشفى شبراسندي المركزي — جميع الحقوق محفوظة
            </p>
            <p className="text-xs" style={{ color: '#4a5568' }}>صنع بواسطة Mahmoud Ahmed Sallam</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
