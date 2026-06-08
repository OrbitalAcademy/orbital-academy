import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../styles/fonts';

// Campo de formulário das telas de acesso, com rótulo, ícone e olho de senha.
export default function CampoFormulario({
  rotulo,
  icone,
  valor,
  aoMudar,
  placeholder,
  teclado,
  senha = false,
  autoCapitalize = 'none',
}) {
  const [focado, setFocado] = useState(false);
  const [mostrar, setMostrar] = useState(false);

  return (
    <View style={estilos.campo}>
      <Text style={estilos.campoRotulo}>{rotulo}</Text>
      <View style={[estilos.campoCaixa, focado && estilos.campoCaixaFocado]}>
        <Ionicons name={icone} size={17} color={focado ? '#38BDF8' : '#64748B'} />
        <TextInput
          value={valor}
          onChangeText={aoMudar}
          placeholder={placeholder}
          placeholderTextColor="#475569"
          keyboardType={teclado}
          autoCapitalize={senha ? 'none' : autoCapitalize}
          secureTextEntry={senha && !mostrar}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          style={estilos.campoInput}
        />
        {senha && (
          <Pressable onPress={() => setMostrar((v) => !v)} hitSlop={8}>
            <Ionicons name={mostrar ? 'eye-off-outline' : 'eye-outline'} size={17} color="#64748B" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  campo: { gap: 8 },
  campoRotulo: { color: '#94A3B8', fontSize: 13, fontFamily: fonts.bodySemiBold },
  campoCaixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffffff15',
    backgroundColor: '#0A0F1A',
  },
  campoCaixaFocado: { borderColor: '#38BDF8', backgroundColor: '#0D1117' },
  campoInput: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 14,
    fontFamily: fonts.body,
    outlineStyle: 'none',
  },
});
