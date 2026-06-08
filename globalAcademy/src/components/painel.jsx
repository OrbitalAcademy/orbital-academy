import { StyleSheet, Text, View } from 'react-native';
import { fonts } from '../styles/fonts';
import { useBreakpoint } from '../styles/breakpoint';

// Painel padrão das telas de operação: cabeçalho (título + ação opcional) e corpo.
export default function Painel({ titulo, direita, children, estilo, corpoEstilo }) {
  const { isMobile } = useBreakpoint();
  return (
    <View style={[estilos.painel, estilo]}>
      <View style={[estilos.painelCabecalho, isMobile && direita && estilos.painelCabecalhoMobile]}>
        <Text style={estilos.painelTitulo}>{titulo}</Text>
        {direita}
      </View>
      <View style={[estilos.painelCorpo, corpoEstilo]}>{children}</View>
    </View>
  );
}

const estilos = StyleSheet.create({
  painel: {
    backgroundColor: '#0A0F1A',
    borderWidth: 1,
    borderColor: '#ffffff0D',
    borderRadius: 16,
    overflow: 'hidden',
  },
  painelCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff0D',
  },
  painelCabecalhoMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
  },
  painelTitulo: {
    color: '#94A3B8',
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  painelCorpo: { padding: 18, gap: 16 },
});
