import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../styles/fonts';
import { useBreakpoint } from '../styles/breakpoint';
import AcessoBloqueado, { CabecalhoTela } from '../components/acessoBloqueado';
import GraficoPrevisao from '../components/graficoPrevisao';
import BotaoDesativado from '../components/botaoDesativado';

const CORES_RISCO = {
  alto: '#EF4444',
  medio: '#F59E0B',
  baixo: '#22C55E',
};

const briefingMetricas = [
  { rotulo: 'NDVI', valor: '0,38', sub: '↓ -27% em 4d', cor: '#EF4444' },
  { rotulo: 'Umidade do solo', valor: '18%', sub: 'déficit severo' },
  { rotulo: 'Temp. superfície', valor: '41°C', sub: '+4°C vs. média', cor: '#EF4444' },
  { rotulo: 'Confiança do modelo', valor: '0,91', sub: 'validado em campo' },
];

const previsaoObservado = [
  { d: -4, v: 0.52 }, { d: -3, v: 0.47 }, { d: -2, v: 0.43 }, { d: -1, v: 0.4 }, { d: 0, v: 0.38 },
];
const previsaoSemAcao = [
  { d: 0, v: 0.38 }, { d: 1, v: 0.36 }, { d: 2, v: 0.34 }, { d: 3, v: 0.325 },
  { d: 4, v: 0.31 }, { d: 5, v: 0.295 }, { d: 6, v: 0.24 }, { d: 7, v: 0.16 },
];
const previsaoComAcao = [
  { d: 0, v: 0.38 }, { d: 1, v: 0.4 }, { d: 2, v: 0.43 }, { d: 3, v: 0.47 },
  { d: 4, v: 0.51 }, { d: 5, v: 0.55 }, { d: 6, v: 0.58 }, { d: 7, v: 0.6 },
];

const recursos = [
  { icone: 'people-outline', titulo: 'Equipe de campo', detalhe: '2 agrônomos' },
  { icone: 'car-outline', titulo: 'Caminhão-pipa', detalhe: '1 unidade · 12 m³' },
  { icone: 'time-outline', titulo: 'Janela de ação', detalhe: 'Hoje · 6h úteis' },
  { icone: 'cash-outline', titulo: 'Orçamento', detalhe: 'R$ 4.000' },
];

const criterios = [
  { texto: 'Validação em campo confirmada', ok: true },
  { texto: 'NDVI ≥ 0,45 em 14 dias', ok: false },
  { texto: 'Umidade do solo ≥ 30%', ok: false },
  { texto: 'Custo dentro do orçamento', ok: false },
];

const otimizacaoChips = ['1 equipe', '6h úteis', '1 caminhão-pipa', 'R$ 4.000'];
const otimizacao = [
  { codigo: 'A-07', nivel: 'alto', label: 'Irrigação prioritária', impacto: 0.86, custo: 'R$ 2,4k', horas: '4h', recomendado: true },
  { codigo: 'B-12', nivel: 'alto', label: 'Controle de praga', impacto: 0.74, custo: 'R$ 3,1k', horas: '5h' },
  { codigo: 'C-03', nivel: 'medio', label: 'Sensor de umidade', impacto: 0.41, custo: 'R$ 0,8k', horas: '2h' },
];

const ciclo = [
  { titulo: 'Identificada', sub: 'satélite · ML', estado: 'feito' },
  { titulo: 'Validada', sub: 'câmera de campo', estado: 'feito' },
  { titulo: 'Execução', sub: 'plano aplicado', estado: 'atual', num: 3 },
  { titulo: 'Medida', sub: 'impacto · 14d', estado: 'futuro', num: 4 },
];

function Painel({ titulo, direita, children, estilo }) {
  const { isMobile } = useBreakpoint();
  return (
    <View style={[estilos.painel, estilo]}>
      <View style={[estilos.painelCabecalho, isMobile && direita && estilos.painelCabecalhoMobile]}>
        <Text style={estilos.painelTitulo}>{titulo}</Text>
        {direita}
      </View>
      <View style={estilos.painelCorpo}>{children}</View>
    </View>
  );
}

