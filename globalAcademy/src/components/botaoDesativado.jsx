import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts } from '../styles/fonts';

export default function BotaoDesativado({
  children,
  estilo,
  estiloWrap,
  texto = 'Botão desativado no momento',
  posicao = 'cima',
}) {
  const [visivel, setVisivel] = useState(false);

  const hover =
    Platform.OS === 'web'
      ? { onHoverIn: () => setVisivel(true), onHoverOut: () => setVisivel(false) }
      : {};

  return (
    <View style={[estilos.wrap, estiloWrap]}>
      <Pressable
        style={[estilo, estilos.desativado, Platform.OS === 'web' && { cursor: 'not-allowed' }]}
        onPress={() => setVisivel((v) => !v)}
        {...hover}
      >
        {children}
      </Pressable>

      {visivel ? (
        <View
          pointerEvents="none"
          style={[estilos.tooltip, posicao === 'cima' ? estilos.tooltipCima : estilos.tooltipBaixo]}
        >
          <Text style={estilos.tooltipTexto}>{texto}</Text>
        </View>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  desativado: {
    opacity: 0.5,
  },
  tooltip: {
    position: 'absolute',
    left: 0,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffffff15',
    backgroundColor: '#0D1117',
    zIndex: 20,
  },
  tooltipCima: {
    bottom: '110%',
  },
  tooltipBaixo: {
    top: '110%',
  },
  tooltipTexto: {
    color: '#F59E0B',
    fontSize: 12,
    fontFamily: fonts.bodySemiBold,
    whiteSpace: 'nowrap',
  },
});
