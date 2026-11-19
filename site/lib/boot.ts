export const THEME_KEY = 'guide-theme';
export const DEPTH_KEY = 'guide-depth';

/**
 * Inline <head> script, runs before first paint (no flash, no layout shift):
 * applies a saved theme override (otherwise CSS follows the browser's light/dark setting) and the saved depth.
 */
export const bootScript = `try{var t=localStorage.getItem('${THEME_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;var d=localStorage.getItem('${DEPTH_KEY}');if(d==='short'||d==='mid'||d==='detailed')document.documentElement.dataset.depth=d}catch(e){}`;
