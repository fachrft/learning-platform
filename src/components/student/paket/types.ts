import {
  BookOpen,
  Video,
  Award,
  MessageCircle,
  Clock,
  Shield,
} from "lucide-react";

export type PlanId = "free" | "monthly" | "yearly";

export interface Plan {
  id: PlanId;
  label: string;
  sublabel: string;
  price: string;
  priceNote: string;
  badge?: string;
  features: { label: string; included: boolean }[];
  cta: string;
  isPrimary: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    label: "Gratis",
    sublabel: "Untuk pemula yang baru mulai",
    price: "Rp 0",
    priceNote: "Selamanya gratis",
    features: [
      { label: "Akses kursus gratis", included: true },
      { label: "Materi teks & artikel", included: true },
      { label: "Progress tracking", included: true },
      { label: "Kursus premium", included: false },
      { label: "Video materi HD", included: false },
      { label: "Sertifikat kelulusan", included: false },
      { label: "Priority support 24/7", included: false },
    ],
    cta: "Paket Gratis",
    isPrimary: false,
  },
  {
    id: "monthly",
    label: "Bulanan",
    sublabel: "Fleksibel, bayar per bulan",
    price: "Rp 99.000",
    priceNote: "per bulan • ditagih bulanan",
    features: [
      { label: "Akses kursus gratis", included: true },
      { label: "Materi teks & artikel", included: true },
      { label: "Progress tracking", included: true },
      { label: "Semua kursus premium", included: true },
      { label: "Video materi HD", included: true },
      { label: "Sertifikat kelulusan", included: true },
      { label: "Priority support 24/7", included: false },
    ],
    cta: "Pilih Bulanan",
    isPrimary: false,
  },
  {
    id: "yearly",
    label: "Tahunan",
    sublabel: "Nilai terbaik, hemat lebih banyak",
    price: "Rp 66.583",
    priceNote: "per bulan • ditagih Rp 799.000/tahun",
    badge: "HEMAT 33%",
    features: [
      { label: "Akses kursus gratis", included: true },
      { label: "Materi teks & artikel", included: true },
      { label: "Progress tracking", included: true },
      { label: "Semua kursus premium", included: true },
      { label: "Video materi HD", included: true },
      { label: "Sertifikat kelulusan", included: true },
      { label: "Priority support 24/7", included: true },
    ],
    cta: "Pilih Tahunan",
    isPrimary: true,
  },
];

export const HIGHLIGHTS = [
  {
    icon: BookOpen,
    title: "30+ Kursus Premium",
    desc: "Materi dari praktisi industri terbaik",
  },
  {
    icon: Video,
    title: "Video HD",
    desc: "Belajar lebih mudah dengan video resolusi tinggi",
  },
  {
    icon: Award,
    title: "Sertifikat Resmi",
    desc: "Bukti keahlian yang diakui industri",
  },
  {
    icon: MessageCircle,
    title: "Komunitas Eksklusif",
    desc: "Terhubung dengan ribuan pelajar aktif",
  },
  {
    icon: Clock,
    title: "Belajar Kapan Saja",
    desc: "Akses 24/7 dari perangkat apa pun",
  },
  {
    icon: Shield,
    title: "Garansi 7 Hari",
    desc: "Tidak puas? Uang kembali tanpa syarat",
  },
];
