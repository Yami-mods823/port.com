'use client';

import { motion } from 'framer-motion';
import { FaEnvelope, FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import SectionHeading from '@/components/ui/SectionHeading';
import MagneticButton from '@/components/ui/MagneticButton';
import SocialIcons from '@/components/ui/SocialIcons';
import { SocialLinkDTO } from '@/types';

export default function Contact({
  email,
  phone,
  social,
}: {
  email: string;
  phone: string;
  social: SocialLinkDTO[];
}) {
  const digits = phone.replace(/\D/g, '');
  const whatsappNumber = digits.startsWith('92') ? digits : `92${digits.replace(/^0/, '')}`;

  return (
    <section id="contact" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-5xl px-6 md:px-12 text-center">
        <SectionHeading index="05" label="Let's talk" title="Contact" align="center" />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto text-bone-dim mb-12"
        >
          Have a project in mind — an AI video, a Claymation piece, or a web application? Reach out.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-14"
        >
          <MagneticButton href={`mailto:${email}`}>
            <FaEnvelope /> Email Me
          </MagneticButton>
          <MagneticButton href={`https://wa.me/${whatsappNumber}`} variant="outline">
            <FaWhatsapp /> WhatsApp
          </MagneticButton>
          <MagneticButton href={`tel:${phone}`} variant="outline">
            <FaPhoneAlt /> Call
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="text-sm text-bone-faint space-x-4">
            <span>{email}</span>
            <span className="text-bone/20">•</span>
            <span>{phone}</span>
          </div>
          <SocialIcons social={social} />
        </motion.div>
      </div>
    </section>
  );
}
