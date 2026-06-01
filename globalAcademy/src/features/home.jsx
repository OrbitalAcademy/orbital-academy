import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../components/sidebar';

const etapas = [
  { numero: '01', rotulo: 'Ver' },
  { numero: '02', rotulo: 'Prever' },
  { numero: '03', rotulo: 'Validar' },
  { numero: '04', rotulo: 'Decidir' },
  { numero: '05', rotulo: 'Otimizar' },
  { numero: '06', rotulo: 'Agir' },
  { numero: '07', rotulo: 'Medir' },
];

const estrelas = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  tamanho: Math.random() * 2 + 1,
  duracao: Math.random() * 2000 + 1500,
  atraso: Math.random() * 3000,
}));

function Estrela({ top, left, tamanho, duracao, atraso }) {
  const animOpacidade = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const piscar = () => {
      Animated.sequence([
        Animated.timing(animOpacidade, {
          toValue: 1,
          duration: duracao,
          delay: atraso,
          useNativeDriver: true,
        }),
        Animated.timing(animOpacidade, {
          toValue: 0.15,
          duration: duracao,
          useNativeDriver: true,
        }),
      ]).start(() => piscar());
    };
    piscar();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        width: tamanho,
        height: tamanho,
        borderRadius: tamanho / 2,
        backgroundColor: '#ffffff',
        opacity: animOpacidade,
      }}
    />
  );
}

const secoes = [];

