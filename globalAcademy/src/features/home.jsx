import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../components/sidebar';
import { fonts } from '../styles/fonts';
import { useBreakpoint } from '../styles/breakpoint';

const imgParallax = require('../../assets/nasa-Q1p7bh3SHj8-unsplash.jpg');
const imgPersonas = require('../../assets/premium_photo-1679756099079-84d8ab833a3f.avif');

const personasData = [
  {
    id: 'produtor',
    rotulo: 'Persona 01',
    titulo: 'Pequeno produtor rural',
    descricao: 'Vê a lavoura do chão, não do céu. Sabe que tem um problema mas não sabe em qual área agir primeiro com os recursos que tem. \n\nO satélite está disponível, mas o caminho entre o dado e a ação ainda é longo demais para quem não é especialista.',
  },
  {
    id: 'defesa',
    rotulo: 'Persona 02',
    titulo: 'Equipe da Defesa Civil municipal',
    descricao: 'Precisa priorizar risco com equipe e tempo contados. Um município pequeno não tem analista de dados espaciais. \n\nE sim um gestor que precisa decidir em minutos onde mandar a equipe e o equipamento disponível.',
  },
  {
    id: 'saude',
    rotulo: 'Persona 03',
    titulo: 'Agente de saúde em campo',
    descricao: 'Decide rotas e recursos onde o dado raramente chega. O acompanhamento de áreas de risco hídrico ou vetorial por satélite poderia guiar a priorização! \n\nMas a capacidade de interpretar e agir sobre esse dado está fora do alcance operacional atual.',
  },
];

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

const etapasDetalhadas = [
  { numero: '01', rotulo: 'Ver', descricao: 'O satélite enxerga o que ninguém em campo alcança. Vegetação, umidade do solo e temperatura de superfície, todo dia.' },
  { numero: '02', rotulo: 'Prever', descricao: 'O modelo de ML cruza esses sinais e estima onde o risco vai crescer antes de virar perda.' },
  { numero: '03', rotulo: 'Validar', descricao: 'A leitura orbital encontra a checagem em campo. O número deixa de ser palpite e vira confiança.' },
  { numero: '04', rotulo: 'Decidir', descricao: 'Sob recurso limitado, o operador escolhe qual área atender primeiro. \nÉ aqui que o dado vira decisão.' },
  { numero: '05', rotulo: 'Otimizar', descricao: 'O motor calcula a melhor alocação de equipe, insumo e tempo para o maior impacto possível.' },
  { numero: '06', rotulo: 'Agir', descricao: 'A missão sai do painel e vira ação no território, alguém vai até a área certa fazer o que importa.' },
  { numero: '07', rotulo: 'Medir', descricao: 'O resultado volta como dado, fecha o ciclo e ensina a próxima decisão a ser melhor.' },
];

const slidesCarrossel = etapasDetalhadas.map((e) => ({
  id: e.numero,
  titulo: e.rotulo,
  descricao: e.descricao,
}));

const CARD_W = 340;
const CARD_GAP = 16;

