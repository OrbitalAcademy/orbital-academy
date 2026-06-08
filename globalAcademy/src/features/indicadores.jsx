import { useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fonts } from '../styles/fonts';
import { useBreakpoint } from '../styles/breakpoint';
import { useEntradaAnimada } from '../hooks/useEntradaAnimada';
import AcessoBloqueado, { CabecalhoTela } from '../components/acessoBloqueado';
import GraficoImpacto from '../components/graficoImpacto';
import Painel from '../components/painel';
import EstadoVazioTela from '../components/estadoVazioTela';

const periodos = ['7 dias', '30 dias', 'Safra'];

const indicadores = [
  { rotulo: 'Áreas atendidas', valor: '8', unidade: 'ações', sub: 'de 24 monitoradas' },
  { rotulo: 'Perda evitada', valor: '38%', sub: 'vs. sem ação', cor: '#22C55E' },
  { rotulo: 'Tempo de decisão', valor: '2,4', unidade: 'h', sub: '−41% na safra' },
  { rotulo: 'Acerto do modelo', valor: '87%', sub: 'validado em campo', cor: '#38BDF8' },
];

const perdaSemAcao = [4, 12, 22, 34, 46, 58];
const perdaComAcao = [4, 7, 10, 12, 13, 14];
const perdaRotulosX = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
const perdaMarcasY = [0, 16, 32, 48, 64];

const distribuicao = [
  { rotulo: 'Estresse hídrico', pct: 42, cor: '#EF4444' },
  { rotulo: 'Praga', pct: 24, cor: '#F97316' },
  { rotulo: 'Doença foliar', pct: 18, cor: '#F59E0B' },
  { rotulo: 'Saudável', pct: 16, cor: '#22C55E' },
];

const funil = [
  { etapa: 'Ver', valor: 24, desc: 'talhões observados' },
  { etapa: 'Prever', valor: 24, desc: 'risco estimado' },
  { etapa: 'Validar', valor: 11, desc: 'checado em campo' },
  { etapa: 'Decidir', valor: 8, desc: 'missão criada' },
  { etapa: 'Agir', valor: 8, desc: 'plano executado' },
  { etapa: 'Medir', valor: 6, desc: 'impacto fechado' },
];
const funilMax = 24;

const resultados = [
  { area: 'A-07', risco: 'Estresse hídrico', acao: 'Irrigação prioritária', status: 'Medida', statusCor: '#22C55E', impacto: '−38%', impactoCor: '#22C55E' },
  { area: 'B-12', risco: 'Praga foliar', acao: 'Controle de praga', status: 'Execução', statusCor: '#38BDF8', impacto: '−29% proj.', impactoCor: '#22C55E' },
  { area: 'C-03', risco: 'Umidade em queda', acao: 'Sensor de umidade', status: 'Identificada', statusCor: '#F59E0B', impacto: '—', impactoCor: '#475569' },
  { area: 'E-22', risco: 'Vigor irregular', acao: 'Reinspeção 48h', status: 'Identificada', statusCor: '#F59E0B', impacto: '—', impactoCor: '#475569' },
  { area: 'F-08', risco: 'Recuperação', acao: 'Nenhuma', status: 'Estável', statusCor: '#64748B', impacto: '+6% vigor', impactoCor: '#22C55E' },
];

function CartaoIndicador({ item }) {
  return (
    <View style={estilos.cartao}>
      <Text style={estilos.cartaoRotulo}>{item.rotulo}</Text>
      <View style={estilos.cartaoValorLinha}>
        <Text style={[estilos.cartaoValor, item.cor && { color: item.cor }]}>{item.valor}</Text>
        {item.unidade ? <Text style={estilos.cartaoUnidade}>{item.unidade}</Text> : null}
      </View>
      <Text style={estilos.cartaoSub}>{item.sub}</Text>
    </View>
  );
}

function BarraDistribuicao({ item }) {
  return (
    <View style={estilos.distLinha}>
      <View style={estilos.distTopo}>
        <View style={estilos.distIdentidade}>
          <View style={[estilos.distPonto, { backgroundColor: item.cor }]} />
          <Text style={estilos.distRotulo}>{item.rotulo}</Text>
        </View>
        <Text style={estilos.distPct}>{item.pct}%</Text>
      </View>
      <View style={estilos.distTrilho}>
        <View style={[estilos.distPreenche, { width: `${item.pct}%`, backgroundColor: item.cor }]} />
      </View>
    </View>
  );
}