function CartaoMetrica({ item }) {
  const { isMobile } = useBreakpoint();
  return (
    <View style={[estilos.metricaCartao, isMobile && estilos.metricaCartaoMobile]}>
      <Text style={estilos.metricaRotulo}>{item.rotulo}</Text>
      <Text style={[estilos.metricaValor, item.cor && { color: item.cor }]}>{item.valor}</Text>
      <Text style={estilos.metricaSub}>{item.sub}</Text>
    </View>
  );
}

function LinhaRecurso({ item }) {
  return (
    <View style={estilos.recursoLinha}>
      <View style={estilos.recursoIcone}>
        <Ionicons name={item.icone} size={18} color="#38BDF8" />
      </View>
      <View style={estilos.recursoTextos}>
        <Text style={estilos.recursoTitulo}>{item.titulo}</Text>
        <Text style={estilos.recursoDetalhe}>{item.detalhe}</Text>
      </View>
    </View>
  );
}

function LinhaCriterio({ item }) {
  return (
    <View style={estilos.criterioLinha}>
      <View style={[estilos.criterioCaixa, item.ok && estilos.criterioCaixaOk]}>
        {item.ok ? <Ionicons name="checkmark" size={13} color="#050810" /> : null}
      </View>
      <Text style={[estilos.criterioTexto, item.ok && estilos.criterioTextoOk]}>{item.texto}</Text>
    </View>
  );
}

function LinhaOtimizacao({ item }) {
  const cor = CORES_RISCO[item.nivel];
  return (
    <View style={estilos.otimLinha}>
      <View style={estilos.otimTopo}>
        <View style={estilos.otimIdentidade}>
          <View style={[estilos.otimPonto, { backgroundColor: cor }]} />
          <Text style={estilos.otimCodigo}>{item.codigo}</Text>
          <Text style={estilos.otimLabel} numberOfLines={1}>{item.label}</Text>
        </View>
        {item.recomendado ? (
          <View style={estilos.badgeRecomendado}>
            <Text style={estilos.badgeRecomendadoTexto}>RECOMENDADO</Text>
          </View>
        ) : null}
      </View>
      <View style={estilos.otimBase}>
        <View style={estilos.otimBarraTrilho}>
          <View style={[estilos.otimBarraPreenche, { width: `${item.impacto * 100}%`, backgroundColor: cor }]} />
        </View>
        <View style={estilos.otimNumeros}>
          <Text style={estilos.otimImpacto}>impacto {item.impacto.toFixed(2)}</Text>
          <Text style={estilos.otimCusto}>{item.custo} · {item.horas}</Text>
        </View>
      </View>
    </View>
  );
}

function PassoCiclo({ item, ultimo }) {
  const feito = item.estado === 'feito';
  const atual = item.estado === 'atual';
  return (
    <View style={estilos.passo}>
      <View style={estilos.passoTrilha}>
        <View style={[estilos.passoCirculo, feito && estilos.passoFeito, atual && estilos.passoAtual]}>
          {feito ? (
            <Ionicons name="checkmark" size={13} color="#050810" />
          ) : (
            <Text style={[estilos.passoNum, atual && estilos.passoNumAtual]}>{item.num}</Text>
          )}
        </View>
        {!ultimo ? <View style={estilos.passoLinha} /> : null}
      </View>
      <View style={estilos.passoTextos}>
        <View style={estilos.passoTituloLinha}>
          <Text style={[estilos.passoTitulo, !feito && !atual && estilos.passoTituloFuturo]}>{item.titulo}</Text>
          {atual ? (
            <View style={estilos.badgeAtual}>
              <Text style={estilos.badgeAtualTexto}>ATUAL</Text>
            </View>
          ) : null}
        </View>
        <Text style={estilos.passoSub}>{item.sub}</Text>
      </View>
    </View>
  );
}

