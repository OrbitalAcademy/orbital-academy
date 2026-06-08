import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../styles/fonts';
import { useBreakpoint } from '../styles/breakpoint';
import AcessoBloqueado from '../components/acessoBloqueado';

// --- Abas do topo ---
const ABAS = ['Tudo', 'Trilhas', 'Glossário', 'Estudos', 'Leituras'];

// --- Cores por nível de trilha ---
const CORES_NIVEL = {
  'Básico': '#22C55E',
  'Intermediário': '#38BDF8',
  'Avançado': '#F59E0B',
};

// --- Cores por tipo de leitura ---
const CORES_TIPO = {
  'Artigo': '#38BDF8',
  'Manual': '#22C55E',
  'Paper': '#F59E0B',
  'Vídeo': '#94A3B8',
};

// ------- Dados -------

const trilhaDestaque = {
  rotulo: 'CICLO COMPLETO',
  titulo: 'Do pixel à decisão',
  descricao:
    'A trilha-base da Orbital Academy. Percorre o ciclo inteiro — Ver, Prever, Validar, Decidir, Otimizar, Agir e Medir — operando uma missão de cana e soja em São Paulo, do dado bruto até a ação no território.',
  modulos: 7,
  duracao: '3 h 20 min',
  nivel: 'Fundamentos',
  progresso: 43,
  itens: [
    { numero: '01', titulo: 'O que o satélite enxerga', min: '22 min' },
    { numero: '02', titulo: 'Índices: NDVI e NDWI na prática', min: '31 min' },
    { numero: '03', titulo: 'Prever risco com aprendizado de máquina', min: '28 min' },
    { numero: '04', titulo: 'Ground-truth: validar em campo', min: '26 min' },
    { numero: '05', titulo: 'Decidir sob recurso limitado', min: '34 min' },
    { numero: '06', titulo: 'Otimizar a alocação', min: '29 min' },
    { numero: '07', titulo: 'Agir, medir e fechar o ciclo', min: '30 min' },
  ],
};

const trilhas = [
  { etapa: 'VER', nivel: 'Básico', titulo: 'O olhar do satélite', desc: 'Bandas espectrais, resolução e o que cada sensor revela do território.', modulos: 4, duracao: '55 min', progresso: 100 },
  { etapa: 'PREVER', nivel: 'Intermediário', titulo: 'Prever com aprendizado de máquina', desc: 'Como o modelo cruza vegetação, solo e clima para antecipar a perda.', modulos: 5, duracao: '1 h 10 min', progresso: 60 },
  { etapa: 'VALIDAR', nivel: 'Básico', titulo: 'Ground-truth de campo', desc: 'A leitura orbital encontra a checagem humana e vira confiança.', modulos: 3, duracao: '40 min', progresso: 0 },
  { etapa: 'DECIDIR', nivel: 'Intermediário', titulo: 'Decidir sob restrição', desc: 'Escolher qual área atender primeiro quando o recurso não cobre todas.', modulos: 4, duracao: '1 h 05 min', progresso: 0 },
  { etapa: 'OTIMIZAR', nivel: 'Avançado', titulo: 'A matemática da alocação', desc: 'Programação linear aplicada: máximo impacto por unidade de esforço.', modulos: 4, duracao: '1 h 15 min', progresso: 0 },
  { etapa: 'MEDIR', nivel: 'Intermediário', titulo: 'Medir impacto, fechar o ciclo', desc: 'Transformar o resultado em dado que ensina a próxima decisão.', modulos: 3, duracao: '48 min', progresso: 0 },
];