function LinhaFunil({ item }) {
  const largura = `${Math.max((item.valor / funilMax) * 100, 8)}%`;
  const cor = item.valor >= 20 ? '#7DD3FC' : '#38BDF8';
  return (
    <View style={estilos.funilLinha}>
      <Text style={estilos.funilEtapa}>{item.etapa}</Text>
      <View style={estilos.funilTrilho}>
        <View style={[estilos.funilPreenche, { width: largura, backgroundColor: cor }]}>
          <Text style={estilos.funilValor}>{item.valor}</Text>
        </View>
      </View>
      <Text style={estilos.funilDesc} numberOfLines={1}>{item.desc}</Text>
    </View>
  );
}

function LinhaResultado({ item, isMobile }) {
  if (isMobile) {
    return (
      <View style={estilos.resCartao}>
        <View style={estilos.resCartaoTopo}>
          <Text style={estilos.resArea}>{item.area}</Text>
          <Badge texto={item.status} cor={item.statusCor} />
        </View>
        <Text style={estilos.resRisco}>{item.risco}</Text>
        <View style={estilos.resCartaoBase}>
          <Text style={estilos.resAcao}>{item.acao}</Text>
          <Text style={[estilos.resImpacto, { color: item.impactoCor }]}>{item.impacto}</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={estilos.resLinha}>
      <Text style={[estilos.resArea, estilos.colArea]}>{item.area}</Text>
      <Text style={[estilos.resRiscoCol, estilos.colRisco]}>{item.risco}</Text>
      <Text style={[estilos.resAcaoCol, estilos.colAcao]}>{item.acao}</Text>
      <View style={estilos.resEspaco} />
      <View style={estilos.colStatus}>
        <Badge texto={item.status} cor={item.statusCor} />
      </View>
      <Text style={[estilos.resImpacto, estilos.colImpacto, { color: item.impactoCor }]}>{item.impacto}</Text>
    </View>
  );
}

function Badge({ texto, cor }) {
  return (
    <View style={[estilos.badge, { borderColor: `${cor}55`, backgroundColor: `${cor}1A` }]}>
      <Text style={[estilos.badgeTexto, { color: cor }]}>{texto}</Text>
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

function SeletorPeriodo() {
  const [ativo, setAtivo] = useState('Safra');
  return (
    <View style={estilos.seletor}>
      {periodos.map((p) => {
        const sel = p === ativo;
        return (
          <Pressable key={p} onPress={() => setAtivo(p)} style={[estilos.seletorItem, sel && estilos.seletorItemAtivo]}>
            <Text style={[estilos.seletorTexto, sel && estilos.seletorTextoAtivo]}>{p}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function CabecalhoAcoes() {
  return (
    <>
      <SeletorPeriodo />
      <View style={estilos.cicloPill}>
        <View style={estilos.cicloPonto} />
        <Text style={estilos.cicloTexto}>Ciclo ativo</Text>
      </View>
    </>
  );
}

function ConteudoComLogin({ isMobile }) {
  return (
    <ScrollView style={estilos.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={estilos.corpo}>
      <View style={[estilos.cartoes, isMobile && estilos.cartoesMobile]}>
        {indicadores.map((item) => (
          <CartaoIndicador key={item.rotulo} item={item} />
        ))}
      </View>

      <View style={[estilos.colunas, isMobile && estilos.colunasMobile]}>
        <Painel
          titulo="Perda projetada vs. perda real"
          estilo={estilos.colGrafico}
          direita={
            <View style={estilos.legendaGrafico}>
              <LegendaItem cor="#EF4444" rotulo="Sem ação" tracejado />
              <LegendaItem cor="#22C55E" rotulo="Com ação" />
            </View>
          }
        >
          <GraficoImpacto semAcao={perdaSemAcao} comAcao={perdaComAcao} rotulosX={perdaRotulosX} marcasY={perdaMarcasY} yMax={64} />
          <Text style={estilos.graficoLegenda}>
            A operação fechou a safra com <Text style={estilos.forte}>14%</Text> de perda real contra{' '}
            <Text style={estilos.forte}>58%</Text> projetada sem intervenção — <Text style={estilos.forte}>44 pontos</Text> de
            perda evitada, equivalente a ~520 ha preservados.
          </Text>
        </Painel>

        <View style={estilos.colLateral}>
          <Painel titulo="Como lemos impacto">
            <Text style={estilos.corpoTexto}>
              Impacto não é só sobre se ver dado e sim, à  <Text style={estilos.forteClaro}>perda evitada</Text> por decisão tomada
              a tempo.
            </Text>
          </Painel>

          <Painel titulo="Distribuição por tipo de risco">
            <View style={estilos.distLista}>
              {distribuicao.map((item) => (
                <BarraDistribuicao key={item.rotulo} item={item} />
              ))}
            </View>
          </Painel>
        </View>
      </View>

      <View style={[estilos.colunas, isMobile && estilos.colunasMobile]}>
        <Painel titulo="Funil do ciclo · Ver → Medir" estilo={estilos.colGrafico} direita={<Text style={estilos.painelRotuloDir}>24 → 6</Text>}>
          <View style={estilos.funilLista}>
            {funil.map((item) => (
              <LinhaFunil key={item.etapa} item={item} />
            ))}
          </View>
          <Text style={estilos.graficoLegenda}>
            O estreitamento entre <Text style={estilos.forte}>Validar</Text> e <Text style={estilos.forte}>Decidir</Text> é
            o gargalo real: ver é fácil, decidir sob recurso limitado é o que gera impacto.
          </Text>
        </Painel>

        <View style={estilos.colLateral}>
          <Painel titulo="Validações em campo">
            <View style={estilos.validacaoValor}>
              <Text style={estilos.validacaoNumero}>11</Text>
              <Text style={estilos.validacaoUnidade}>amostras pela câmera</Text>
            </View>
            <View style={estilos.validacaoTrilho}>
              <View style={[estilos.validacaoPreenche, { width: '87%' }]} />
            </View>
            <Text style={estilos.validacaoNota}>87% confirmaram a previsão do satélite</Text>
          </Painel>
        </View>
      </View>

      <Painel titulo="Resultados por área" estilo={estilos.painelResultados} direita={<Text style={estilos.painelRotuloDir}>{resultados.length} áreas</Text>}>
        {!isMobile ? (
          <View style={estilos.resCabecalho}>
            <Text style={[estilos.resCabTexto, estilos.colArea]}>Área</Text>
            <Text style={[estilos.resCabTexto, estilos.colRisco]}>Tipo de risco</Text>
            <Text style={[estilos.resCabTexto, estilos.colAcao]}>Ação tomada</Text>
            <View style={estilos.resEspaco} />
            <Text style={[estilos.resCabTexto, estilos.colStatus]}>Status</Text>
            <Text style={[estilos.resCabTexto, estilos.colImpacto]}>Impacto</Text>
          </View>
        ) : null}
        <View style={isMobile ? estilos.resListaMobile : null}>
          {resultados.map((item) => (
            <LinhaResultado key={item.area} item={item} isMobile={isMobile} />
          ))}
        </View>
      </Painel>
    </ScrollView>
  );
}

export default function Indicadores({ logado = false, aoPedirLogin, aoPedirCadastro }) {
  const { isMobile } = useBreakpoint();
  const entrada = useEntradaAnimada();

  return (
    <Animated.View style={[estilos.container, entrada]}>
      <CabecalhoTela
        pagina="indicadores"
        isMobile={isMobile}
        sub="Safra 2026.1 · Faz. Santa Bárbara"
        direita={logado && !isMobile ? <CabecalhoAcoes /> : null}
      />
      <AcessoBloqueado logado={logado} aoPedirLogin={aoPedirLogin} aoPedirCadastro={aoPedirCadastro}>
        {logado ? (
          <ConteudoComLogin isMobile={isMobile} />
        ) : (
          <EstadoVazioTela
            icone="trending-up-outline"
            titulo="Sem indicadores no período"
            sub="Faça login para ver o impacto consolidado da safra: perda evitada, funil do ciclo e resultados por área."
          />
        )}
      </AcessoBloqueado>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  corpo: { padding: 16, gap: 16 },
  painelResultados: { width: '100%', maxWidth: 720, alignSelf: 'flex-start' },

  colunas: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  colunasMobile: { flexDirection: 'column' },
  colGrafico: { flex: 1.5 },
  colLateral: { flex: 1, gap: 16, alignSelf: 'stretch' },

  cartoes: { flexDirection: 'row', gap: 16 },
  cartoesMobile: { flexWrap: 'wrap', gap: 12 },
  cartao: {
    flex: 1,
    minWidth: 120,
    backgroundColor: '#0A0F1A',
    borderWidth: 1,
    borderColor: '#ffffff0D',
    borderRadius: 16,
    padding: 18,
    gap: 6,
  },
  cartaoRotulo: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: fonts.bodyBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  cartaoValorLinha: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  cartaoValor: {
    color: '#F1F5F9',
    fontSize: 30,
    fontFamily: fonts.titleBlack,
    lineHeight: 34,
  },
  cartaoUnidade: { color: '#94A3B8', fontSize: 13, fontFamily: fonts.body, marginBottom: 4 },
  cartaoSub: { color: '#64748B', fontSize: 12, fontFamily: fonts.body },

  painelRotuloDir: {
    color: '#475569',
    fontSize: 11,
    fontFamily: fonts.bodySemiBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  corpoTexto: { color: '#94A3B8', fontSize: 14, fontFamily: fonts.body, lineHeight: 23 },
  forte: { color: '#F1F5F9', fontFamily: fonts.bodyBold },
  forteClaro: { color: '#E2E8F0', fontFamily: fonts.bodyBold },

  legendaGrafico: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  legendaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendaTraco: { width: 14, height: 3, borderRadius: 2 },
  legendaTracoTracejado: { opacity: 0.6 },
  legendaTexto: { color: '#94A3B8', fontSize: 12, fontFamily: fonts.body },
  graficoLegenda: { color: '#64748B', fontSize: 13, fontFamily: fonts.body, lineHeight: 21 },

  distLista: { gap: 16 },
  distLinha: { gap: 8 },
  distTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  distIdentidade: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  distPonto: { width: 8, height: 8, borderRadius: 4 },
  distRotulo: { color: '#E2E8F0', fontSize: 14, fontFamily: fonts.bodySemiBold },
  distPct: { color: '#94A3B8', fontSize: 13, fontFamily: fonts.bodyBold },
  distTrilho: { height: 6, borderRadius: 3, backgroundColor: '#ffffff0D', overflow: 'hidden' },
  distPreenche: { height: 6, borderRadius: 3 },

  funilLista: { gap: 10 },
  funilLinha: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  funilEtapa: { width: 56, color: '#94A3B8', fontSize: 13, fontFamily: fonts.bodySemiBold },
  funilTrilho: { flex: 1, height: 30, borderRadius: 8, backgroundColor: '#0D1117', overflow: 'hidden' },
  funilPreenche: {
    height: 30,
    borderRadius: 8,
    backgroundColor: '#0E7490',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  funilValor: { color: '#E0F2FE', fontSize: 13, fontFamily: fonts.bodyBold },
  funilDesc: { width: 120, color: '#64748B', fontSize: 12, fontFamily: fonts.body },

  validacaoValor: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  validacaoNumero: { color: '#F1F5F9', fontSize: 40, fontFamily: fonts.titleBlack, lineHeight: 44 },
  validacaoUnidade: { color: '#64748B', fontSize: 13, fontFamily: fonts.body, marginBottom: 6 },
  validacaoTrilho: { height: 6, borderRadius: 3, backgroundColor: '#ffffff0D', overflow: 'hidden' },
  validacaoPreenche: { height: 6, borderRadius: 3, backgroundColor: '#38BDF8' },
  validacaoNota: { color: '#94A3B8', fontSize: 13, fontFamily: fonts.bodySemiBold },

  resCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff0D',
  },
  resCabTexto: {
    color: '#475569',
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  colArea: { width: 60 },
  colRisco: { width: 168 },
  colAcao: { width: 176 },
  resEspaco: { width: 24 },
  colStatus: { width: 104 },
  colImpacto: { width: 110, textAlign: 'left' },
  resLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff08',
  },
  resArea: { color: '#F1F5F9', fontSize: 14, fontFamily: fonts.bodyBold },
  resRiscoCol: { color: '#E2E8F0', fontSize: 14, fontFamily: fonts.body },
  resAcaoCol: { color: '#94A3B8', fontSize: 14, fontFamily: fonts.body },
  resImpacto: { fontSize: 14, fontFamily: fonts.bodySemiBold },

  resListaMobile: { gap: 12 },
  resCartao: {
    gap: 8,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#0D1117',
    borderWidth: 1,
    borderColor: '#ffffff08',
  },
  resCartaoTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resCartaoBase: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resRisco: { color: '#E2E8F0', fontSize: 14, fontFamily: fonts.bodySemiBold },
  resAcao: { color: '#94A3B8', fontSize: 13, fontFamily: fonts.body },

  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 100,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeTexto: { fontSize: 12, fontFamily: fonts.bodySemiBold },

  seletor: {
    flexDirection: 'row',
    backgroundColor: '#0D1117',
    borderWidth: 1,
    borderColor: '#ffffff15',
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  seletorItem: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 7 },
  seletorItemAtivo: { backgroundColor: '#1E293B' },
  seletorTexto: { color: '#64748B', fontSize: 12, fontFamily: fonts.bodySemiBold },
  seletorTextoAtivo: { color: '#F1F5F9' },
  cicloPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: '#ffffff15',
    borderRadius: 100,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  cicloPonto: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  cicloTexto: { color: '#94A3B8', fontSize: 13, fontFamily: fonts.bodySemiBold },
});
