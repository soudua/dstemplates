import type { Template } from '../types';




export const templates: Template[] = [
  {
    id: 'ivory-promise',
    name: 'Ivory Promise',
    category: 'weddings',
    description: 'A beautifully designed, fashion-inspired wedding website template that blends elegance, style, and timeless romance for a stunning guest experience.',
    longDescription:
      'Velvet Vows is crafted for couples who want their digital presence to feel as carefully considered as their ceremony. Moody palettes, full-bleed photography, and a timeline section that tells your story without feeling like a checklist. Includes RSVP form, venue map embed, registry links, and a password-protected guest area.',
    previewVideo: '/weedingwebsite1.mp4',
    images: [
      '/1.png',
      '/2.png',
      '/3.png',
      '/4.png',
    ],
    price: 29,
    features: [
      'Photo gallery with lightbox',
      'Countdown timer',
      'Mobile-first responsive design',
      'clean animation'
    ],
    techStack: ['React', 'Tailwind CSS', 'Framer Motion', 'EmailJS'],
  },
  {
    id: 'the-green-envelope',
    name: 'The Green Envelope',
    category: 'weddings',
    description: 'A chic, fashion-forward wedding website template crafted with elegant details and a beautiful, modern aesthetic to perfectly showcase your special day.',
    longDescription:
      'Golden Arch is built for fine-dining establishments and modern bistros that refuse to settle for generic. A hero section built around your signature dish, an interactive menu with category tabs, reservation widget, chef profile, and press mentions section. The warm amber palette adapts effortlessly to your brand colors.',
    previewVideo: '/8V.mp4',
    images: [
      '/5.png',
      '/6.png',
      '/7.png',
      '/8.png',
    ],
    price: 29,
    features: [
      'Photo gallery with lightbox',
      'Countdown timer',
      'Mobile-first responsive design',
      'clean animation'
    ],
    techStack: ['React', 'Tailwind CSS', 'Framer Motion', 'Google Maps API'],
  },
  {
    id: 'good-food-resturant',
    name: 'Good Food Resturant',
    category: 'restaurant',
    description: 'A stylish, beautifully designed restaurant website template that captures a modern dining experience with elegant visuals and a tasteful, food-focused aesthetic.',
    longDescription:
      'Bloom Union channels the mood of a Sunday morning in a walled garden. Layered floral illustrations, script display type, and a pastel-over-dark palette that photographs beautifully on every device. Includes a multi-day event schedule, accommodation guide for guests, and a custom gift tracker.',
    previewVideo: '/9V.mp4',
    images: [
      '/10.png',
      '/11.png',
      '/12.png',
      '/14.png',
    ],
    price: 39,
    features: [
      'Easy build in photos menu',
      'Clean animation',
      'Categories',

    ],
    techStack: ['React', 'Tailwind CSS', 'Framer Motion', 'Airtable'],
  },
  {
    id: 'professional-cv',
    name: 'Professional Cv',
    category: 'cv',
    description: 'A inpressive and organise way to show your skills, strenghts and apititute for the applying job.',
    longDescription:
      'A modern, visually striking CV template designed to showcase skills, experience, achievements with maximum impact with a build in clean animation, one beeing the carousel.',
    previewVideo: '/v14.mp4',
    images: [
      '/17.png',
      '/15.png',
      '/16.png',
      '/18.png',
    ],
    price: 29,
    features: [
      'Build in to show strenghts and abilitys',
      'Photo display circle',
      'Contacts',
      'Carrossel animation',
      'Clean animation',
    ],
    techStack: ['Javascript', 'HTML', 'CSS'],
  },
  
];

export const categoryLabels: Record<string, string> = {
  all: 'All Templates',
  weddings: 'Weddings',
  restaurant: 'Restaurant',
  cv: 'Cv',
};
