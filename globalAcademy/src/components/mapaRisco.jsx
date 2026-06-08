import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { fonts } from '../styles/fonts';
import { CORES_RISCO } from '../styles/cores';

const BASE_L = 600;
const BASE_A = 460;

function ChaveTalhao({ x, y, codigo, cor }) {
  return (
    <G>
      <Circle cx={x} cy={y - 18} r={3.5} fill={cor} />
      <Circle cx={x} cy={y - 18} r={6} fill={cor} fillOpacity={0.25} />
      <Rect
        x={x - 24}
        y={y - 9}
        width={48}
        height={18}
        rx={5}
        fill="#050810"
        fillOpacity={0.85}
        stroke={cor}
        strokeOpacity={0.45}
        strokeWidth={1}
      />
      <SvgText x={x} y={y + 4} fill="#E2E8F0" fontSize={11} fontFamily={fonts.bodySemiBold} textAnchor="middle">
        {codigo}
      </SvgText>
    </G>
  );
}

export default function MapaRisco({ talhoes }) {
  const [dim, setDim] = useState({ l: 0, a: 0 });

  function aoMedir(evento) {
    const { width, height } = evento.nativeEvent.layout;
    setDim({ l: width, a: height });
  }

  // Desenha em pixels reais (viewBox = tamanho medido) para preencher sem distorcer textos.
  const sx = dim.l / BASE_L;
  const sy = dim.a / BASE_A;
  const px = (x) => x * sx;
  const py = (y) => y * sy;
  const rio = `M ${px(0)} ${py(400)} C ${px(170)} ${py(370)} ${px(300)} ${py(300)} ${px(600)} ${py(255)}`;

  return (
    <View style={estilos.area} onLayout={aoMedir}>
      {dim.l > 0 && (
        <Svg width={dim.l} height={dim.a} viewBox={`0 0 ${dim.l} ${dim.a}`}>
          <Defs>
            <LinearGradient id="fundoNdvi" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#0E1A12" />
              <Stop offset="1" stopColor="#0A1410" />
            </LinearGradient>
          </Defs>

          <Rect x={0} y={0} width={dim.l} height={dim.a} fill="url(#fundoNdvi)" />

          {talhoes.map((talhao) => {
            const cor = CORES_RISCO[talhao.nivel];
            const pontos = talhao.poligono.map(([x, y]) => `${px(x)},${py(y)}`).join(' ');
            return (
              <Polygon
                key={talhao.codigo}
                points={pontos}
                fill={cor}
                fillOpacity={0.22}
                stroke={cor}
                strokeOpacity={0.7}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            );
          })}

          <Path d={rio} fill="none" stroke="#38BDF8" strokeOpacity={0.3} strokeWidth={6} strokeLinecap="round" />

          {talhoes.map((talhao) => (
            <ChaveTalhao
              key={`chave-${talhao.codigo}`}
              x={px(talhao.centro[0])}
              y={py(talhao.centro[1])}
              codigo={talhao.codigo}
              cor={CORES_RISCO[talhao.nivel]}
            />
          ))}
        </Svg>
      )}

      <View style={estilos.bussola} pointerEvents="none">
        <Ionicons name="arrow-up" size={14} color="#94A3B8" />
        <Text style={estilos.bussolaTexto}>N</Text>
      </View>

      <View style={estilos.escala} pointerEvents="none">
        <Text style={estilos.escalaTexto}>500 m</Text>
        <View style={estilos.escalaBarra} />
      </View>

      <View style={estilos.metadados} pointerEvents="none">
        <Text style={estilos.metaTexto}>Sentinel-2 · 10 m/px</Text>
        <Text style={estilos.metaTexto}>21.2°S · 48.3°W</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  area: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0A1410',
    position: 'relative',
  },
  bussola: {
    position: 'absolute',
    top: 12,
    right: 14,
    alignItems: 'center',
  },
  bussolaTexto: {
    color: '#94A3B8',
    fontSize: 11,
    fontFamily: fonts.bodySemiBold,
  },
  escala: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    gap: 4,
  },
  escalaTexto: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: fonts.body,
  },
  escalaBarra: {
    width: 70,
    height: 6,
    borderColor: '#94A3B8',
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
  },
  metadados: {
    position: 'absolute',
    bottom: 14,
    right: 16,
    alignItems: 'flex-end',
  },
  metaTexto: {
    color: '#475569',
    fontSize: 11,
    fontFamily: fonts.body,
  },
});
