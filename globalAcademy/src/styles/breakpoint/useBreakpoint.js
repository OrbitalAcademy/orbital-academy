import { useWindowDimensions } from 'react-native';
import { BREAKPOINTS, getBreakpoint } from './breakpoints';

export function useBreakpoint() {
  const { width, height } = useWindowDimensions();
  const breakpoint = getBreakpoint(width);
  return {
    width,
    height,
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isDesktop: breakpoint === 'desktop',
  };
}

export { BREAKPOINTS };
