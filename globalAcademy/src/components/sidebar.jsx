import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useBreakpoint } from '../styles/breakpoint';

const LARGURA_FECHADA = 56;
const LARGURA_ABERTA = 240;
const LARGURA_DRAWER = 280;

const secoes = [
  {
    rotulo: 'OPERAÇÃO',
    itens: [
      { chave: 'console', icone: 'terminal-outline', titulo: 'Console', subtitulo: 'Mapa + ranking', badge: 3 },
      { chave: 'missao', icone: 'settings-outline', titulo: 'Missão', subtitulo: 'Detalhe + otimizar' },
      { chave: 'camera', icone: 'camera-outline', titulo: 'Câmera', subtitulo: 'Validação campo' },
      { chave: 'indicadores', icone: 'trending-up-outline', titulo: 'Indicadores', subtitulo: 'Impacto + métricas' },
    ],
  },
  {
    rotulo: 'CONTEÚDO',
    itens: [
      { chave: 'espacoteca', icone: 'library-outline', titulo: 'Espaçoteca', subtitulo: 'Glossário · APIs' },
    ],
  },
];

export default function Sidebar({ ativo = 'home', aoSelecionar, aberto = false, aoFechar }) {
  const { isMobile } = useBreakpoint();

  // Desktop: largura/opacidade animadas no hover.
  const animLargura = useRef(new Animated.Value(LARGURA_FECHADA)).current;
  const animOpacidade = useRef(new Animated.Value(0)).current;
  // Mobile: drawer deslizante controlado por `aberto`.
  const animTranslate = useRef(new Animated.Value(-LARGURA_DRAWER)).current;

  useEffect(() => {
    if (!isMobile) return;
    Animated.timing(animTranslate, {
      toValue: aberto ? 0 : -LARGURA_DRAWER,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isMobile, aberto]);

  function aoEntrar() {
    Animated.parallel([
      Animated.timing(animLargura, {
        toValue: LARGURA_ABERTA,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(animOpacidade, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  }

  function aoSair() {
    Animated.parallel([
      Animated.timing(animLargura, {
        toValue: LARGURA_FECHADA,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(animOpacidade, {
        toValue: 0,
        duration: 140,
        useNativeDriver: false,
      }),
    ]).start();
  }

  // No mobile o texto fica sempre visível; no desktop segue a opacidade do hover.
  const opacidadeTexto = isMobile ? 1 : animOpacidade;

  // Seleciona um item e, no mobile, fecha o drawer em seguida.
  function selecionar(chave) {
    aoSelecionar?.(chave);
    if (isMobile) aoFechar?.();
  }

  const containerProps = isMobile
    ? {
        style: [estilos.container, estilos.drawer, { transform: [{ translateX: animTranslate }] }],
        pointerEvents: aberto ? 'auto' : 'none',
      }
    : {
        style: [estilos.container, { width: animLargura }],
        onMouseEnter: aoEntrar,
        onMouseLeave: aoSair,
      };

  return (
    <Animated.View {...containerProps}>
      {/* Cabeçalho */}
      <Pressable style={estilos.linha} onPress={() => selecionar('home')}>
        <View style={estilos.iconeSlot}>
          <View style={estilos.logoCirculo}>
            <View style={estilos.logoPonto} />
          </View>
        </View>
        <Animated.View style={[estilos.textoSlot, { opacity: opacidadeTexto }]}>
          <Text style={estilos.cabecalhoNome} numberOfLines={1}>Orbital Academy</Text>
          <Text style={estilos.cabecalhoSub} numberOfLines={1}>Engenharia de Software · 3º sem</Text>
          <View style={estilos.statusBadge}>
            <View style={estilos.statusPonto} />
            <Text style={estilos.statusTexto} numberOfLines={1}>Missão Agro · ativa</Text>
          </View>
        </Animated.View>
      </Pressable>

      <View style={estilos.divisor} />

      {/* Navegação */}
      <View style={estilos.nav}>
        {secoes.map((secao) => (
          <View key={secao.rotulo} style={estilos.secao}>

            {/* Rótulo da seção — alinhado com os textos */}
            <Animated.View style={[estilos.secaoRotuloRow, { opacity: opacidadeTexto }]}>
              <View style={estilos.iconeSlot} />
              <Text style={estilos.secaoRotulo}>{secao.rotulo}</Text>
            </Animated.View>

            {secao.itens.map((item) => {
              const estaAtivo = item.chave === ativo;
              return (
                <Pressable
                  key={item.chave}
                  onPress={() => selecionar(item.chave)}
                  style={({ pressed }) => [
                    estilos.linha,
                    estilos.linhaNave,
                    estaAtivo && estilos.linhaAtiva,
                    pressed && estilos.linhaPressed,
                  ]}
                >
                  {estaAtivo && <View style={estilos.bordaAtiva} />}

                  {/* Ícone — sempre visível */}
                  <View style={estilos.iconeSlot}>
                    <View style={[estilos.iconeContainer, estaAtivo && estilos.iconeContainerAtivo]}>
                      <Ionicons
                        name={item.icone}
                        size={17}
                        color={estaAtivo ? '#208AEF' : '#64748B'}
                      />
                    </View>
                  </View>

                  {/* Texto — aparece no hover */}
                  <Animated.View style={[estilos.textoSlot, { opacity: opacidadeTexto }]}>
                    <Text style={[estilos.itemTitulo, estaAtivo && estilos.itemTituloAtivo]} numberOfLines={1}>
                      {item.titulo}
                    </Text>
                    <Text style={estilos.itemSubtitulo} numberOfLines={1}>{item.subtitulo}</Text>
                  </Animated.View>

                  {item.badge != null && (
                    <Animated.View style={[estilos.badge, { opacity: opacidadeTexto }]}>
                      <Text style={estilos.badgeTexto}>{item.badge}</Text>
                    </Animated.View>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* Rodapé */}
      <View style={estilos.rodape}>
        <View style={estilos.divisor} />
        <Pressable style={estilos.linha}>
          <View style={estilos.iconeSlot}>
            <Ionicons name="log-in-outline" size={18} color="#64748B" />
          </View>
          <Animated.View style={[estilos.textoSlot, { opacity: opacidadeTexto }]}>
            <Text style={estilos.loginTitulo} numberOfLines={1}>Faça login</Text>
            <Text style={estilos.loginSub} numberOfLines={1}>Para acessar sua conta</Text>
          </Animated.View>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  container: {
    backgroundColor: '#0A0A0A',
    borderRightWidth: 1,
    borderRightColor: '#ffffff0D',
    overflow: 'hidden',
    flexDirection: 'column',
  },
  // Variante mobile: overlay deslizante por cima do conteúdo.
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: LARGURA_DRAWER,
    zIndex: 50,
  },

  // Layout de linha: ícone fixo + texto animado
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    position: 'relative',
  },
  linhaNave: {
    paddingVertical: 7,
  },
  linhaAtiva: {
    backgroundColor: '#ffffff08',
  },
  linhaPressed: {
    backgroundColor: '#ffffff05',
  },
  bordaAtiva: {
    position: 'absolute',
    left: 0,
    top: 4,
    bottom: 4,
    width: 3,
    borderRadius: 2,
    backgroundColor: '#208AEF',
  },

  // Slot do ícone — largura fixa para alinhar sempre
  iconeSlot: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginRight: 10,
  },

  // Slot do texto — ocupa o restante
  textoSlot: {
    flex: 1,
    gap: 1,
    overflow: 'hidden',
  },

  // Logo
  logoCirculo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPonto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
  },

  // Cabeçalho
  cabecalhoNome: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '700',
  },
  cabecalhoSub: {
    color: '#64748B',
    fontSize: 11,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  statusPonto: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  statusTexto: {
    color: '#64748B',
    fontSize: 11,
  },

  // Divisor
  divisor: {
    height: 1,
    backgroundColor: '#ffffff0D',
  },

  // Navegação
  nav: {
    flex: 1,
    paddingTop: 4,
    gap: 12,
  },
  secao: { gap: 2 },
  secaoRotuloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  secaoRotulo: {
    color: '#334155',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
  },

  // Ícone container
  iconeContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffffff10',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff05',
  },
  iconeContainerAtivo: {
    borderColor: '#208AEF30',
    backgroundColor: '#208AEF10',
  },

  // Texto dos itens
  itemTitulo: { color: '#94A3B8', fontSize: 13, fontWeight: '500' },
  itemTituloAtivo: { color: '#F1F5F9', fontWeight: '600' },
  itemSubtitulo: { color: '#334155', fontSize: 11 },

  // Badge
  badge: {
    backgroundColor: '#1E293B',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#ffffff10',
    marginLeft: 4,
  },
  badgeTexto: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },

  // Rodapé
  rodape: {},
  loginTitulo: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  loginSub: { color: '#334155', fontSize: 11 },
});
