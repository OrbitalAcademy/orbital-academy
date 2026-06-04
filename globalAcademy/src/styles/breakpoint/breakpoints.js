// Limites de breakpoint, em px.
// Hoje há uma faixa única de corte: < desktop = mobile, >= desktop = desktop.
// Para introduzir tablet no futuro, basta adicionar uma chave intermediária
// (ex.: tablet: 768) e tratá-la em getBreakpoint sem quebrar a API do hook.
export const BREAKPOINTS = {
  mobile: 0,
  desktop: 1024,
};

export function getBreakpoint(width) {
  return width >= BREAKPOINTS.desktop ? 'desktop' : 'mobile';
}
