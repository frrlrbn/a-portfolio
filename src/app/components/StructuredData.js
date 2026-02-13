'use client';

export default function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Azelin Azzahra",
    "jobTitle": "Industrial Automation Engineering Student",
    "description": "Industrial Automation Engineering student at SMK Negeri 2 Depok Sleman, specializing in robotics, PLC programming, AutoCAD design, and creative innovation.",
    "url": "https://azelin.my.id",
    "image": "https://azelin.my.id/images/profile-foreground.png",
    "sameAs": [
      "https://instagram.com/azelyneazr",
      "https://instagram.com/designsocietyy",
      "https://www.linkedin.com/in/azelin-azzahra-6bba45333/",
      "https://www.tiktok.com/@azelyneazz",
      "https://www.tiktok.com/@designsocietyy"
    ],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "SMK Negeri 2 Depok Sleman"
    },
    "knowsAbout": [
      "Industrial Automation",
      "Robotics",
      "PLC Programming",
      "AutoCAD Design",
      "Microcontroller Programming",
      "C++ Programming",
      "Arduino",
      "Pneumatic Systems",
      "Graphic Design",
      "Content Creation"
    ],
    "award": [
      "Finalis ICT Business Development 2024",
      "Peserta Terbaik Bhineka Competition 2022",
      "50 Terbaik AENS National Competition Vol.2 2022",
      "Juara 3 Lomba Tilawah Festival Anak Sholeh Indonesia 2019"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Azelin Azzahra Portfolio",
    "url": "https://azelin.my.id",
    "description": "Industrial Automation Engineering student portfolio showcasing projects, skills, and achievements in robotics and design.",
    "author": {
      "@type": "Person",
      "name": "Azelin Azzahra"
    },
    "inLanguage": "en-US"
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "dateCreated": "2024-01-01",
    "dateModified": new Date().toISOString(),
    "mainEntity": {
      "@type": "Person",
      "name": "Azelin Azzahra",
      "description": "Industrial Automation Engineering student specializing in robotics and design"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
    </>
  );
}
