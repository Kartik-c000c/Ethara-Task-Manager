export const themes = [
  {
    id: 'cyan-purple',
    name: 'Cyber Cyan-Purple',
    primary: '#06b6d4',
    secondary: '#8b5cf6',
    meshPrimary: 'rgba(6, 182, 212, 0.08)',
    meshSecondary: 'rgba(139, 92, 246, 0.08)',
    meshTertiary: 'rgba(236, 72, 153, 0.05)',
  },
  {
    id: 'rose-violet',
    name: 'Hot Rose-Violet',
    primary: '#f43f5e',
    secondary: '#a78bfa',
    meshPrimary: 'rgba(244, 63, 94, 0.08)',
    meshSecondary: 'rgba(167, 139, 250, 0.08)',
    meshTertiary: 'rgba(236, 72, 153, 0.05)',
  },
  {
    id: 'emerald-teal',
    name: 'Emerald-Teal',
    primary: '#10b981',
    secondary: '#14b8a6',
    meshPrimary: 'rgba(16, 185, 129, 0.08)',
    meshSecondary: 'rgba(20, 184, 166, 0.08)',
    meshTertiary: 'rgba(6, 182, 212, 0.05)',
  },
  {
    id: 'gold-orange',
    name: 'Cyberpunk Gold-Orange',
    primary: '#f59e0b',
    secondary: '#f97316',
    meshPrimary: 'rgba(245, 158, 11, 0.08)',
    meshSecondary: 'rgba(249, 115, 22, 0.08)',
    meshTertiary: 'rgba(244, 63, 94, 0.05)',
  },
];

export const applyTheme = (themeId) => {
  const root = document.documentElement;
  const theme = themes.find((t) => t.id === themeId) || themes[0];
  
  root.style.setProperty('--neon-cyan', theme.primary);
  root.style.setProperty('--neon-purple', theme.secondary);
  root.style.setProperty('--mesh-primary', theme.meshPrimary);
  root.style.setProperty('--mesh-secondary', theme.meshSecondary);
  root.style.setProperty('--mesh-tertiary', theme.meshTertiary);
  
  localStorage.setItem('ethara_accent', theme.id);
};

export const getActiveTheme = () => {
  const stored = localStorage.getItem('ethara_accent');
  return themes.find((t) => t.id === stored) || themes[0];
};
