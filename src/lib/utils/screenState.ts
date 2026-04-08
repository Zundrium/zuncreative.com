const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

export type ScreenState = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export function getScreenState(): ScreenState {
    if (typeof window === 'undefined') return 'lg'; // Default for SSR
    const width = window.innerWidth;

    if (width >= 1536) return '2xl';
    if (width >= 1280) return 'xl';
    if (width >= 1024) return 'lg';
    if (width >= 768) return 'md';
    return 'sm';
}