function SecaoPrincipal({ atraso = 0 }) {
  const animY = useRef(new Animated.Value(24)).current;
  const animOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animY, { toValue: 0, duration: 500, delay: atraso, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(animOp, { toValue: 1, duration: 500, delay: atraso, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[estilos.secaoPrincipal, { opacity: animOp, transform: [{ translateY: animY }] }]}>
      <View style={estilos.secaoPrincipalTopo}>
        <Text style={estilos.secaoPrincipalId}>01</Text>
        <Text style={estilos.secaoPrincipalRotulo}>RESUMO EXECUTIVO</Text>
      </View>

      <Text style={estilos.secaoPrincipalTitulo}>O que é o Orbital Academy?</Text>

      <Text style={estilos.secaoPrincipalTexto}>
        O Orbital Academy combina dado aberto de satélite (NASA, INPE, Copernicus), um modelo de
        ML que prevê risco e um motor de otimização que decide como alocar recursos limitados.{'\n\n'}
        É uma plataforma que transforma dado espacial em decisão real — onde você opera uma missão
        de verdade: o satélite, o modelo, o otimizador. Tudo junto, tudo conectado.
      </Text>

      <View style={estilos.secaoPrincipalGrade}>
        {[
          { rotulo: 'Fonte de dados', valor: 'NASA Earthdata · INPE · Copernicus' },
          { rotulo: 'Tecnologia', valor: 'ML + Otimização' },
          { rotulo: 'Missão ativa', valor: 'Agro · Defesa Civil · Saúde' },
          { rotulo: 'Etapas', valor: 'Ver → Prever → Validar → Decidir → Medir' },
        ].map((item) => (
          <View key={item.rotulo} style={estilos.gradeItem}>
            <Text style={estilos.gradeRotulo}>{item.rotulo}</Text>
            <Text style={estilos.gradeValor}>{item.valor}</Text>
          </View>
        ))}
      </View>

      <View style={estilos.tagsRow}>
        {['NASA Earthdata', 'INPE', 'ML + Otimização', 'Copernicus', 'Decisão espacial'].map((tag) => (
          <View key={tag} style={estilos.tag}>
            <Text style={estilos.tagTexto}>{tag}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

function SecaoAccordion({ id, rotulo, titulo, texto, tags, atraso = 0 }) {
  const [aberta, setAberta] = useState(false);
  const animAltura = useRef(new Animated.Value(0)).current;
  const animOpacidade = useRef(new Animated.Value(0)).current;
  const animEntrada = useRef(new Animated.Value(20)).current;
  const animEntradaOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animEntrada, { toValue: 0, duration: 400, delay: atraso, useNativeDriver: true }),
      Animated.timing(animEntradaOp, { toValue: 1, duration: 400, delay: atraso, useNativeDriver: true }),
    ]).start();
  }, []);

  function alternar() {
    const abrindo = !aberta;
    setAberta(abrindo);
    Animated.parallel([
      Animated.timing(animAltura, {
        toValue: abrindo ? 1 : 0,
        duration: 380,
        easing: abrindo ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(animOpacidade, {
        toValue: abrindo ? 1 : 0,
        duration: abrindo ? 320 : 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  }

  const alturaConteudo = animAltura.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tags.length > 0 ? 160 : 110],
  });

  return (
    <Animated.View
      style={[
        estilos.secaoItem,
        aberta && estilos.secaoItemAberta,
        { opacity: animEntradaOp, transform: [{ translateY: animEntrada }] },
      ]}
    >
      <Pressable style={estilos.secaoCabecalho} onPress={alternar}>
        <View style={estilos.secaoEsquerda}>
          <Text style={estilos.secaoId}>{id}</Text>
          <Text style={estilos.secaoRotulo}>{rotulo}</Text>
        </View>
        <Text style={[estilos.secaoTitulo]}>{titulo}</Text>
        <Ionicons
          name={aberta ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={16}
          color="#475569"
          style={{ marginLeft: 12 }}
        />
      </Pressable>

      <Animated.View style={{ height: alturaConteudo, overflow: 'hidden' }}>
        <Animated.View style={[estilos.secaoCorpo, { opacity: animOpacidade }]}>
          <Text style={estilos.secaoTexto}>{texto}</Text>
          {tags.length > 0 && (
            <View style={estilos.tagsRow}>
              {tags.map((tag) => (
                <View key={tag} style={estilos.tag}>
                  <Text style={estilos.tagTexto}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

function SetaScroll({ aoClicar }) {
  const animY = useRef(new Animated.Value(0)).current;
  const animOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animOp, {
      toValue: 1,
      duration: 600,
      delay: 900,
      useNativeDriver: true,
    }).start();

    const bounce = () => {
      Animated.sequence([
        Animated.timing(animY, { toValue: 8, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(animY, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]).start(() => bounce());
    };
    setTimeout(bounce, 900);
  }, []);

  return (
    <Animated.View style={[estilos.setaContainer, { opacity: animOp, transform: [{ translateY: animY }] }]}>
      <Pressable onPress={aoClicar} hitSlop={16}>
        <Ionicons name="chevron-down-outline" size={22} color="#475569" />
      </Pressable>
    </Animated.View>
  );
}

function ItemEtapa({ numero, rotulo, atraso = 0 }) {
  const animY = useRef(new Animated.Value(16)).current;
  const animOpacidade = useRef(new Animated.Value(0)).current;
  const animBrilho = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animY, { toValue: 0, duration: 400, delay: atraso, useNativeDriver: true }),
      Animated.timing(animOpacidade, { toValue: 1, duration: 400, delay: atraso, useNativeDriver: true }),
    ]).start();
  }, []);

  function aoEntrar() {
    Animated.timing(animBrilho, { toValue: 1, duration: 180, useNativeDriver: false }).start();
  }
  function aoSair() {
    Animated.timing(animBrilho, { toValue: 0, duration: 180, useNativeDriver: false }).start();
  }

  const corBorda = animBrilho.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff20', '#208AEF90'],
  });
  const corFundo = animBrilho.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', '#208AEF15'],
  });

  const hoverProps =
    Platform.OS === 'web'
      ? { onMouseEnter: aoEntrar, onMouseLeave: aoSair }
      : { onPressIn: aoEntrar, onPressOut: aoSair };

  return (
    <Animated.View style={{ opacity: animOpacidade, transform: [{ translateY: animY }] }}>
      <Animated.View
        style={[estilos.etapa, { borderColor: corBorda, backgroundColor: corFundo }]}
        {...hoverProps}
      >
        <Text style={estilos.etapaNumero}>{numero}</Text>
        <Text style={estilos.etapaRotulo}>{rotulo}</Text>
      </Animated.View>
    </Animated.View>
  );
}

export default function Home() {
  const [ativo, setAtivo] = useState('home');
  const { width, height } = useWindowDimensions();
  const eMobile = width < 768;
  const mostrarHome = ativo === 'home';
  const scrollRef = useRef(null);

  return (
    <View style={estilos.container}>
      {!eMobile && (
        <Sidebar ativo={ativo} aoSelecionar={setAtivo} />
      )}

      <View style={estilos.conteudo}>
        {/* Fundo espacial */}
        <View style={estilos.fundoEspacial} pointerEvents="none">
          {estrelas.map((e) => (
            <Estrela key={e.id} {...e} />
          ))}
        </View>

        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <View style={estilos.cabecalhoEsquerda}>
            <View style={estilos.badgePill}>
              <View style={estilos.badgePonto} />
              <Text style={estilos.badgeTexto}>Global Solution FIAP · Space Connect · 2026.1</Text>
            </View>
          </View>
          <Pressable style={estilos.botaoEntrar}>
            <Text style={estilos.botaoEntrarTexto}>Entrar →</Text>
          </Pressable>
        </View>

        {mostrarHome ? (
          <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

            {/* Hero — ocupa 100% da tela */}
            <View style={[estilos.hero, { minHeight: height }]}>
              <Text style={[estilos.titulo, eMobile && estilos.tituloMobile]}>
                Operar é aprender.{'\n'}Decidir é o impacto.
              </Text>

              <Text style={[estilos.subtitulo, eMobile && estilos.subtituloMobile]}>
                O Orbital Academy é uma plataforma que ensina qualquer pessoa a
                transformar dado espacial em decisão real!
              </Text>

              <View style={[estilos.barraEtapas, eMobile && estilos.barraEtapasMobile]}>
                {etapas.map((etapa, indice) => (
                  <View key={etapa.numero} style={estilos.etapaGrupo}>
                    <ItemEtapa numero={etapa.numero} rotulo={etapa.rotulo} atraso={indice * 80} />
                    {indice < etapas.length - 1 && (
                      <Text style={estilos.etapaSeta}>→</Text>
                    )}
                  </View>
                ))}
              </View>

              <SetaScroll aoClicar={() => scrollRef.current?.scrollTo({ y: height, animated: true })} />
            </View>

            {/* Seções — abaixo do fold */}
            <View style={[estilos.accordion, eMobile && estilos.accordionMobile]}>
              <SecaoPrincipal atraso={0} />
              {secoes.map((s, i) => (
                <SecaoAccordion key={s.id} {...s} atraso={80 + i * 80} />
              ))}
            </View>

          </ScrollView>
        ) : (
          <View style={estilos.telaVazia}>
            <Text style={estilos.telaVaziaTexto}>{ativo}</Text>
          </View>
        )}
      </View>

    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#050810',
  },
  conteudo: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },

  // Fundo espacial
  fundoEspacial: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  arcoWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 320,
    alignItems: 'center',
    overflow: 'hidden',
  },

  // Cabeçalho
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    zIndex: 10,
  },
  cabecalhoEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  botaoAbrirSidebar: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffffff15',
  },
  botaoAbrirTexto: {
    color: '#64748B',
    fontSize: 16,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#ffffff20',
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  badgePonto: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#208AEF',
  },
  badgeTexto: {
    color: '#94A3B8',
    fontSize: 12,
  },
  botaoEntrar: {
    borderWidth: 1,
    borderColor: '#ffffff30',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  botaoEntrarTexto: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '500',
  },

  // Hero
  hero: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
    zIndex: 5,
  },
  badgePillCentral: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#ffffff20',
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 32,
  },
  titulo: {
    color: '#F8FAFC',
    fontSize: 56,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 64,
    letterSpacing: -1,
    marginBottom: 24,
  },
  tituloMobile: {
    fontSize: 36,
    lineHeight: 44,
  },
  subtitulo: {
    color: '#64748B',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 540,
    marginBottom: 60,
  },
  subtituloMobile: {
    fontSize: 14,
  },

  // Etapas — sem container/borda
  barraEtapas: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  barraEtapasMobile: {
    gap: 2,
  },
  etapaGrupo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  etapa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  etapaNumero: {
    color: '#475569',
    fontSize: 11,
  },
  etapaRotulo: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },
  etapaSeta: {
    color: '#334155',
    fontSize: 12,
  },

  // Seta scroll
  setaContainer: {
    marginTop: 16,
    alignItems: 'center',
  },

  // Seção principal (01)
  secaoPrincipal: {
    borderWidth: 1,
    borderColor: '#208AEF20',
    borderRadius: 14,
    backgroundColor: '#0D1420',
    padding: 28,
    gap: 20,
  },
  secaoPrincipalTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  secaoPrincipalId: {
    color: '#208AEF',
    fontSize: 11,
    fontWeight: '700',
  },
  secaoPrincipalRotulo: {
    color: '#334155',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  secaoPrincipalTitulo: {
    color: '#F1F5F9',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
  },
  secaoPrincipalTexto: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 24,
  },
  secaoPrincipalGrade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  gradeItem: {
    flex: 1,
    minWidth: 180,
    gap: 4,
    borderLeftWidth: 2,
    borderLeftColor: '#208AEF40',
    paddingLeft: 12,
  },
  gradeRotulo: {
    color: '#334155',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  gradeValor: {
    color: '#94A3B8',
    fontSize: 13,
  },

  // Accordion
  accordion: {
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    gap: 6,
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  accordionMobile: {
    paddingHorizontal: 16,
  },
  secaoItem: {
    borderWidth: 1,
    borderColor: '#ffffff0D',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#0D1117',
  },
  secaoItemAberta: {
    borderColor: '#208AEF20',
    backgroundColor: '#0D1420',
  },
  secaoCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 24,
    gap: 14,
  },
  secaoEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 170,
  },
  secaoId: {
    color: '#208AEF',
    fontSize: 11,
    fontWeight: '700',
  },
  secaoRotulo: {
    color: '#334155',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  secaoTitulo: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '600',
  },
  secaoCorpo: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 4,
    gap: 18,
  },
  secaoTexto: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 24,
    maxWidth: 580,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#ffffff12',
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff05',
  },
  tagTexto: {
    color: '#94A3B8',
    fontSize: 12,
  },

  // Tela vazia
  telaVazia: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  telaVaziaTexto: {
    color: '#334155',
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