const estudos = [
  {
    icone: 'person-outline',
    rotulo: 'PRODUTOR RURAL',
    titulo: 'Lavoura vista do céu, decisão no escuro',
    desc: 'Faz. Santa Bárbara enxergava a cana inteira por NDVI, mas irrigava por intuição. A trilha ensinou a priorizar talhões por estresse hídrico antes da perda virar visível.',
    metrica: '−23%',
    metricaCor: '#22C55E',
    metricaDesc: 'perda hídrica na safra após priorizar irrigação pelo mapa de risco',
    licaoAntes: 'ver tudo não é decidir. O valor está em ',
    licaoForte: 'escolher onde agir primeiro.',
  },
  {
    icone: 'shield-outline',
    rotulo: 'DEFESA CIVIL',
    titulo: 'Priorizar o resgate com equipe contada',
    desc: 'Focos de calor do FIRMS chegavam aos montes, sem ordem. Cruzando risco e acesso, a equipe passou a despachar para a frente certa em vez da mais próxima.',
    metrica: '4 h',
    metricaCor: '#38BDF8',
    metricaDesc: 'ganhas no tempo de alerta ao combinar foco térmico com risco de propagação',
    licaoAntes: 'o satélite detecta de graça. O diferencial é ',
    licaoForte: 'o que se faz depois.',
  },
  {
    icone: 'medical-outline',
    rotulo: 'AGENTE DE SAÚDE',
    titulo: 'Rota onde o dado raramente chega',
    desc: 'Água parada vista por NDWI antecipa foco de dengue. Em vez de varrer o bairro inteiro, o agente passou a visitar os pontos que o índice apontava primeiro.',
    metrica: '+38%',
    metricaCor: '#F59E0B',
    metricaDesc: 'visitas no ponto certo após roteirizar pela leitura orbital',
    licaoAntes: 'dado espacial leva decisão ',
    licaoForte: 'para onde o especialista não alcança.',
  },
];

const leituras = [
  { tipo: 'Artigo', titulo: 'O downstream do dado espacial', fonte: 'Space Connect', min: '8 min' },
  { tipo: 'Manual', titulo: 'Como ler um índice NDVI sem errar', fonte: 'Espaçoteca', min: '6 min' },
  { tipo: 'Manual', titulo: 'Da imagem à missão: o ciclo completo', fonte: 'Espaçoteca', min: '12 min' },
  { tipo: 'Paper', titulo: 'Alocação ótima sob restrição de recurso', fonte: 'Otimização aplicada', min: '14 min' },
  { tipo: 'Vídeo', titulo: 'Ground-truth na prática, com a câmera', fonte: 'Câmera Lab', min: '11 min' },
  { tipo: 'Artigo', titulo: 'Por que não competir com a NASA', fonte: 'Space Connect', min: '5 min' },
];

const TOTAL_REFERENCIAS =
  1 + trilhas.length + estudos.length + leituras.length;

// ------- Componentes auxiliares -------

function SecaoTitulo({ texto }) {
  return (
    <View style={estilos.secaoTituloRow}>
      <Text style={estilos.secaoTitulo}>{texto}</Text>
      <View style={estilos.secaoTituloLinha} />
    </View>
  );
}

function NivelBadge({ nivel }) {
  const cor = CORES_NIVEL[nivel] ?? '#94A3B8';
  return (
    <View style={[estilos.nivelBadge, { borderColor: `${cor}55`, backgroundColor: `${cor}1A` }]}>
      <Text style={[estilos.nivelBadgeTexto, { color: cor }]}>{nivel}</Text>
    </View>
  );
}

function Progresso({ pct }) {
  const concluida = pct === 100;
  const naoIniciada = pct === 0;
  const cor = concluida ? '#22C55E' : '#38BDF8';
  const rotulo = concluida ? 'Concluída' : naoIniciada ? 'Não iniciada' : `${pct}% concluído`;
  return (
    <View style={estilos.progresso}>
      <View style={estilos.progressoTopo}>
        <Text style={[estilos.progressoRotulo, naoIniciada && estilos.progressoRotuloApagado]}>{rotulo}</Text>
        {!naoIniciada && <Text style={[estilos.progressoPct, { color: cor }]}>{pct}%</Text>}
      </View>
      <View style={estilos.progressoTrilho}>
        {!naoIniciada && <View style={[estilos.progressoPreenche, { width: `${pct}%`, backgroundColor: cor }]} />}
      </View>
    </View>
  );
}

function MetaItem({ icone, texto }) {
  return (
    <View style={estilos.metaItem}>
      <Ionicons name={icone} size={14} color="#64748B" />
      <Text style={estilos.metaTexto}>{texto}</Text>
    </View>
  );
}

// ------- Seções -------

