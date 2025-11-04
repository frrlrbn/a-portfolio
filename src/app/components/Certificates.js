'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiDownload } from 'react-icons/fi';

const certificates = [
  {
    title: 'Finalis ICT Business Development',
    image: '/images/certificates/sertifikat-1.webp',
    description: 'Certificate of Achievement',
    date: '2024',
  },
  {
    title: 'Peserta Lomba Electrical Competition',
    image: '/images/certificates/sertifikat-2.webp',
    description: 'Certificate of Participation',
    date: '2024',
  },
  {
    title: 'Peserta Seminar Literasi Digital SMK Negeri 2 Depok Sleman',
    image: '/images/certificates/sertifikat-4.webp',
    description: 'Certificate of Participation',
    date: '2024',
  },
  {
    title: 'Peserta Line Follower Competition',
    image: '/images/certificates/sertifikat-5.webp',
    description: 'Certificate of Participation',
    date: '2024',
  },
  {
    title: 'Peserta Kegiatan Pendidikan dan Pelatihan Peningkatan Kompetensi Peserta Didik SMK Dengan Keahlian Elektronika',
    image: '/images/certificates/sertifikat-6.webp',
    description: 'Certificate of Participation',
    date: '2024',
  },
  {
    title: 'Peserta Kampanye Sosial #ThinkThenDoIt Bijak Bermedia, Cerdas Berkarya',
    image: '/images/certificates/sertifikat-7.webp',
    description: 'Certificate of Participation',
    date: '2022',
  },
  {
    title: 'Peserta Terbaik Bhineka Competition',
    image: '/images/certificates/sertifikat-8.webp',
    description: 'Certificate of Achievement',
    date: '2022',
  },
  {
    title: '50 Terbaik AENS National Competition Vol.2',
    image: '/images/certificates/sertifikat-9.webp',
    description: 'Certificate of Achievement',
    date: '2022',
  },
  {
    title: 'Peserta Campaign "Self Injury Awareness Day"',
    image: '/images/certificates/sertifikat-10.webp',
    description: 'Certificate of Participation',
    date: '2023',
  },
];

export default function Certificates() {
  const scrollContainerRef = useRef(null);
  const trackRef = useRef(null);
  const [sectionHeight, setSectionHeight] = useState(0);
  const [scrollRange, setScrollRange] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ['start start', 'end end'],
    layoutEffect: false,
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);
  const progressWidth = useTransform(scrollYProgress, (value) => `${Math.min(Math.max(value, 0), 1) * 100}%`);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const updateMetrics = () => {
      if (!trackRef.current || !scrollContainerRef.current) return;

      const viewportWidth = scrollContainerRef.current.offsetWidth;
      const totalWidth = trackRef.current.scrollWidth;
      const range = Math.max(totalWidth - viewportWidth, 0);
      const baseHeight = window.innerHeight * (window.innerWidth < 768 ? 0.95 : 0.85);

      setScrollRange(range);
      setSectionHeight(range + baseHeight);
    };

    checkMobile();
    updateMetrics();

    window.addEventListener('resize', checkMobile);
    window.addEventListener('resize', updateMetrics);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', updateMetrics);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const updateMobileMetrics = () => {
      if (!trackRef.current || !scrollContainerRef.current) return;

      const viewportWidth = scrollContainerRef.current.offsetWidth;
      const totalWidth = trackRef.current.scrollWidth;
      const range = Math.max(totalWidth - viewportWidth, 0);
      const baseHeight = window.innerHeight * 0.95;

      setScrollRange(range);
      setSectionHeight(range + baseHeight);
    };

    updateMobileMetrics();
    window.addEventListener('resize', updateMobileMetrics);

    return () => window.removeEventListener('resize', updateMobileMetrics);
  }, [isMobile]);

  return (
    <section id="certificates" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div
        ref={scrollContainerRef}
        className="relative max-w-6xl mx-auto"
        style={{ height: sectionHeight ? `${sectionHeight}px` : `${certificates.length * 60}vh` }}
      >
        <div className="sticky top-24 md:top-28 h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)]">
          <div className="relative h-full cartoon-outline bg-white overflow-hidden">
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
              <motion.h2
                className="text-4xl font-bold text-black relative inline-block text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="relative z-10">Certificates</span>
                <motion.span
                  className="absolute bottom-1.5 left-0 w-full h-2 sm:h-3 bg-[#1c1c84]/20 -z-10"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </motion.h2>
            </div>

            <div className={`absolute z-20 rounded-full overflow-hidden ${isMobile ? 'top-[72px] left-1/2 -translate-x-1/2 w-2/3 h-[6px] bg-slate-200/60' : 'hidden md:block top-28 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-slate-200/70'}`}>
              <motion.span
                style={{ width: progressWidth }}
                className="h-full block bg-gradient-to-r from-[#1c1c84] to-[#2525a8]"
              />
            </div>

            {isMobile && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute top-[88px] left-1/2 -translate-x-1/2 text-xs text-slate-400 font-medium tracking-wide z-10"
              >
                Keep scrolling down :)
              </motion.p>
            )}

            <motion.div
              ref={trackRef}
              className={`absolute left-0 flex items-stretch ${isMobile ? 'top-[calc(50%+30px)] -translate-y-1/2 gap-4 pl-[18vw] pr-[18vw]' : 'top-[calc(50%+25px)] -translate-y-1/2 gap-6 sm:gap-8 lg:gap-10 pl-[12vw] pr-[25vw]'}`}
              style={{ 
                x,
                willChange: 'transform',
              }}
            >
              {certificates.map((certificate, index) => (
                <CertificateItem
                  key={certificate.title}
                  certificate={certificate}
                  index={index}
                  variant={isMobile ? 'mobile' : 'desktop'}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CertificateItem({ certificate, index, variant = 'desktop' }) {
  const isDesktop = variant === 'desktop';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = certificate.image;
    const fileExtension = certificate.image.split('.').pop()?.toLowerCase() ?? 'jpg';
    link.download = `certificate-${index + 1}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.article
      aria-label={`${certificate.title} certificate`}
      whileTap={!isDesktop ? { scale: 0.98 } : undefined}
      className={`cartoon-outline bg-white border-4 border-slate-900 rounded-3xl shadow-2xl p-4 sm:p-6 transition-transform duration-300 ${
        isDesktop
          ? 'min-w-[85vw] sm:min-w-[70vw] lg:min-w-[650px]'
          : 'min-w-[85vw] sm:min-w-[70vw] snap-center'
      }`}
      style={{ willChange: 'transform' }}
    >
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <div className="relative w-full md:w-3/5 lg:w-2/3 aspect-[16/10] bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
          <img
            src={certificate.image}
            alt={certificate.title}
            className="h-full w-full object-contain"
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="w-full md:w-2/5 lg:w-1/3 flex flex-col justify-center space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-[#1c1c84] uppercase">
              <span className="h-2 w-2 rounded-full bg-[#1c1c84]" />
              {certificate.date}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug break-words">
              {certificate.title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {certificate.description}
            </p>
          </div>

          <motion.button
            onClick={handleDownload}
            whileHover={{ scale: 1.03, translateY: -2 }}
            whileTap={{ scale: 0.97 }}
            className="cartoon-outline flex items-center justify-center gap-2 rounded-xl bg-[#1c1c84] text-white px-4 py-2.5 font-semibold shadow-lg hover:bg-[#151560] transition-colors text-xs sm:text-sm w-full"
          >
            <FiDownload size={16} />
            <span>Download</span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
