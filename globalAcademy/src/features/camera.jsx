import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../styles/fonts';
import { useBreakpoint } from '../styles/breakpoint';
import { useEntradaAnimada } from '../hooks/useEntradaAnimada';
import AcessoBloqueado, { CabecalhoTela } from '../components/acessoBloqueado';
import BotaoDesativado from '../components/botaoDesativado';
import Painel from '../components/painel';

const classes = [
  { rotulo: 'Saudável', cor: '#22C55E', desc: 'Vegetação dentro do padrão' },
  { rotulo: 'Stress hídrico', cor: '#F59E0B', desc: 'Déficit de água visível' },
  { rotulo: 'Praga ativa', cor: '#EF4444', desc: 'Danos foliares identificados' },
  { rotulo: 'Doença foliar', cor: '#EAB308', desc: 'Manchas ou necrose' },
];

const pipeline = [
  { n: '1', titulo: 'Captura do frame', sub: 'sensor de campo' },
  { n: '2', titulo: 'Inferência local', metodo: 'POST', cor: '#A855F7', rota: '/validar' },
  { n: '3', titulo: 'Atualiza missão', metodo: 'PATCH', cor: '#22C55E', rota: '/missoes/{id}/status' },
];

function Visor() {
  return (
    <View style={estilos.visor}>
      <View style={[estilos.canto, estilos.cantoSE]} />
      <View style={[estilos.canto, estilos.cantoSD]} />
      <View style={[estilos.canto, estilos.cantoIE]} />
      <View style={[estilos.canto, estilos.cantoID]} />
      <View style={estilos.visorMiolo}>
        <Ionicons name="camera-outline" size={40} color="#334155" />
        <Text style={estilos.visorTitulo}>Câmera inativa</Text>
        <Text style={estilos.visorSub}>Clique em iniciar para ativar o sensor</Text>
      </View>
    </View>
  );
}

function BlocoCamera() {
  return (
    <View style={estilos.blocoCamera}>
      <Visor />
      <View style={estilos.acoes}>
        <BotaoDesativado estilo={estilos.btnIniciar} estiloWrap={estilos.btnIniciarWrap} texto="Botão desativado no momento">
          <Ionicons name="play" size={14} color="#050810" />
          <Text style={estilos.btnIniciarTexto}>Iniciar varredura</Text>
        </BotaoDesativado>
        <BotaoDesativado estilo={estilos.btnLimpar} texto="Botão desativado no momento">
          <Text style={estilos.btnLimparTexto}>Limpar</Text>
        </BotaoDesativado>
      </View>
    </View>
  );
}