function CarrosselNav({ slides, indice, irPara }) {
  return (
    <View style={estilos.carrosselControles}>
      <Pressable
        style={[estilos.carrosselBtnCirculo, indice === 0 && estilos.carrosselBtnDesativado]}
        onPress={() => irPara(indice - 1)}
      >
        <Ionicons name="chevron-back-outline" size={16} color={indice === 0 ? '#334155' : '#94A3B8'} />
      </Pressable>
      <Pressable
        style={[estilos.carrosselBtnCirculo, estilos.carrosselBtnAtivo, indice === slides.length - 1 && estilos.carrosselBtnDesativado]}
        onPress={() => irPara(indice + 1)}
      >
        <Ionicons name="chevron-forward-outline" size={16} color={indice === slides.length - 1 ? '#334155' : '#F8FAFC'} />
      </Pressable>
      <View style={estilos.carrosselPontos}>
        {slides.map((_, i) => (
          <Pressable key={i} onPress={() => irPara(i)}>
            <View style={[estilos.carrosselPonto, i === indice && estilos.carrosselPontoAtivo]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function CarrosselCards({ slides, indice, animX, cardW }) {
  return (
    <View style={estilos.carrosselOverflow}>
      <Animated.View style={[estilos.carrosselTrilha, { transform: [{ translateX: animX }] }]}>
        {slides.map((slide, i) => (
          <View key={slide.id} style={[estilos.carrosselCard, { width: cardW }, i === indice && estilos.carrosselCardAtivo]}>
            <View style={estilos.carrosselCardFooter}>
              <Text style={estilos.carrosselCardTitulo}>{slide.titulo}</Text>
              <Text style={estilos.carrosselCardDescricao}>{slide.descricao}</Text>
            </View>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

function SecaoPrincipal({ atraso = 0, alturaJanela = 800 }) {
  const { width, isMobile } = useBreakpoint();
  const animY = useRef(new Animated.Value(24)).current;
  const animOp = useRef(new Animated.Value(0)).current;
  const [indiceCarrossel, setIndiceCarrossel] = useState(0);
  const animXCarrossel = useRef(new Animated.Value(0)).current;

  const cardW = isMobile ? Math.max(width - 40, 240) : CARD_W;
  const passo = cardW + CARD_GAP;

  function irParaSlide(novoIndice) {
    const total = slidesCarrossel.length;
    const idx = ((novoIndice % total) + total) % total;
    Animated.timing(animXCarrossel, {
      toValue: idx * -passo,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    setIndiceCarrossel(idx);
  }

  useEffect(() => {
    animXCarrossel.setValue(indiceCarrossel * -passo);
  }, [passo]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animY, { toValue: 0, duration: 500, delay: atraso, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(animOp, { toValue: 1, duration: 500, delay: atraso, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity: animOp, transform: [{ translateY: animY }] }, estilos.dossieContainer, { minHeight: alturaJanela }]}>

      <View style={estilos.dossieTopo}>
        <Text style={estilos.dossieRotuloEsquerda}>O QUE É O ORBITAL ACADEMY</Text>
        <Text style={estilos.dossieRotuloDireita}>01 / DOSSIÊ</Text>
      </View>

      <Text style={[estilos.dossieTituloGrande, isMobile && estilos.dossieTituloGrandeMobile]}>
        Dado espacial em decisão real, <Text style={estilos.destaqueCiano}> sem precisar ser especialista.</Text>
      </Text>

      <Text style={estilos.dossieSubtitulo}>
        {'O Orbital Academy pega o que a NASA e o INPE já enxergam lá de cima. Risco em lavoura, foco de calor, déficit hídrico e coloca na mão de quem precisa decidir o que fazer com isso!\nUm modelo prevê. Um otimizador aloca. Você opera. O satélite finalmente chega em campo.'}
      </Text>

      <Text style={estilos.dossieSubtitulo}>
        {'A plataforma não substitui o especialista técnico: ela torna a capacidade de decidir com dado espacial acessível para qualquer operador, qualquer produtor rural, qualquer equipe de campo que antes ficava de fora desse ciclo por falta de formação específica ou de ferramentas adequadas.'}
      </Text>

      {/* Seção 02 — Como funciona (carrossel) */}
      <View style={[estilos.secao02Layout, isMobile && estilos.secao02LayoutMobile]}>
        <View style={[estilos.secao02Esquerda, isMobile && estilos.secao02EsquerdaMobile]}>
          <View style={estilos.dossieCardTopo}>
            <View style={estilos.dossieCardBadge}>
              <Text style={estilos.dossieCardBadgeTexto}>02</Text>
            </View>
            <Text style={[estilos.dossieCardTitulo, { fontSize: 26, lineHeight: 34 }]}>Como funciona?</Text>
          </View>
          <CarrosselNav slides={slidesCarrossel} indice={indiceCarrossel} irPara={irParaSlide} />
        </View>

        <View style={[estilos.secao02Direita, isMobile && estilos.secao02DireitaMobile]}>
          <CarrosselCards slides={slidesCarrossel} indice={indiceCarrossel} animX={animXCarrossel} cardW={cardW} />
        </View>
      </View>

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

function CardFlip({ persona, isMobile }) {
  const animFlip = useRef(new Animated.Value(0)).current;

  // No mobile não há hover: mostra título + descrição empilhados, sem flip.
  if (isMobile) {
    return (
      <View style={estilos.personaCardMobile}>
        <Text style={estilos.flipRotulo}>{persona.rotulo}</Text>
        <Text style={estilos.flipTituloFront}>{persona.titulo}</Text>
        <Text style={estilos.flipDescricao}>{persona.descricao}</Text>
      </View>
    );
  }

  const frente = animFlip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const verso = animFlip.interpolate({ inputRange: [0, 1], outputRange: ['-180deg', '0deg'] });

  const hoverProps = Platform.OS === 'web'
    ? {
        onMouseEnter: () => Animated.timing(animFlip, { toValue: 1, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(),
        onMouseLeave: () => Animated.timing(animFlip, { toValue: 0, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(),
      }
    : {};

  return (
    <View style={estilos.flipContainer} {...hoverProps}>
      {/* Frente */}
      <Animated.View style={[estilos.flipFace, { transform: [{ perspective: 1200 }, { rotateY: frente }], backfaceVisibility: 'hidden' }]}>
        <View>
          <Text style={estilos.flipRotulo}>{persona.rotulo}</Text>
          <Text style={estilos.flipTituloFront}>{persona.titulo}</Text>
        </View>
        <View style={estilos.flipHintRow}>
          <Text style={estilos.flipHintTexto}>Ver detalhes</Text>
          <Ionicons name="arrow-forward-outline" size={13} color="#334155" />
        </View>
      </Animated.View>

      {/* Verso */}
      <Animated.View style={[estilos.flipFace, estilos.flipVerso, { transform: [{ perspective: 1200 }, { rotateY: verso }], backfaceVisibility: 'hidden', justifyContent: 'center' }]}>
        <Text style={estilos.flipDescricao}>{persona.descricao}</Text>
      </Animated.View>
    </View>
  );
}

function SecaoTese() {
  const { isMobile } = useBreakpoint();
  return (
    <View style={[estilos.secao03Wrapper, isMobile && estilos.secao03WrapperMobile]}>

      {/* Topo */}
      <View style={estilos.dossieTopo}>
        <Text style={estilos.dossieRotuloEsquerda}>TESE E ARQUITETURA</Text>
        <Text style={estilos.dossieRotuloDireita}>02 / TESE</Text>
      </View>

      <View style={estilos.dossieCardTopo}>
        <View style={estilos.dossieCardBadge}>
          <Text style={estilos.dossieCardBadgeTexto}>03</Text>
        </View>
        <Text style={[estilos.dossieCardTitulo, { fontSize: 26, lineHeight: 34 }]}>Por que isso importa?</Text>
      </View>
      <Text style={estilos.teseBodyText}>
        Dado espacial é abundante, gratuito e cada vez mais preciso. {'\n'}O que ainda é escasso é a capacidade de transformar esse dado em ação sob recurso limitado, em tempo real, por pessoas que não têm formação em sensoriamento remoto.
      </Text>


      {/* Personas */}
      <View style={[estilos.personasBlocos, isMobile && estilos.personasBlocosMobile]}>
        <CardFlip persona={personasData[0]} isMobile={isMobile} />
        <CardFlip persona={personasData[1]} isMobile={isMobile} />
        <View style={[estilos.personaFotoBloco, isMobile && estilos.personaFotoBlocoMobile]}>
          <Animated.Image source={imgPersonas} style={[estilos.personaFotoImg, isMobile && estilos.personaFotoImgMobile]} />
        </View>
        <CardFlip persona={personasData[2]} isMobile={isMobile} />
      </View>

    </View>
  );
}

// Seção 04 — os componentes da arquitetura (cards lado a lado).
const componentesData = [
  {
    id: 'console',
    icone: 'desktop-outline',
    titulo: 'Console de Missão',
    tagline: 'Interface central de operação',
    descricao: `Agrega mapa de risco em tempo real, ranking de áreas priorizadas pelo modelo com o motivo principal de cada previsão, fila de decisões do dia com status de cada missão e indicadores de impacto consolidados. 
    \nFoi projetado com um critério único de usabilidade: qualquer pessoa inclusive um jurado da banca que nunca usou o sistema consegue sentar, entender o cenário e tomar uma decisão operacional em menos de dois minutos, sem treinamento, sem manual. 
    \nSe isso não acontece, a interface falhou.`
  },
  {
    id: 'modelo',
    icone: 'analytics-outline',
    titulo: '0.1 - Motor de Decisão',
    tagline: 'Modelo de ML tradicional · previsão de risco',
    descricao: `O cérebro preditivo do sistema. Random Forest e Regressão Logística são treinados sobre dados reais de NASA Earthdata, INMET e INPE — NDVI, temperatura de superfície, déficit hídrico, uso da terra. 
    \nO modelo prevê o risco de perda por área com métricas claras (F1 ponderada e AUC ROC) e entrega as três variáveis que mais pesam em cada previsão, com porcentagem de importância. 
    \nIsso elimina a caixa-preta: o operador sabe exatamente por que o sistema apontou aquela área. Os dois modelos são comparados explicitamente para validação científica quem performa melhor em quais condições, e por quê.`,
  },
  {
    id: 'otimizador',
    icone: 'options-outline',
    titulo: '0.2 - Otimizador de Recursos',
    tagline: 'Otimizador próprio · alocação de recursos',
    descricao: `O diferencial técnico central do projeto, e a razão pela qual o Orbital Academy não é "mais um app de NDVI". Formulado e implementado pelo time, o otimizador recebe o score de risco de cada área (produzido pela camada 1) e resolve o problema de alocação ótima de recursos escassos: quanto de água vai para cada área, qual equipe vai a qual missão, em qual ordem de execução, dentro de quanto tempo disponível. `  },
  {
    id: 'camera',
    icone: 'camera-outline',
    titulo: 'Câmera de Validação',
    tagline: 'Visão computacional · ground-truth em campo',
    descricao: `O operador aponta a câmera do notebook ou do celular para uma amostra da cultura e o sistema classifica em tempo real saudável, estresse hídrico, praga, doença com o percentual de confiança de cada classe. 
    \nEsse resultado valida ou corrige o que o satélite previu, fechando o loop de ground-truth que qualquer modelo de ML precisa para ser confiável ao longo do tempo. 
    \nA inferência roda localmente no dispositivo: sem câmera funcionando, sem servidor. Isso é importante para o cenário de campo. Se não há rede, a câmera ainda funciona e o resultado é enfileirado para sincronização posterior.`,
  },
];

function CardArquitetura({ item, isMobile }) {
  const [aberto, setAberto] = useState(false);
  const animOverlay = useRef(new Animated.Value(0)).current;

  function revelar(visivel) {
    Animated.timing(animOverlay, {
      toValue: visivel ? 1 : 0,
      duration: visivel ? 200 : 160,
      useNativeDriver: true,
    }).start();
  }

  if (isMobile) {
    return (
      <Pressable style={[estilos.arqCard, estilos.arqCardMobile]} onPress={() => setAberto((v) => !v)}>
        <View style={estilos.arqCardIcone}>
          <Ionicons name={item.icone} size={20} color="#208AEF" />
        </View>
        <Text style={estilos.arqCardRotulo}>{item.titulo}</Text>
        <Text style={estilos.arqCardTagline}>{item.tagline}</Text>
        {aberto && <Text style={estilos.arqCardDescricao}>{item.descricao}</Text>}
        <View style={estilos.arqCardHintRow}>
          <Text style={estilos.arqCardHint}>{aberto ? 'Tocar para recolher' : 'Tocar para ver mais'}</Text>
          <Ionicons name={aberto ? 'chevron-up-outline' : 'chevron-down-outline'} size={14} color="#208AEF" />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={estilos.arqCard} onHoverIn={() => revelar(true)} onHoverOut={() => revelar(false)}>
      <View style={estilos.arqCardIcone}>
        <Ionicons name={item.icone} size={20} color="#208AEF" />
      </View>
      <Text style={estilos.arqCardRotulo}>{item.titulo}</Text>
      <Text style={estilos.arqCardTagline}>{item.tagline}</Text>
      <View style={estilos.arqCardHintRow}>
        <Text style={estilos.arqCardHint}>Passe o mouse para ver</Text>
        <Ionicons name="arrow-forward-outline" size={14} color="#208AEF" />
      </View>

      {/* Overlay com a descrição (fade no hover) */}
      <Animated.View pointerEvents="none" style={[estilos.arqCardOverlay, { opacity: animOverlay }]}>
        <Text style={estilos.arqCardRotulo}>{item.titulo}</Text>
        <Text style={estilos.arqCardDescricao}>{item.descricao}</Text>
      </Animated.View>
    </Pressable>
  );
}

function SecaoArquitetura() {
  const { isMobile, height } = useBreakpoint();
  return (
    <View style={[estilos.secao04Wrapper, { minHeight: height }, isMobile && estilos.secao04WrapperMobile]}>

      <View style={estilos.arqHeader}>
        <Text style={estilos.arqRotulo}>ARQUITETURA DA SOLUÇÃO</Text>
        <Text style={[estilos.arqTitulo, isMobile && estilos.arqTituloMobile]}>
          O que está por baixo do capô.
        </Text>
        <Text style={estilos.arqTexto}>
          O Orbital Academy não é um sistema monolítico. E sim uma arquitetura de oito componentes
          integrados, cada um com papel preciso no ciclo de decisão. Retire qualquer peça e o ciclo para.
          {'\n\n'}
        </Text>
      </View>

      <View style={[estilos.arqGrid, isMobile && estilos.arqGridMobile]}>
        {componentesData.map((item) => (
          <CardArquitetura key={item.id} item={item} isMobile={isMobile} />
        ))}
      </View>

    </View>
  );
}

export default function Home() {
  const [ativo, setAtivo] = useState('home');
  const [menuAberto, setMenuAberto] = useState(false);
  const { height, isMobile } = useBreakpoint();
  const mostrarHome = ativo === 'home';
  const scrollRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  function selecionar(chave) {
    setAtivo(chave);
    setMenuAberto(false);
  }

  return (
    <View style={estilos.container}>
      {/* Desktop: sidebar fixa inline (expande no hover) */}
      {!isMobile && <Sidebar ativo={ativo} aoSelecionar={setAtivo} />}

      <View style={estilos.conteudo}>
        <View style={estilos.fundoEspacial} pointerEvents="none">
          {estrelas.map((e) => (
            <Estrela key={e.id} {...e} />
          ))}
        </View>

        <View style={estilos.cabecalho}>
          {isMobile && (
            <Pressable style={estilos.hamburguer} onPress={() => setMenuAberto(true)} hitSlop={8}>
              <Ionicons name="menu-outline" size={24} color="#CBD5E1" />
            </Pressable>
          )}
          <View style={estilos.cabecalhoEsquerda}>
            <View style={estilos.badgePill}>
              <View style={estilos.badgePonto} />
              <Text style={estilos.badgeTexto}>Global Solution FIAP · Space Connect · 2026.1</Text>
            </View>
          </View>
        </View>

        {mostrarHome ? (
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
            scrollEventThrottle={16}
          >

            <View style={[estilos.hero, isMobile && estilos.heroMobile, { minHeight: height }]}>
              <Text style={[estilos.titulo, isMobile && estilos.tituloMobile]}>
                Operar é aprender.{'\n'}Decidir é o impacto.
              </Text>

              <Text style={estilos.subtitulo}>
                O Orbital Academy é uma plataforma que ensina qualquer pessoa a
                transformar dado espacial em decisão real!
              </Text>

              <View style={estilos.barraEtapas}>
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

            <View style={[estilos.secao01Wrapper, isMobile && estilos.secao01WrapperMobile]}>
              <SecaoPrincipal atraso={0} alturaJanela={height} />
            </View>

            <View style={[estilos.parallaxContainer, isMobile && estilos.parallaxContainerMobile]}>
              <Animated.Image
                source={imgParallax}
                style={[estilos.parallaxImg, isMobile && estilos.parallaxImgMobile]}
              />
              {/* Fade superior */}
              <View
                pointerEvents="none"
                style={[
                  estilos.parallaxFadeTopo,
                  Platform.OS === 'web' && {
                    background: 'linear-gradient(to bottom, #050810 0%, transparent 100%)',
                  },
                ]}
              />
              {/* Fade inferior */}
              <View
                pointerEvents="none"
                style={[
                  estilos.parallaxFadeBase,
                  Platform.OS === 'web' && {
                    background: 'linear-gradient(to bottom, transparent 0%, #050810 100%)',
                  },
                ]}
              />
            </View>
            <SecaoTese />
            <SecaoArquitetura />
          </ScrollView>
        ) : (
          <View style={estilos.telaVazia}>
            <Text style={estilos.telaVaziaTexto}>{ativo}</Text>
          </View>
        )}
      </View>

      {/* Mobile: backdrop + drawer por cima do conteúdo */}
      {isMobile && (
        <>
          {menuAberto && (
            <Pressable style={estilos.backdrop} onPress={() => setMenuAberto(false)} />
          )}
          <Sidebar
            ativo={ativo}
            aoSelecionar={selecionar}
            aberto={menuAberto}
            aoFechar={() => setMenuAberto(false)}
          />
        </>
      )}

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

  fundoEspacial: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  parallaxContainer: {
    height: 560,
    overflow: 'hidden',
    marginTop: 80,
    position: 'relative',
  },
  parallaxImg: {
    width: '100%',
    height: 720,
    resizeMode: 'cover',
    marginTop: -80,
  },
  parallaxFadeTopo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  parallaxFadeBase: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
  },

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
    fontFamily: fonts.body,
  },

  hero: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
    zIndex: 5,
  },
  titulo: {
    color: '#F8FAFC',
    fontSize: 56,
    fontFamily: fonts.titleBlack,
    textAlign: 'center',
    lineHeight: 64,
    letterSpacing: -1,
    marginBottom: 24,
  },
  subtitulo: {
    color: '#64748B',
    fontSize: 16,
    fontFamily: fonts.body,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 540,
    marginBottom: 60,
  },

  barraEtapas: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
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
    fontFamily: fonts.bodySemiBold,
  },
  etapaSeta: {
    color: '#334155',
    fontSize: 12,
  },

  setaContainer: {
    marginTop: 16,
    alignItems: 'center',
  },

  secao01Wrapper: {
    width: '100%',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },

  // --- Seção 01 --- Dossie (Introdução)
  dossieContainer: {
    gap: 40,
  },
  dossieTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dossieRotuloEsquerda: {
    color: '#208AEF',
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dossieRotuloDireita: {
    color: '#334155',
    fontSize: 11,
    fontFamily: fonts.bodySemiBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  dossieTituloGrande: {
    color: '#F1F5F9',
    fontSize: 42,
    fontFamily: fonts.titleBlack,
    lineHeight: 54,
    letterSpacing: -1,
  },
  dossieSubtitulo: {
    color: '#64748B',
    fontSize: 15,
    fontFamily: fonts.body,
    lineHeight: 28,
    maxWidth: 1800,
  },
  destaqueCiano: {
    color: '#38BDF8',
  },
  dossieCardTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dossieCardBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#ffffff0A',
    borderWidth: 1,
    borderColor: '#ffffff15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dossieCardBadgeTexto: {
    color: '#94A3B8',
    fontSize: 11,
    fontFamily: fonts.bodyBold,
  },
  dossieCardTitulo: {
    color: '#E2E8F0',
    fontSize: 16,
    fontFamily: fonts.titleBold,
  },

  // --- Seção 02 --- (Carrossel)
  secao02Layout: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 0,
    marginTop: 90,
  },
  secao02Esquerda: {
    width: 280,
    gap: 16,
    paddingRight: 24,
    paddingBottom: 24,
    justifyContent: 'flex-end',
  },
  secao02Direita: {
    flex: 1,
    overflow: 'hidden',
  },

  carrosselOverflow: {
    overflow: 'hidden',
    flex: 1,
  },
  carrosselTrilha: {
    flexDirection: 'row',
    gap: CARD_GAP,
  },
  carrosselCard: {
    width: CARD_W,
    height: 400,
    borderRadius: 14,
    backgroundColor: '#0a0f1a',
    borderWidth: 1,
    borderColor: '#ffffff0D',
    overflow: 'hidden',
    position: 'relative',
    opacity: 0.45,
  },
  carrosselCardAtivo: {
    opacity: 1,
    borderColor: '#208AEF30',
  },
  carrosselCardFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 8,
    backgroundColor: '#0D1117',
  },
  carrosselCardTitulo: {
    color: '#E2E8F0',
    fontSize: 26,
    fontFamily: fonts.titleBold,
    lineHeight: 34,
  },
  carrosselCardDescricao: {
    color: '#94A3B8',
    fontSize: 14,
    fontFamily: fonts.body,
    lineHeight: 22,
  },
  carrosselControles: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  carrosselBtnCirculo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ffffff20',
    backgroundColor: '#0D1117',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carrosselBtnAtivo: {
    backgroundColor: '#208AEF',
    borderColor: '#208AEF',
  },
  carrosselBtnDesativado: {
    opacity: 0.3,
  },
  carrosselPontos: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginLeft: 4,
  },
  carrosselPonto: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#1e293b',
  },
  carrosselPontoAtivo: {
    width: 20,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#208AEF',
  },

  // --- Seção 03 (Personas, card flip ) ---
  secao03Wrapper: {
    marginTop: 160,
    paddingHorizontal: 64,
    paddingBottom: 48,
    gap: 40,
  },

  teseBodyText: {
    color: '#94A3B8',
    fontSize: 16,
    fontFamily: fonts.body,
    lineHeight: 26,
  },
  personasBlocos: {
    flexDirection: 'row',
    gap: 16,
    height: 400,
  },
  personaFotoBloco: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  personaFotoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  flipContainer: {
    flex: 1,
    height: 400,
    position: 'relative',
  },
  flipFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A0F1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff0D',
    padding: 28,
    justifyContent: 'space-between',
  },
  flipVerso: {
    backgroundColor: '#0D1421',
    borderColor: '#208AEF15',
  },
  flipRotulo: {
    color: '#208AEF',
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  flipTituloFront: {
    color: '#E2E8F0',
    fontSize: 30,
    fontFamily: fonts.titleBlack,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  flipDescricao: {
    color: '#94A3B8',
    fontSize: 15,
    fontFamily: fonts.body,
    lineHeight: 26,
  },
  flipHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flipHintTexto: {
    color: '#334155',
    fontSize: 12,
    fontFamily: fonts.bodySemiBold,
  },

  // ---- Seção 04 ----
  secao04Wrapper: {
    justifyContent: 'center',
    marginTop: 120,
    paddingHorizontal: 64,
    paddingVertical: 80,
    gap: 48,
  },
  arqHeader: {
    alignItems: 'center',
    alignSelf: 'center',
    maxWidth: 760,
    gap: 18,
  },
  arqRotulo: {
    color: '#208AEF',
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  arqTitulo: {
    color: '#F1F5F9',
    fontSize: 42,
    fontFamily: fonts.titleBlack,
    lineHeight: 54,
    letterSpacing: -1,
    textAlign: 'center',
  },
  arqTexto: {
    color: '#64748B',
    fontSize: 15,
    fontFamily: fonts.body,
    lineHeight: 28,
    textAlign: 'center',
    width: '100%',
    maxWidth: 800,
  },
  arqGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    width: '100%',
    maxWidth: 1160,
    alignSelf: 'center',
  },
  arqCard: {
    width: '23%',
    height: 500,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0A0F1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff0D',
    padding: 24,
    gap: 12,
  },
  arqCardIcone: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#208AEF30',
    backgroundColor: '#208AEF10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arqCardRotulo: {
    color: '#E2E8F0',
    fontSize: 17,
    fontFamily: fonts.titleBold,
  },
  arqCardTagline: {
    color: '#208AEF',
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
    lineHeight: 18,
  },
  arqCardDescricao: {
    color: '#94A3B8',
    fontSize: 13,
    fontFamily: fonts.body,
    lineHeight: 20,
  },
  arqCardHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 'auto',
  },
  arqCardHint: {
    color: '#208AEF',
    fontSize: 12,
    fontFamily: fonts.bodySemiBold,
  },
  arqCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A0F1A',
    borderRadius: 16,
    padding: 24,
    gap: 10,
    justifyContent: 'center',
  },

  // ---- Variantes mobile (< 1024px) ----
  secao04WrapperMobile: {
    paddingHorizontal: 20,
    paddingVertical: 48,
  },
  arqTituloMobile: {
    fontSize: 28,
    lineHeight: 36,
  },
  arqGridMobile: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    maxWidth: '100%',
  },
  arqCardMobile: {
    width: '100%',
    height: 'auto',
  },
  secao01WrapperMobile: {
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  hamburguer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffffff15',
    backgroundColor: '#ffffff08',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000099',
    zIndex: 40,
  },
  heroMobile: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  tituloMobile: {
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  dossieTituloGrandeMobile: {
    fontSize: 28,
    lineHeight: 36,
  },
  secao02LayoutMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: 48,
    gap: 24,
  },
  secao02EsquerdaMobile: {
    width: '100%',
    paddingRight: 0,
    paddingBottom: 0,
  },
  secao02DireitaMobile: {
    width: '100%',
    height: 400,
  },
  secao03WrapperMobile: {
    marginTop: 80,
    paddingHorizontal: 20,
  },
  personasBlocosMobile: {
    flexDirection: 'column',
    height: 'auto',
  },
  personaFotoBlocoMobile: {
    height: 280,
  },
  personaFotoImgMobile: {
    height: '100%',
  },
  personaCardMobile: {
    backgroundColor: '#0A0F1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff0D',
    padding: 24,
    gap: 12,
  },
  parallaxContainerMobile: {
    height: 320,
    marginTop: 48,
  },
  parallaxImgMobile: {
    height: 440,
    marginTop: -60,
  },

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