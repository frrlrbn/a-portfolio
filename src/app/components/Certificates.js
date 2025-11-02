'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { FiDownload } from 'react-icons/fi';

const certificates = [
  {
    title: 'Sertifikat Finalis ICT Business Development',
    image: '/images/sertifikat-1.jpg',
    description: 'Certificate of Achievement',
    date: '2024',
  },
  {
    title: 'Certificate 2',
    image: '/images/sertifikat-2.png',
    description: 'Certificate of Achievement',
    date: '2023',
  },
  {
    title: 'Certificate 3',
    image: '/images/sertifikat-3.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
  {
    title: 'Certificate 4',
    image: '/images/sertifikat-4.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
  {
    title: 'Certificate 5',
    image: '/images/sertifikat-5.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
  {
    title: 'Certificate 6',
    image: '/images/sertifikat-6.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
  {
    title: 'Certificate 7',
    image: '/images/sertifikat-7.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
  {
    title: 'Certificate 8',
    image: '/images/sertifikat-8.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
  {
    title: 'Certificate 9',
    image: '/images/sertifikat-9.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
  {
    title: 'Certificate 10',
    image: '/images/sertifikat-10.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
  {
    title: 'Certificate 11',
    image: '/images/sertifikat-11.jpg',
    description: 'Certificate of Achievement',
    date: '2023',
  },
];

export default function Certificates() {
  const scrollContainerRef = useRef(null);
  const sectionHeight = certificates.length * 120;

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ['start start', 'end end'],
  });

  const stackedProgress = useTransform(scrollYProgress, [0, 1], [0, certificates.length - 1]);
  const smoothStackedProgress = useSpring(stackedProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.8,
  });

  const sectionProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 26,
  });
  const progressHeight = useTransform(sectionProgress, (value) => `${value * 100}%`);

  return (
    <section id="certificates" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-black mb-4 relative inline-block text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="relative z-10">Skills & Expertise</span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-3 bg-[#1c1c84]/20 -z-10"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1]
                }}
              />
            </motion.h2>
          </div>

      <div
        ref={scrollContainerRef}
        className="relative max-w-6xl mx-auto"
        style={{ height: `${sectionHeight}vh` }}
      >
        <div className="sticky top-24 md:top-28 h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)]">
          <div className="relative h-full flex items-center justify-center">
            <div className="absolute -left-2 sm:-left-6 top-0 bottom-0 flex flex-col items-center">
              <span className="hidden sm:block w-px h-full bg-slate-200" />
              <motion.span
                aria-hidden
                style={{ height: progressHeight }}
                className="hidden sm:block absolute left-0 top-0 w-[3px] rounded-full bg-[#1c1c84]"
              />
            </div>

            <div className="relative w-full max-w-4xl h-[72vh] sm:h-[65vh]">
              {certificates.map((certificate, index) => (
                <CertificateCard
                  key={certificate.title}
                  certificate={certificate}
                  index={index}
                  total={certificates.length}
                  progress={smoothStackedProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CertificateCard({ certificate, index, total, progress }) {
  const verticalOffset = 70;
  const y = useTransform(progress, (value) => `${(index - value) * verticalOffset}vh`);

  const scale = useTransform(progress, (value) => {
    const distance = Math.abs(index - value);
    const clamped = Math.min(distance, 1.5);
    return 1 - clamped * 0.08;
  });

  const rotate = useTransform(progress, (value) => {
    const distance = index - value;
    return `${distance * -1.5}deg`;
  });

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
      style={{ y, scale, rotate, zIndex: total - index }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <motion.div
        className="pointer-events-auto w-full max-w-3xl"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="cartoon-outline bg-white/95 backdrop-blur-sm border-4 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
            <div className="w-full md:w-2/3 aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
              <img
                src={certificate.image}
                alt={certificate.title}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="w-full md:w-1/3 space-y-5">
              <div className="space-y-2">
                <span className="text-sm font-semibold text-slate-500">{certificate.date}</span>
                <h3 className="text-2xl font-bold text-slate-900 leading-snug">{certificate.title}</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {certificate.description}
                </p>
              </div>

              <motion.button
                onClick={handleDownload}
                whileHover={{ scale: 1.03, translateY: -2 }}
                whileTap={{ scale: 0.97 }}
                className="cartoon-outline flex items-center justify-center gap-2 rounded-xl bg-[#1c1c84] text-white px-4 py-3 font-semibold shadow-lg hover:bg-[#151560] transition-colors"
              >
                <FiDownload size={18} />
                <span>Download</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}