function ColunaInfo() {
  return (
    <View style={estilos.coluna}>
      <Painel titulo="Por que esta tela existe">
        <Text style={estilos.corpoTexto}>
          O satélite vê de cima e <Text style={estilos.italico}>prevê</Text>. A câmera confirma em
          campo. {'\n'}Sem ground-truth, a previsão fica provisória e nunca vira decisão.
        </Text>
      </Painel>

      <Painel titulo="Classes detectáveis">
        <View style={estilos.lista}>
          {classes.map((c) => (
            <View key={c.rotulo} style={estilos.classeItem}>
              <View style={[estilos.classePonto, { backgroundColor: c.cor }]} />
              <View style={estilos.classeTextos}>
                <Text style={estilos.classeRotulo}>{c.rotulo}</Text>
                <Text style={estilos.classeDesc}>{c.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </Painel>

      <Painel titulo="Pipeline de validação">
        <View style={estilos.pipeline}>
          {pipeline.map((p, i) => (
            <View key={p.n} style={estilos.passo}>
              <View style={estilos.passoColEsq}>
                <View style={estilos.passoCirculo}>
                  <Text style={estilos.passoNum}>{p.n}</Text>
                </View>
                {i < pipeline.length - 1 && <View style={estilos.passoLinha} />}
              </View>
              <View style={estilos.passoTextos}>
                <Text style={estilos.passoTitulo}>{p.titulo}</Text>
                {p.sub ? <Text style={estilos.passoSub}>{p.sub}</Text> : null}
                {p.metodo ? (
                  <View style={estilos.passoApi}>
                    <View style={[estilos.metodoBadge, { backgroundColor: `${p.cor}1A`, borderColor: `${p.cor}40` }]}>
                      <Text style={[estilos.metodoTexto, { color: p.cor }]}>{p.metodo}</Text>
                    </View>
                    <Text style={estilos.endpointRota}>{p.rota}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      </Painel>
    </View>
  );
}

export default function Camera({ logado = false, aoPedirLogin, aoPedirCadastro }) {
  const { isMobile } = useBreakpoint();
  const entrada = useEntradaAnimada();

  const conteudo = isMobile ? (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilos.corpoMobile}>
      <BlocoCamera />
      <ColunaInfo />
    </ScrollView>
  ) : (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilos.corpo}>
      <View style={estilos.blocoCameraWrap}>
        <BlocoCamera />
      </View>
      <ColunaInfo />
    </ScrollView>
  );

  return (
    <Animated.View style={[estilos.container, entrada]}>
      <CabecalhoTela pagina="camera" isMobile={isMobile} />

      <AcessoBloqueado logado={logado} aoPedirLogin={aoPedirLogin} aoPedirCadastro={aoPedirCadastro}>
        {conteudo}
      </AcessoBloqueado>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1 },

  // --- Corpo ---
  corpo: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
  },
  corpoMobile: {
    padding: 16,
    gap: 16,
  },
  blocoCameraWrap: { flex: 1.4 },
  blocoCamera: { gap: 16 },
  coluna: {
    flex: 1,
    gap: 16,
    alignSelf: 'flex-start',
  },

  // --- Visor ---
  visor: {
    height: 360,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff0D',
    backgroundColor: '#0A0F1A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  visorMiolo: { alignItems: 'center', gap: 8 },
  visorTitulo: { color: '#CBD5E1', fontSize: 15, fontFamily: fonts.bodySemiBold },
  visorSub: { color: '#64748B', fontSize: 13, fontFamily: fonts.body },
  canto: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderColor: '#475569',
  },
  cantoSE: { top: 14, left: 14, borderTopWidth: 2, borderLeftWidth: 2 },
  cantoSD: { top: 14, right: 14, borderTopWidth: 2, borderRightWidth: 2 },
  cantoIE: { bottom: 14, left: 14, borderBottomWidth: 2, borderLeftWidth: 2 },
  cantoID: { bottom: 14, right: 14, borderBottomWidth: 2, borderRightWidth: 2 },

  // --- Ações ---
  acoes: { flexDirection: 'row', gap: 12 },
  btnIniciarWrap: { flex: 1 },
  btnIniciar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#38BDF8',
  },
  btnIniciarTexto: {
    color: '#050810',
    fontSize: 14,
    fontFamily: fonts.bodyBold,
  },
  btnLimpar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 26,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffffff15',
    backgroundColor: '#ffffff05',
  },
  btnLimparTexto: { color: '#94A3B8', fontSize: 14, fontFamily: fonts.bodySemiBold },

  corpoTexto: {
    color: '#94A3B8',
    fontSize: 14,
    fontFamily: fonts.body,
    lineHeight: 22,
  },
  italico: { fontStyle: 'italic', color: '#CBD5E1' },
  lista: { gap: 16 },

  // --- Classes ---
  classeItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  classePonto: { width: 7, height: 7, borderRadius: 4, marginTop: 6 },
  classeTextos: { flex: 1, gap: 2 },
  classeRotulo: { color: '#E2E8F0', fontSize: 14, fontFamily: fonts.bodyBold },
  classeDesc: { color: '#64748B', fontSize: 13, fontFamily: fonts.body },

  // --- Pipeline ---
  pipeline: { gap: 0 },
  passo: { flexDirection: 'row', gap: 14 },
  passoColEsq: { alignItems: 'center' },
  passoCirculo: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#ffffff20',
    backgroundColor: '#0D1117',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passoNum: { color: '#94A3B8', fontSize: 12, fontFamily: fonts.bodyBold },
  passoLinha: {
    width: 1,
    flex: 1,
    backgroundColor: '#ffffff15',
    marginTop: 4,
  },
  passoTextos: { flex: 1, gap: 4, paddingBottom: 18 },
  passoTitulo: { color: '#E2E8F0', fontSize: 14, fontFamily: fonts.bodyBold },
  passoSub: { color: '#64748B', fontSize: 13, fontFamily: fonts.body },
  passoApi: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 },
  metodoBadge: { borderRadius: 6, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  metodoTexto: { fontSize: 11, fontFamily: fonts.bodyBold, letterSpacing: 0.5 },
  endpointRota: { color: '#94A3B8', fontSize: 13, fontFamily: fonts.bodySemiBold },
});