function ConteudoComLogin({ isMobile }) {
  const colunaEsquerda = (
    <View style={estilos.colunaEsquerda}>
      <Painel titulo="Briefing da missão" direita={<Text style={estilos.painelRotuloDir}>A-07 · 21.2°S 48.3°W</Text>}>
        <Text style={estilos.briefingTexto}>
          Conter a perda por <Text style={estilos.briefingForte}>déficit hídrico</Text> no talhão A-07 antes que o
          NDVI cruze o limite crítico de 0,30. {'\n'}Previsto para os próximos 5 dias sem intervenção.
        </Text>
        <View style={[estilos.metricas, isMobile && estilos.metricasMobile]}>
          {briefingMetricas.map((item) => (
            <CartaoMetrica key={item.rotulo} item={item} />
          ))}
        </View>
      </Painel>

      <Painel
        titulo="Previsão de risco · NDVI · 7 dias"
        direita={
          <View style={estilos.legendaGrafico}>
            <LegendaItem cor="#38BDF8" rotulo="Observado" />
            <LegendaItem cor="#EF4444" rotulo="Sem ação" tracejado />
            <LegendaItem cor="#22C55E" rotulo="Com ação" />
          </View>
        }
      >
        <GraficoPrevisao observado={previsaoObservado} semAcao={previsaoSemAcao} comAcao={previsaoComAcao} />
        <Text style={estilos.graficoLegenda}>
          Sem ação, o NDVI cruza o limite crítico em <Text style={estilos.briefingForte}>~5 dias</Text> e a perda
          projetada chega a <Text style={estilos.briefingForte}>38%</Text>. Com a irrigação prioritária, a tendência
          se inverte e a vegetação recupera vigor em 14 dias.
        </Text>
      </Painel>

      <Painel titulo="Otimização de recursos" direita={<Text style={estilos.painelRotuloDir}>impacto + esforço</Text>}>
        <View style={estilos.otimChips}>
          {otimizacaoChips.map((chip) => (
            <View key={chip} style={estilos.chip}>
              <Text style={estilos.chipTexto}>{chip}</Text>
            </View>
          ))}
        </View>
        <View style={estilos.otimLista}>
          {otimizacao.map((item) => (
            <LinhaOtimizacao key={item.codigo} item={item} />
          ))}
        </View>
        <View style={[estilos.aplicarLinha, isMobile && estilos.aplicarLinhaMobile]}>
          <BotaoDesativado estilo={estilos.btnAplicar} texto="Botão desativado no momento">
            <Ionicons name="arrow-forward" size={16} color="#050810" />
            <Text style={estilos.btnAplicarTexto}>Aplicar plano recomendado</Text>
          </BotaoDesativado>
          <Text style={estilos.aplicarNota}>Aloca a equipe ao talhão A-07 e marca a missão como executada.</Text>
        </View>
      </Painel>
    </View>
  );

  const colunaDireita = (
    <View style={estilos.colunaDireita}>
      <Painel titulo="Por que esta missão">
        <Text style={estilos.corpoTexto}>
          O satélite previu o risco e a câmera confirmou em campo. Agora é a hora da{' '}
          <Text style={estilos.corpoDestaque}>decisão</Text>. {'\n'}Alocar recurso limitado onde o impacto é maior e
          medir o resultado.
        </Text>
      </Painel>

      <Painel titulo="Recursos disponíveis">
        <View style={estilos.recursoLista}>
          {recursos.map((item) => (
            <LinhaRecurso key={item.titulo} item={item} />
          ))}
        </View>
      </Painel>

      <Painel titulo="Critérios de sucesso">
        <View style={estilos.criterioLista}>
          {criterios.map((item) => (
            <LinhaCriterio key={item.texto} item={item} />
          ))}
        </View>
      </Painel>

      <Painel titulo="Ciclo da missão">
        <View style={estilos.cicloLista}>
          {ciclo.map((item, i) => (
            <PassoCiclo key={item.titulo} item={item} ultimo={i === ciclo.length - 1} />
          ))}
        </View>
      </Painel>
    </View>
  );

  return (
    <ScrollView style={estilos.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={estilos.corpo}>
      <View style={[estilos.layout, isMobile && estilos.layoutMobile]}>
        {colunaEsquerda}
        {colunaDireita}
      </View>
    </ScrollView>
  );
}

function ConteudoVazio() {
  return (
    <View style={estilos.vazioArea}>
      <View style={estilos.vazioCaixa}>
        <Ionicons name="settings-outline" size={34} color="#334155" />
        <Text style={estilos.vazioTitulo}>Nenhuma missão selecionada</Text>
        <Text style={estilos.vazioSub}>Faça login e escolha uma área no Console para abrir o detalhe da missão.</Text>
      </View>
    </View>
  );
}

function LegendaItem({ cor, rotulo, tracejado }) {
  return (
    <View style={estilos.legendaItem}>
      <View style={[estilos.legendaTraco, { backgroundColor: cor }, tracejado && estilos.legendaTracoTracejado]} />
      <Text style={estilos.legendaTexto}>{rotulo}</Text>
    </View>
  );
}

export default function Missao({ logado = false, aoPedirLogin, aoPedirCadastro }) {
  const { isMobile } = useBreakpoint();

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
      <CabecalhoTela pagina="missao" isMobile={isMobile} />
      <AcessoBloqueado logado={logado} aoPedirLogin={aoPedirLogin} aoPedirCadastro={aoPedirCadastro}>
        {logado ? <ConteudoComLogin isMobile={isMobile} /> : <ConteudoVazio />}
      </AcessoBloqueado>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  corpo: { padding: 16 },
  layout: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  layoutMobile: { flexDirection: 'column' },
  colunaEsquerda: { flex: 1.7, gap: 16 },
  colunaDireita: { flex: 1, gap: 16, alignSelf: 'stretch' },

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
  painelRotuloDir: {
    color: '#475569',
    fontSize: 11,
    fontFamily: fonts.bodySemiBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  painelCorpo: { padding: 18, gap: 18 },
  corpoTexto: {
    color: '#94A3B8',
    fontSize: 14,
    fontFamily: fonts.body,
    lineHeight: 23,
  },
  corpoDestaque: {
    color: '#E2E8F0',
    fontFamily: fonts.bodyBold,
    fontStyle: 'italic',
  },

  briefingTexto: {
    color: '#E2E8F0',
    fontSize: 17,
    fontFamily: fonts.body,
    lineHeight: 27,
  },
  briefingForte: {
    color: '#F1F5F9',
    fontFamily: fonts.bodyBold,
  },
  metricas: { flexDirection: 'row', gap: 12 },
  metricasMobile: { flexWrap: 'wrap', gap: 10 },
  metricaCartao: {
    flex: 1,
    minWidth: 120,
    gap: 5,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#0D1117',
    borderWidth: 1,
    borderColor: '#ffffff08',
  },
  metricaCartaoMobile: {
    flex: 0,
    flexGrow: 1,
    flexBasis: '47%',
    minWidth: 0,
  },
  metricaRotulo: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: fonts.bodyBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  metricaValor: {
    color: '#F1F5F9',
    fontSize: 26,
    fontFamily: fonts.titleBlack,
    lineHeight: 30,
  },
  metricaSub: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: fonts.body,
  },

  legendaGrafico: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  legendaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendaTraco: { width: 14, height: 3, borderRadius: 2 },
  legendaTracoTracejado: { opacity: 0.6 },
  legendaTexto: { color: '#94A3B8', fontSize: 12, fontFamily: fonts.body },
  graficoLegenda: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: fonts.body,
    lineHeight: 21,
  },

  otimChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffffff15',
    backgroundColor: '#0D1117',
  },
  chipTexto: { color: '#94A3B8', fontSize: 12, fontFamily: fonts.bodySemiBold },
  otimLista: { gap: 16 },
  otimLinha: {
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#0D1117',
    borderWidth: 1,
    borderColor: '#ffffff08',
  },
  otimTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  otimIdentidade: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  otimPonto: { width: 8, height: 8, borderRadius: 4 },
  otimCodigo: { color: '#F1F5F9', fontSize: 14, fontFamily: fonts.bodyBold },
  otimLabel: { flex: 1, color: '#94A3B8', fontSize: 13, fontFamily: fonts.body },
  badgeRecomendado: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#22C55E40',
    backgroundColor: '#22C55E1A',
  },
  badgeRecomendadoTexto: {
    color: '#22C55E',
    fontSize: 10,
    fontFamily: fonts.bodyBold,
    letterSpacing: 0.8,
  },
  otimBase: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  otimBarraTrilho: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff0D',
    overflow: 'hidden',
  },
  otimBarraPreenche: { height: 8, borderRadius: 4 },
  otimNumeros: { alignItems: 'flex-end', gap: 2, minWidth: 110 },
  otimImpacto: { color: '#E2E8F0', fontSize: 13, fontFamily: fonts.bodySemiBold },
  otimCusto: { color: '#64748B', fontSize: 12, fontFamily: fonts.body },

  aplicarLinha: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  aplicarLinhaMobile: { flexDirection: 'column', alignItems: 'stretch', gap: 10 },
  btnAplicar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#38BDF8',
  },
  btnAplicarTexto: { color: '#050810', fontSize: 14, fontFamily: fonts.bodyBold },
  aplicarNota: { flex: 1, color: '#64748B', fontSize: 13, fontFamily: fonts.body },

  recursoLista: { gap: 4 },
  recursoLinha: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  recursoIcone: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#38BDF830',
    backgroundColor: '#38BDF810',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recursoTextos: { flex: 1, gap: 2 },
  recursoTitulo: { color: '#64748B', fontSize: 12, fontFamily: fonts.body },
  recursoDetalhe: { color: '#E2E8F0', fontSize: 14, fontFamily: fonts.bodySemiBold },

  criterioLista: { gap: 14 },
  criterioLinha: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  criterioCaixa: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  criterioCaixaOk: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  criterioTexto: { flex: 1, color: '#94A3B8', fontSize: 14, fontFamily: fonts.body },
  criterioTextoOk: { color: '#E2E8F0', fontFamily: fonts.bodySemiBold },

  cicloLista: { gap: 0 },
  passo: { flexDirection: 'row', gap: 14 },
  passoTrilha: { alignItems: 'center', width: 26 },
  passoCirculo: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0F1A',
  },
  passoFeito: { backgroundColor: '#22C55E', borderColor: '#22C55E' },
  passoAtual: { borderColor: '#38BDF8' },
  passoNum: { color: '#475569', fontSize: 12, fontFamily: fonts.bodyBold },
  passoNumAtual: { color: '#38BDF8' },
  passoLinha: { flex: 1, width: 1.5, backgroundColor: '#ffffff12', marginVertical: 2 },
  passoTextos: { flex: 1, paddingBottom: 22, gap: 2 },
  passoTituloLinha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  passoTitulo: { color: '#E2E8F0', fontSize: 14, fontFamily: fonts.bodyBold },
  passoTituloFuturo: { color: '#64748B' },
  badgeAtual: {
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#38BDF840',
    backgroundColor: '#38BDF81A',
  },
  badgeAtualTexto: { color: '#38BDF8', fontSize: 10, fontFamily: fonts.bodyBold, letterSpacing: 0.8 },
  passoSub: { color: '#64748B', fontSize: 12, fontFamily: fonts.body },

  vazioArea: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  vazioCaixa: { maxWidth: 360, alignItems: 'center', gap: 12 },
  vazioTitulo: {
    color: '#94A3B8',
    fontSize: 16,
    fontFamily: fonts.bodySemiBold,
    textAlign: 'center',
  },
  vazioSub: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: fonts.body,
    textAlign: 'center',
    lineHeight: 20,
  },
});
