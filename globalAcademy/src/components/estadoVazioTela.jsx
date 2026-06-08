import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../styles/fonts';

// Estado vazio de tela inteira (usado no conteúdo deslogado das páginas da sidebar).
export default function EstadoVazioTela({ icone, titulo, sub }) {
  return (
    <View style={estilos.area}>
      <View style={estilos.caixa}>
        <Ionicons name={icone} size={34} color="#334155" />
        <Text style={estilos.titulo}>{titulo}</Text>
        {sub ? <Text style={estilos.sub}>{sub}</Text> : null}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  area: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  caixa: { maxWidth: 400, alignItems: 'center', gap: 12 },
  titulo: { color: '#94A3B8', fontSize: 16, fontFamily: fonts.bodySemiBold, textAlign: 'center' },
  sub: { color: '#64748B', fontSize: 13, fontFamily: fonts.body, textAlign: 'center', lineHeight: 20 },
});