function SecaoTrilhas({ isMobile }) {
  return (
    <View style={estilos.secao}>
      <SecaoTitulo texto="TRILHAS DE APRENDIZADO" />

      {/* Trilha em destaque + módulos */}
      <View style={[estilos.destaqueCard, isMobile && estilos.destaqueCardMobile]}>
        <View style={estilos.destaqueEsquerda}>
          <View style={estilos.destaqueBadges}>
            <View style={estilos.destaquePill}>
              <Text style={estilos.destaquePillTexto}>EM DESTAQUE</Text>
            </View>
            <Text style={estilos.destaqueRotulo}>{trilhaDestaque.rotulo}</Text>
          </View>

          <Text style={[estilos.destaqueTitulo, isMobile && estilos.destaqueTituloMobile]}>{trilhaDestaque.titulo}</Text>
          <Text style={estilos.destaqueDesc}>{trilhaDestaque.descricao}</Text>

          <View style={estilos.destaqueMeta}>
            <MetaItem icone="layers-outline" texto={`${trilhaDestaque.modulos} módulos`} />
            <MetaItem icone="time-outline" texto={trilhaDestaque.duracao} />
            <View style={estilos.fundamentosBadge}>
              <Text style={estilos.fundamentosTexto}>{trilhaDestaque.nivel}</Text>
            </View>
          </View>

          <View style={[estilos.destaqueRodape, isMobile && estilos.destaqueRodapeMobile]}>
            <Progresso pct={trilhaDestaque.progresso} />
            <Pressable style={estilos.btnContinuar}>
              <Ionicons name="play-circle-outline" size={18} color="#F8FAFC" />
              <Text style={estilos.btnContinuarTexto}>Continuar trilha</Text>
            </Pressable>
          </View>
        </View>

        <View style={[estilos.destaqueDireita, isMobile && estilos.destaqueDireitaMobile]}>
          <Text style={estilos.modulosRotulo}>MÓDULOS</Text>
          {trilhaDestaque.itens.map((item) => (
            <View key={item.numero} style={estilos.moduloLinha}>
              <View style={estilos.moduloNumero}>
                <Text style={estilos.moduloNumeroTexto}>{item.numero}</Text>
              </View>
              <Text style={estilos.moduloTitulo} numberOfLines={1}>{item.titulo}</Text>
              <Text style={estilos.moduloMin}>{item.min}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Grid de trilhas */}
      <View style={estilos.grid}>
        {trilhas.map((t) => (
          <View key={t.etapa} style={[estilos.trilhaCard, isMobile ? estilos.cardMobile : estilos.card3col]}>
            <View style={estilos.trilhaTopo}>
              <Text style={estilos.trilhaEtapa}>{t.etapa}</Text>
              <NivelBadge nivel={t.nivel} />
            </View>
            <Text style={estilos.trilhaTitulo}>{t.titulo}</Text>
            <Text style={estilos.trilhaDesc}>{t.desc}</Text>
            <View style={estilos.trilhaMeta}>
              <MetaItem icone="layers-outline" texto={`${t.modulos} módulos`} />
              <MetaItem icone="time-outline" texto={t.duracao} />
            </View>
            <Progresso pct={t.progresso} />
          </View>
        ))}
      </View>
    </View>
  );
}

function SecaoEstudos({ isMobile }) {
  return (
    <View style={estilos.secao}>
      <SecaoTitulo texto="ESTUDOS DE CASO" />
      <View style={estilos.grid}>
        {estudos.map((e) => (
          <View key={e.rotulo} style={[estilos.estudoCard, isMobile ? estilos.cardMobile : estilos.card3col]}>
            <View style={estilos.estudoRotuloRow}>
              <Ionicons name={e.icone} size={14} color="#38BDF8" />
              <Text style={estilos.estudoRotulo}>{e.rotulo}</Text>
            </View>
            <Text style={estilos.estudoTitulo}>{e.titulo}</Text>
            <Text style={estilos.estudoDesc}>{e.desc}</Text>

            <View style={estilos.estudoDivisor} />

            <View style={estilos.estudoMetricaRow}>
              <Text style={[estilos.estudoMetrica, { color: e.metricaCor }]}>{e.metrica}</Text>
              <Text style={estilos.estudoMetricaDesc}>{e.metricaDesc}</Text>
            </View>

            <Text style={estilos.estudoLicao}>
              Lição: {e.licaoAntes}
              <Text style={estilos.estudoLicaoForte}>{e.licaoForte}</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function SecaoLeituras({ isMobile }) {
  return (
    <View style={estilos.secao}>
      <SecaoTitulo texto="LEITURAS ESSENCIAIS" />
      <View style={estilos.listaCaixa}>
        {leituras.map((l, i) => {
          const cor = CORES_TIPO[l.tipo] ?? '#94A3B8';
          return (
            <View key={l.titulo} style={[estilos.leituraLinha, i === leituras.length - 1 && estilos.linhaSemBorda]}>
              <View style={[estilos.tipoBadge, { borderColor: `${cor}55`, backgroundColor: `${cor}1A` }]}>
                <Text style={[estilos.tipoBadgeTexto, { color: cor }]}>{l.tipo}</Text>
              </View>
              <Text style={[estilos.leituraTitulo, isMobile && estilos.leituraTituloMobile]} numberOfLines={isMobile ? 2 : 1}>
                {l.titulo}
              </Text>
              {!isMobile && <View style={estilos.flexEspaco} />}
              <Text style={estilos.leituraFonte}>{`${l.fonte} · ${l.min}`}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function SecaoEmBreve({ nome }) {
  return (
    <View style={estilos.secao}>
      <SecaoTitulo texto={nome.toUpperCase()} />
      <View style={estilos.emBreveCaixa}>
        <Ionicons name="construct-outline" size={26} color="#334155" />
        <Text style={estilos.emBreveTexto}>Seção em construção</Text>
      </View>
    </View>
  );
}

function ConteudoComLogin({ isMobile, aba }) {
  const mostrar = (chave) => aba === 'Tudo' || aba === chave;
  return (
    <ScrollView style={estilos.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={estilos.corpo}>
      {mostrar('Trilhas') && <SecaoTrilhas isMobile={isMobile} />}
      {mostrar('Estudos') && <SecaoEstudos isMobile={isMobile} />}
      {mostrar('Leituras') && <SecaoLeituras isMobile={isMobile} />}
      {/* Glossário: conteúdo a ser (re)definido. */}
      {aba === 'Glossário' && <SecaoEmBreve nome="Glossário" />}
    </ScrollView>
  );
}

function ConteudoVazio() {
  return (
    <View style={estilos.vazioArea}>
      <View style={estilos.vazioCaixa}>
        <Ionicons name="library-outline" size={34} color="#334155" />
        <Text style={estilos.vazioTitulo}>Espaçoteca bloqueada</Text>
        <Text style={estilos.vazioSub}>
          Faça login para abrir o acervo: trilhas de aprendizado, fontes de dado, glossário, estudos de caso e leituras essenciais.
        </Text>
      </View>
    </View>
  );
}

export default function Espacoteca({ logado = false, aoPedirLogin, aoPedirCadastro }) {
  const { isMobile } = useBreakpoint();
  const [aba, setAba] = useState('Tudo');

  const animOp = useRef(new Animated.Value(0)).current;
  const animY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animOp, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(animY, { toValue: 0, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[estilos.container, { opacity: animOp, transform: [{ translateY: animY }] }]}>
      {/* Cabeçalho próprio: abas + contagem */}
      <View style={[estilos.cabecalho, isMobile && estilos.cabecalhoMobile]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.abas}>
          {ABAS.map((item) => {
            const ativo = item === aba;
            return (
              <Pressable key={item} onPress={() => setAba(item)} style={[estilos.aba, ativo && estilos.abaAtiva]}>
                <Text style={[estilos.abaTexto, ativo && estilos.abaTextoAtivo]}>{item}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        {!isMobile && <Text style={estilos.contagem}>{`${TOTAL_REFERENCIAS} referências`}</Text>}
      </View>

      <AcessoBloqueado logado={logado} aoPedirLogin={aoPedirLogin} aoPedirCadastro={aoPedirCadastro}>
        {logado ? <ConteudoComLogin isMobile={isMobile} aba={aba} /> : <ConteudoVazio />}
      </AcessoBloqueado>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  corpo: { padding: 24, gap: 40 },

  // --- Cabeçalho (abas) ---
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 44,
    paddingBottom: 16,
  },
  cabecalhoMobile: { paddingTop: 16, gap: 8 },
  abas: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingRight: 12 },
  aba: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  abaAtiva: {
    borderColor: '#ffffff40',
    backgroundColor: '#ffffff08',
  },
  abaTexto: { color: '#64748B', fontSize: 14, fontFamily: fonts.bodySemiBold },
  abaTextoAtivo: { color: '#F8FAFC', fontFamily: fonts.bodyBold },
  contagem: {
    marginLeft: 'auto',
    color: '#475569',
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
    letterSpacing: 0.5,
  },

  // --- Seção genérica ---
  secao: { gap: 16 },
  secaoTituloRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  secaoTitulo: {
    color: '#208AEF',
    fontSize: 12,
    fontFamily: fonts.bodyBold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  secaoTituloLinha: { flex: 1, height: 1, backgroundColor: '#ffffff0D' },

  // --- Grid genérico ---
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16 },
  card3col: { width: '32%' },
  cardMobile: { width: '100%' },

  // --- Trilha em destaque ---
  destaqueCard: {
    flexDirection: 'row',
    backgroundColor: '#0A0F1A',
    borderWidth: 1,
    borderColor: '#ffffff0D',
    borderRadius: 16,
    overflow: 'hidden',
  },
  destaqueCardMobile: { flexDirection: 'column' },
  destaqueEsquerda: { flex: 1, padding: 28, gap: 20 },
  destaqueBadges: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  destaquePill: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#208AEF1A',
    borderWidth: 1,
    borderColor: '#208AEF55',
  },
  destaquePillTexto: { color: '#38BDF8', fontSize: 10, fontFamily: fonts.bodyBold, letterSpacing: 0.8 },
  destaqueRotulo: { color: '#475569', fontSize: 11, fontFamily: fonts.bodyBold, letterSpacing: 1.2 },
  destaqueTitulo: { color: '#F1F5F9', fontSize: 34, fontFamily: fonts.titleBlack, letterSpacing: -0.5 },
  destaqueTituloMobile: { fontSize: 26 },
  destaqueDesc: { color: '#64748B', fontSize: 15, fontFamily: fonts.body, lineHeight: 24, maxWidth: 520 },
  destaqueMeta: { flexDirection: 'row', alignItems: 'center', gap: 18, flexWrap: 'wrap' },
  fundamentosBadge: {
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: '#208AEF1A',
    borderWidth: 1,
    borderColor: '#208AEF40',
  },
  fundamentosTexto: { color: '#38BDF8', fontSize: 12, fontFamily: fonts.bodySemiBold },
  destaqueRodape: { flexDirection: 'row', alignItems: 'center', gap: 24, marginTop: 8 },
  destaqueRodapeMobile: { flexDirection: 'column', alignItems: 'stretch', gap: 16 },
  btnContinuar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#208AEF',
  },
  btnContinuarTexto: { color: '#F8FAFC', fontSize: 14, fontFamily: fonts.bodyBold },

  destaqueDireita: {
    width: 340,
    padding: 24,
    gap: 2,
    borderLeftWidth: 1,
    borderLeftColor: '#ffffff0D',
  },
  destaqueDireitaMobile: { width: '100%', borderLeftWidth: 0, borderTopWidth: 1, borderTopColor: '#ffffff0D' },
  modulosRotulo: { color: '#475569', fontSize: 11, fontFamily: fonts.bodyBold, letterSpacing: 1.2, marginBottom: 10 },
  moduloLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff08',
  },
  moduloNumero: {
    width: 26,
    height: 26,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#22C55E40',
    backgroundColor: '#22C55E12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduloNumeroTexto: { color: '#22C55E', fontSize: 11, fontFamily: fonts.bodyBold },
  moduloTitulo: { flex: 1, color: '#E2E8F0', fontSize: 14, fontFamily: fonts.body },
  moduloMin: { color: '#475569', fontSize: 12, fontFamily: fonts.body },

  // --- Card de trilha (grid) ---
  trilhaCard: {
    backgroundColor: '#0A0F1A',
    borderWidth: 1,
    borderColor: '#ffffff0D',
    borderRadius: 16,
    padding: 22,
    gap: 12,
  },
  trilhaTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trilhaEtapa: { color: '#208AEF', fontSize: 11, fontFamily: fonts.bodyBold, letterSpacing: 1.2 },
  trilhaTitulo: { color: '#F1F5F9', fontSize: 19, fontFamily: fonts.titleBold, lineHeight: 25 },
  trilhaDesc: { color: '#64748B', fontSize: 14, fontFamily: fonts.body, lineHeight: 21, minHeight: 42 },
  trilhaMeta: { flexDirection: 'row', alignItems: 'center', gap: 18, marginTop: 2 },

  nivelBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1 },
  nivelBadgeTexto: { fontSize: 11, fontFamily: fonts.bodySemiBold },

  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaTexto: { color: '#64748B', fontSize: 13, fontFamily: fonts.body },

  // --- Progresso ---
  progresso: { flex: 1, gap: 7 },
  progressoTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressoRotulo: { color: '#64748B', fontSize: 12, fontFamily: fonts.bodySemiBold },
  progressoRotuloApagado: { color: '#475569' },
  progressoPct: { fontSize: 12, fontFamily: fonts.bodyBold },
  progressoTrilho: { height: 5, borderRadius: 3, backgroundColor: '#ffffff0D', overflow: 'hidden' },
  progressoPreenche: { height: 5, borderRadius: 3 },

  // --- Estudos de caso ---
  estudoCard: {
    backgroundColor: '#0A0F1A',
    borderWidth: 1,
    borderColor: '#ffffff0D',
    borderRadius: 16,
    padding: 22,
    gap: 12,
  },
  estudoRotuloRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  estudoRotulo: { color: '#38BDF8', fontSize: 11, fontFamily: fonts.bodyBold, letterSpacing: 1 },
  estudoTitulo: { color: '#F1F5F9', fontSize: 19, fontFamily: fonts.titleBold, lineHeight: 25 },
  estudoDesc: { color: '#64748B', fontSize: 14, fontFamily: fonts.body, lineHeight: 21 },
  estudoDivisor: { height: 1, backgroundColor: '#ffffff0D', borderStyle: 'dashed', marginVertical: 2 },
  estudoMetricaRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  estudoMetrica: { fontSize: 38, fontFamily: fonts.titleBlack, letterSpacing: -1 },
  estudoMetricaDesc: { flex: 1, color: '#64748B', fontSize: 12, fontFamily: fonts.body, lineHeight: 18 },
  estudoLicao: { color: '#64748B', fontSize: 13, fontFamily: fonts.body, lineHeight: 20 },
  estudoLicaoForte: { color: '#E2E8F0', fontFamily: fonts.bodyBold },

  // --- Leituras ---
  listaCaixa: {
    backgroundColor: '#0A0F1A',
    borderWidth: 1,
    borderColor: '#ffffff0D',
    borderRadius: 16,
    overflow: 'hidden',
  },
  leituraLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff0D',
  },
  linhaSemBorda: { borderBottomWidth: 0 },
  flexEspaco: { flex: 1 },
  tipoBadge: { width: 72, paddingVertical: 5, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  tipoBadgeTexto: { fontSize: 11, fontFamily: fonts.bodyBold, letterSpacing: 0.5 },
  leituraTitulo: { color: '#E2E8F0', fontSize: 15, fontFamily: fonts.bodySemiBold },
  leituraTituloMobile: { flex: 1 },
  leituraFonte: { color: '#475569', fontSize: 12, fontFamily: fonts.body, letterSpacing: 0.3 },

  // --- Em breve (APIs / Modelos sem print) ---
  emBreveCaixa: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 60,
    borderWidth: 1,
    borderColor: '#ffffff0D',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: '#0A0F1A',
  },
  emBreveTexto: { color: '#475569', fontSize: 14, fontFamily: fonts.bodySemiBold },

  // --- Estado vazio (deslogado) ---
  vazioArea: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  vazioCaixa: { maxWidth: 400, alignItems: 'center', gap: 12 },
  vazioTitulo: { color: '#94A3B8', fontSize: 16, fontFamily: fonts.bodySemiBold, textAlign: 'center' },
  vazioSub: { color: '#64748B', fontSize: 13, fontFamily: fonts.body, textAlign: 'center', lineHeight: 20 },
});
