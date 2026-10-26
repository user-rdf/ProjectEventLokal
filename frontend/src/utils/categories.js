export const EVENT_CATEGORIES = [
  { value: 'workshop', label: 'Workshop', icon: '💻' },
  { value: 'seminar', label: 'Seminar', icon: '🎤' },
  { value: 'konser', label: 'Konser & Musik', icon: '🎵' },
  { value: 'kompetisi', label: 'Kompetisi & Lomba', icon: '🏆' },
  { value: 'seni', label: 'Pameran & Seni', icon: '🎨' },
  { value: 'kampus', label: 'Kegiatan Kampus', icon: '🎓' },
  { value: 'komunitas', label: 'Komunitas Lokal', icon: '👥' },
];

export const getCategoryLabel = (val) => {
  if (!val) return 'Umum';
  const found = EVENT_CATEGORIES.find((c) => c.value.toLowerCase() === val.toLowerCase());
  return found ? found.label : val.charAt(0).toUpperCase() + val.slice(1);
};
