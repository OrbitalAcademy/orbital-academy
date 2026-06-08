import { Animated, StyleSheet, View } from 'react-native';

// Fundo espacial estático das telas de acesso (login / cadastro).
const estrelas = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  tamanho: Math.random() * 1.6 + 0.6,
  opacidade: Math.random() * 0.4 + 0.1,
}));

export default function FundoEstrelas({ opacity }) {
  return (
    <Animated.View style={[estilos.fundo, { opacity }]} pointerEvents="none">
      {estrelas.map((e) => (
        <View
          key={e.id}
          style={{
            position: 'absolute',
            top: `${e.top}%`,
            left: `${e.left}%`,
            width: e.tamanho,
            height: e.tamanho,
            borderRadius: e.tamanho / 2,
            backgroundColor: '#ffffff',
            opacity: e.opacidade,
          }}
        />
      ))}

      <View style={[estilos.linha, { top: '34%', transform: [{ rotate: '-24deg' }] }]} />
      <View style={[estilos.linha, { top: '64%', transform: [{ rotate: '18deg' }] }]} />
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  fundo: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  linha: { position: 'absolute', left: '-20%', width: '140%', height: 1, backgroundColor: '#ffffff0D' },
});
