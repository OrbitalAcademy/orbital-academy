import { useMemo, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../styles/fonts';
import { useBreakpoint } from '../styles/breakpoint';
import { useEntradaAnimada } from '../hooks/useEntradaAnimada';
import AcessoBloqueado, { CabecalhoTela } from '../components/acessoBloqueado';
import MapaRisco from '../components/mapaRisco';
import BotaoDesativado from '../components/botaoDesativado';
import { CORES_RISCO } from '../styles/cores';

const niveisRisco = [
  { chave: 'alto', rotulo: 'Alto', cor: CORES_RISCO.alto },
  { chave: 'medio', rotulo: 'Médio', cor: CORES_RISCO.medio },
  { chave: 'baixo', rotulo: 'Baixo', cor: CORES_RISCO.baixo },
];

const filtrosRanking = [
  { chave: 'todas', rotulo: 'Todas' },
  { chave: 'alto', rotulo: 'Alto' },
  { chave: 'medio', rotulo: 'Médio' },
  { chave: 'baixo', rotulo: 'Baixo' },
];

const talhoes = [
  {
    codigo: 'A-07', nivel: 'alto', score: 0.91, motivo: 'Estresse hídrico',
    ndvi: 0.38, solo: 18, area: 142, passagem: 'há 2h', tendencia: 'subindo',
    poligono: [[220, 0], [410, 0], [420, 235], [215, 250]], centro: [315, 120],
  },
  {
    codigo: 'B-12', nivel: 'alto', score: 0.84, motivo: 'Anomalia foliar · praga',
    ndvi: 0.44, solo: 27, area: 98, passagem: 'há 2h', tendencia: 'subindo',
    poligono: [[410, 0], [600, 0], [600, 210], [420, 235]], centro: [500, 115],
  },
  {
    codigo: 'C-03', nivel: 'medio', score: 0.62, motivo: 'Umidade do solo em queda',
    ndvi: 0.57, solo: 31, area: 76, passagem: 'há 6h', tendencia: 'subindo',
    poligono: [[0, 0], [220, 0], [215, 250], [0, 230]], centro: [110, 120],
  },
  {
    codigo: 'E-22', nivel: 'medio', score: 0.55, motivo: 'Vigor irregular',
    ndvi: 0.59, solo: 33, area: 64, passagem: 'há 6h', tendencia: 'estavel',
    poligono: [[215, 250], [420, 235], [440, 460], [190, 460]], centro: [315, 350],
  },
  {
    codigo: 'F-08', nivel: 'baixo', score: 0.28, motivo: 'Em recuperação',
    ndvi: 0.74, solo: 48, area: 88, passagem: 'há 1d', tendencia: 'descendo',
    poligono: [[420, 235], [600, 210], [600, 460], [440, 460]], centro: [505, 345],
  },
  {
    codigo: 'D-19', nivel: 'baixo', score: 0.22, motivo: 'Dentro do esperado',
    ndvi: 0.78, solo: 46, area: 120, passagem: 'há 1d', tendencia: 'estavel',
    poligono: [[0, 230], [215, 250], [190, 460], [0, 460]], centro: [105, 350],
  },
];

const indicadores = [
  { rotulo: 'Áreas monitoradas', valor: '24', unidade: 'talhões', sub: 'Faz. Santa Bárbara · SP' },
  { rotulo: 'Risco alto', valor: '2', unidade: 'áreas', sub: '+1 nas últimas 24h', cor: CORES_RISCO.alto },
  { rotulo: 'Hectares cobertos', valor: '1.240', unidade: 'ha', sub: 'Cana-de-açúcar + soja' },
  { rotulo: 'Próxima passagem', valor: '4h 12min', sub: 'Sentinel-2 · 14h20', cor: '#38BDF8' },
];

const missoes = [
  { codigo: 'A-07', titulo: 'Estresse hídrico', detalhe: '142 ha · prioridade 1', status: 'Execução', cor: '#38BDF8' },
  { codigo: 'B-12', titulo: 'Praga foliar', detalhe: '98 ha · aguarda equipe', status: 'Validada', cor: '#22C55E' },
  { codigo: 'C-03', titulo: 'Monitoramento', detalhe: '76 ha · sem ação ainda', status: 'Identificada', cor: '#F59E0B' },
];

const iconeTendencia = {
  subindo: 'arrow-up',
  estavel: 'remove',
  descendo: 'arrow-down',
};

function EstadoVazio({ icone, titulo, subtitulo, grande = false, estilo }) {
  return (
    <View style={[estilos.vazio, estilo]}>
      <Ionicons name={icone} size={grande ? 40 : 30} color="#334155" />
      <Text style={[estilos.vazioTitulo, grande && estilos.vazioTituloGrande]}>{titulo}</Text>
      {subtitulo ? <Text style={estilos.vazioSubtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

function Painel({ titulo, subtitulo, direita, children, estilo, corpoEstilo }) {
  return (
    <View style={[estilos.painel, estilo]}>
      <View style={estilos.painelCabecalho}>
        <View style={estilos.painelTituloGrupo}>
          <Text style={estilos.painelTitulo}>{titulo}</Text>
          {subtitulo ? <Text style={estilos.painelSubtitulo}>{subtitulo}</Text> : null}
        </View>
        {direita}
      </View>
      <View style={[estilos.painelCorpo, corpoEstilo]}>{children}</View>
    </View>
  );
}

function LegendaRisco() {
  return (
    <View style={estilos.legenda}>
      {niveisRisco.map((nivel) => (
        <View key={nivel.chave} style={estilos.legendaItem}>
          <View style={[estilos.legendaPonto, { backgroundColor: nivel.cor }]} />
          <Text style={estilos.legendaTexto}>{nivel.rotulo}</Text>
        </View>
      ))}
    </View>
  );
}

function Contagem({ texto }) {
  return <Text style={estilos.contagem}>{texto}</Text>;
}

function CartaoIndicador({ item }) {
  return (
    <View style={estilos.indicadorCartao}>
      <Text style={estilos.indicadorRotulo}>{item.rotulo}</Text>
      <View style={estilos.indicadorValorLinha}>
        <Text style={[estilos.indicadorValor, item.cor && { color: item.cor }]}>{item.valor}</Text>
        {item.unidade ? <Text style={estilos.indicadorUnidade}>{item.unidade}</Text> : null}
      </View>
      <Text style={estilos.indicadorSub}>{item.sub}</Text>
    </View>
  );
}

function BarraIndicadores({ isMobile }) {
  return (
    <View style={[estilos.barraStatus, isMobile && estilos.barraStatusMobile]}>
      {indicadores.map((item) => (
        <CartaoIndicador key={item.rotulo} item={item} />
      ))}
    </View>
  );
}

function LinhaRanking({ talhao }) {
  const cor = CORES_RISCO[talhao.nivel];
  return (
    <View style={estilos.rankingLinha}>
      <View style={estilos.rankingTopo}>
        <View style={estilos.rankingIdentidade}>
          <View style={[estilos.rankingPonto, { backgroundColor: cor }]} />
          <Text style={estilos.rankingCodigo}>Área {talhao.codigo}</Text>
          <Text style={estilos.rankingMotivo} numberOfLines={1}>{talhao.motivo}</Text>
        </View>
        <View style={estilos.rankingScoreGrupo}>
          <View style={[estilos.scorePill, { backgroundColor: `${cor}1A`, borderColor: `${cor}55` }]}>
            <Text style={[estilos.scoreTexto, { color: cor }]}>{talhao.score.toFixed(2)}</Text>
          </View>
          <Ionicons name={iconeTendencia[talhao.tendencia]} size={13} color={cor} />
        </View>
      </View>

      <View style={estilos.rankingMetricas}>
        <Text style={estilos.metricaTexto}>
          <Text style={estilos.metricaRotulo}>NDVI </Text>{talhao.ndvi.toFixed(2)}
        </Text>
        <Text style={estilos.metricaDivisor}>·</Text>
        <Text style={estilos.metricaTexto}>
          <Text style={estilos.metricaRotulo}>SOLO </Text>{talhao.solo}%
        </Text>
        <Text style={estilos.metricaDivisor}>·</Text>
        <Text style={estilos.metricaTexto}>
          <Text style={estilos.metricaRotulo}>ÁREA </Text>{talhao.area} ha
        </Text>
      </View>
      <Text style={estilos.metricaTexto}>
        <Text style={estilos.metricaRotulo}>PASSAGEM </Text>{talhao.passagem}
      </Text>
    </View>
  );
}

function LinhaMissao({ missao }) {
  return (
    <View style={estilos.missaoLinha}>
      <View style={estilos.missaoInfo}>
        <Text style={estilos.missaoTitulo} numberOfLines={1}>
          <Text style={estilos.missaoCodigo}>{missao.codigo}</Text>
          {`  ·  ${missao.titulo}`}
        </Text>
        <Text style={estilos.missaoDetalhe}>{missao.detalhe}</Text>
      </View>
      <View style={[estilos.statusBadge, { backgroundColor: `${missao.cor}1A`, borderColor: `${missao.cor}55` }]}>
        <Text style={[estilos.statusTexto, { color: missao.cor }]}>{missao.status}</Text>
      </View>
    </View>
  );
}

function HeaderAcoes() {
  return (
    <>
      <View style={estilos.acaoPill}>
        <View style={estilos.acaoPonto} />
        <Text style={estilos.acaoTexto}>Satélite ativo</Text>
      </View>
      <View style={estilos.acaoPill}>
        <Text style={estilos.acaoFonte}>NASA</Text>
        <Text style={estilos.acaoTexto}> / INPE</Text>
      </View>
      <BotaoDesativado estilo={estilos.acaoBtn} texto="Botão desativado no momento" posicao="baixo">
        <Ionicons name="remove-outline" size={18} color="#94A3B8" />
      </BotaoDesativado>
    </>
  );
}

function PainelRankingCheio() {
  const [filtro, setFiltro] = useState('todas');
  const [busca, setBusca] = useState('');

  const listaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return talhoes.filter((talhao) => {
      const passaFiltro = filtro === 'todas' || talhao.nivel === filtro;
      const passaBusca =
        termo === '' ||
        talhao.codigo.toLowerCase().includes(termo) ||
        talhao.motivo.toLowerCase().includes(termo);
      return passaFiltro && passaBusca;
    });
  }, [filtro, busca]);

  return (
    <Painel titulo="Ranking de áreas" direita={<Contagem texto={`${talhoes.length} áreas · por risco`} />}>
      <View style={estilos.filtros}>
        {filtrosRanking.map((item) => {
          const ativo = item.chave === filtro;
          return (
            <Pressable
              key={item.chave}
              onPress={() => setFiltro(item.chave)}
              style={[estilos.filtroPill, ativo && estilos.filtroPillAtivo]}
            >
              <Text style={[estilos.filtroTexto, ativo && estilos.filtroTextoAtivo]}>{item.rotulo}</Text>
            </Pressable>
          );
        })}
        <View style={estilos.buscaCampo}>
          <Ionicons name="search-outline" size={15} color="#64748B" />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar"
            placeholderTextColor="#475569"
            style={estilos.buscaInput}
          />
        </View>
      </View>

      {listaFiltrada.length > 0 ? (
        <View style={estilos.rankingLista}>
          {listaFiltrada.map((talhao) => (
            <LinhaRanking key={talhao.codigo} talhao={talhao} />
          ))}
        </View>
      ) : (
        <EstadoVazio icone="search-outline" titulo="Nenhuma área para este filtro" estilo={estilos.vazioCaixa} />
      )}
    </Painel>
  );
}

function PainelMissoesCheio() {
  return (
    <Painel titulo="Missões hoje" direita={<Contagem texto={`${missoes.length} missões`} />}>
      <View style={estilos.missaoLista}>
        {missoes.map((missao) => (
          <LinhaMissao key={missao.codigo} missao={missao} />
        ))}
      </View>
    </Painel>
  );
}

function ConteudoComLogin({ isMobile }) {
  const mapa = (
    <Painel
      titulo="Mapa de risco"
      subtitulo="Lavoura · SP · NDVI"
      direita={<LegendaRisco />}
      estilo={[estilos.painelMapa, isMobile && estilos.painelMapaMobile]}
      corpoEstilo={estilos.painelMapaCorpo}
    >
      <MapaRisco talhoes={talhoes} />
    </Painel>
  );

  return (
    <ScrollView style={estilos.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={estilos.corpoCheio}>
      <BarraIndicadores isMobile={isMobile} />
      {isMobile ? (
        <View style={estilos.corpoMobile}>
          {mapa}
          <PainelRankingCheio />
          <PainelMissoesCheio />
        </View>
      ) : (
        <View style={estilos.corpo}>
          {mapa}
          <View style={estilos.coluna}>
            <PainelRankingCheio />
            <PainelMissoesCheio />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function ConteudoVazio({ isMobile }) {
  const mapaVazio = (
    <Painel
      titulo="Mapa de risco"
      direita={<LegendaRisco />}
      estilo={[estilos.painelMapa, isMobile && estilos.painelMapaMobile]}
    >
      <EstadoVazio
        grande
        icone="map-outline"
        titulo="Nenhuma área carregada"
        subtitulo="Selecione uma missão para visualizar o mapa"
      />
    </Painel>
  );

  const rankingVazio = (
    <Painel titulo="Ranking de áreas" direita={<Contagem texto="0 áreas" />}>
      <EstadoVazio icone="search-outline" titulo={'Nenhuma área\nidentificada ainda'} estilo={estilos.vazioCaixa} />
    </Painel>
  );

  const missoesVazio = (
    <Painel titulo="Missões hoje" direita={<Contagem texto="0 missões" />}>
      <EstadoVazio icone="navigate-outline" titulo={'Nenhuma missão\ncriada para hoje'} estilo={estilos.vazioCaixa} />
    </Painel>
  );

  if (isMobile) {
    return (
      <ScrollView style={estilos.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={estilos.corpoMobile}>
        {mapaVazio}
        {rankingVazio}
        {missoesVazio}
      </ScrollView>
    );
  }

  return (
    <View style={estilos.corpo}>
      {mapaVazio}
      <View style={estilos.coluna}>
        {rankingVazio}
        {missoesVazio}
      </View>
    </View>
  );
}

export default function Console({ logado = false, aoPedirLogin, aoPedirCadastro }) {
  const { isMobile } = useBreakpoint();
  const entrada = useEntradaAnimada();

  return (
    <Animated.View style={[estilos.container, entrada]}>
      <CabecalhoTela
        pagina="console"
        isMobile={isMobile}
        direita={logado && !isMobile ? <HeaderAcoes /> : null}
      />

      <AcessoBloqueado logado={logado} aoPedirLogin={aoPedirLogin} aoPedirCadastro={aoPedirCadastro}>
        {logado ? <ConteudoComLogin isMobile={isMobile} /> : <ConteudoVazio isMobile={isMobile} />}
      </AcessoBloqueado>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },

  corpo: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  corpoCheio: {
    gap: 16,
    paddingTop: 4,
  },
  corpoMobile: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16,
  },
  painelMapa: {
    flex: 1.4,
    minHeight: 460,
  },
  painelMapaMobile: {
    height: 360,
    minHeight: 0,
  },
  painelMapaCorpo: {
    padding: 12,
  },
  coluna: {
    flex: 1,
    gap: 16,
    alignSelf: 'flex-start',
  },

  barraStatus: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
  },
  barraStatusMobile: {
    flexWrap: 'wrap',
  },
  indicadorCartao: {
    flex: 1,
    minWidth: 150,
    gap: 6,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ffffff0D',
    backgroundColor: '#0A0F1A',
  },
  indicadorRotulo: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: fonts.bodyBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  indicadorValorLinha: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  indicadorValor: {
    color: '#F1F5F9',
    fontSize: 30,
    fontFamily: fonts.titleBlack,
    lineHeight: 34,
  },
  indicadorUnidade: {
    color: '#94A3B8',
    fontSize: 13,
    fontFamily: fonts.body,
    marginBottom: 4,
  },
  indicadorSub: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: fonts.body,
  },

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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff0D',
  },
  painelTituloGrupo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  painelTitulo: {
    color: '#E2E8F0',
    fontSize: 16,
    fontFamily: fonts.titleBold,
  },
  painelSubtitulo: {
    color: '#475569',
    fontSize: 12,
    fontFamily: fonts.body,
  },
  painelCorpo: {
    flex: 1,
    padding: 16,
    gap: 14,
  },
  contagem: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: fonts.body,
  },

  legenda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendaPonto: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendaTexto: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: fonts.body,
  },

  filtros: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  filtroPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ffffff15',
  },
  filtroPillAtivo: {
    backgroundColor: '#ffffff0A',
    borderColor: '#ffffff25',
  },
  filtroTexto: {
    color: '#94A3B8',
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
  },
  filtroTextoAtivo: {
    color: '#F1F5F9',
  },
  buscaCampo: {
    flex: 1,
    minWidth: 110,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ffffff15',
  },
  buscaInput: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 13,
    fontFamily: fonts.body,
    outlineStyle: 'none',
  },

  rankingLista: {
    gap: 2,
  },
  rankingLinha: {
    gap: 6,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff08',
  },
  rankingTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  rankingIdentidade: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankingPonto: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rankingCodigo: {
    color: '#F1F5F9',
    fontSize: 14,
    fontFamily: fonts.bodyBold,
  },
  rankingMotivo: {
    flex: 1,
    color: '#64748B',
    fontSize: 12,
    fontFamily: fonts.body,
  },
  rankingScoreGrupo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scorePill: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  scoreTexto: {
    fontSize: 13,
    fontFamily: fonts.bodyBold,
  },
  rankingMetricas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricaTexto: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: fonts.bodySemiBold,
  },
  metricaRotulo: {
    color: '#475569',
    fontSize: 11,
    fontFamily: fonts.bodySemiBold,
  },
  metricaDivisor: {
    color: '#334155',
    fontSize: 12,
  },

  missaoLista: {
    gap: 2,
  },
  missaoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff08',
  },
  missaoInfo: {
    flex: 1,
    gap: 4,
  },
  missaoTitulo: {
    color: '#E2E8F0',
    fontSize: 14,
    fontFamily: fonts.bodySemiBold,
  },
  missaoCodigo: {
    color: '#F1F5F9',
    fontFamily: fonts.bodyBold,
  },
  missaoDetalhe: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: fonts.body,
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 100,
    borderWidth: 1,
  },
  statusTexto: {
    fontSize: 12,
    fontFamily: fonts.bodySemiBold,
  },

  acaoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: '#ffffff15',
    borderRadius: 100,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  acaoPonto: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  acaoTexto: {
    color: '#94A3B8',
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
  },
  acaoFonte: {
    color: '#38BDF8',
    fontSize: 13,
    fontFamily: fonts.bodyBold,
  },
  acaoBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffffff15',
    backgroundColor: '#ffffff05',
    alignItems: 'center',
    justifyContent: 'center',
  },

  vazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  vazioTitulo: {
    color: '#94A3B8',
    fontSize: 14,
    fontFamily: fonts.bodySemiBold,
    textAlign: 'center',
    lineHeight: 20,
  },
  vazioTituloGrande: {
    color: '#CBD5E1',
    fontSize: 16,
  },
  vazioSubtitulo: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: fonts.body,
    textAlign: 'center',
  },
  vazioCaixa: {
    backgroundColor: '#0D1117',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffffff08',
    padding: 24,
    minHeight: 150,
  },
});
