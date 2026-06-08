import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Line,
  Polyline,
  Text as SvgText,
} from 'react-native-svg';
import { fonts } from '../styles/fonts';

const X_MIN = -4;
const X_MAX = 7;
const Y_MIN = 0.05;
const Y_MAX = 0.75;
const MARCAS_Y = [0.7, 0.5, 0.3, 0.1];

const COR_OBSERVADO = '#38BDF8';
const COR_SEM_ACAO = '#EF4444';
const COR_COM_ACAO = '#22C55E';

export default function GraficoPrevisao({ observado, semAcao, comAcao, limite = 0.3 }) {
  const [dim, setDim] = useState({ l: 0, a: 0 });

  function aoMedir(evento) {
    const { width, height } = evento.nativeEvent.layout;
    setDim({ l: width, a: height });
  }

  const padE = 36;
  const padD = 14;
  const padT = 16;
  const padB = 24;

  const areaL = dim.l - padE - padD;
  const areaA = dim.a - padT - padB;

  const px = (d) => padE + ((d - X_MIN) / (X_MAX - X_MIN)) * areaL;
  const py = (v) => padT + ((Y_MAX - v) / (Y_MAX - Y_MIN)) * areaA;

  const pontos = (serie) => serie.map((p) => `${px(p.d)},${py(p.v)}`).join(' ');

  const yLimite = py(limite);
  const yBase = py(Y_MIN);
  const xHoje = px(0);

  const areaSemAcao =
    `${px(0)},${yBase} ` + semAcao.map((p) => `${px(p.d)},${py(p.v)}`).join(' ') + ` ${px(X_MAX)},${yBase}`;

  return (
    <View style={estilos.area} onLayout={aoMedir}>
      {dim.l > 0 && (
        <Svg width={dim.l} height={dim.a}>
          {MARCAS_Y.map((m) => (
            <Line key={m} x1={padE} y1={py(m)} x2={dim.l - padD} y2={py(m)} stroke="#ffffff0A" strokeWidth={1} />
          ))}
          {MARCAS_Y.map((m) => (
            <SvgText
              key={`r-${m}`}
              x={padE - 8}
              y={py(m) + 4}
              fill="#475569"
              fontSize={11}
              fontFamily={fonts.body}
              textAnchor="end"
            >
              {m.toFixed(1)}
            </SvgText>
          ))}

          <Polyline points={areaSemAcao} fill={COR_SEM_ACAO} fillOpacity={0.1} stroke="none" />

          <Line
            x1={padE}
            y1={yLimite}
            x2={dim.l - padD}
            y2={yLimite}
            stroke={COR_SEM_ACAO}
            strokeOpacity={0.55}
            strokeWidth={1.5}
            strokeDasharray="6 5"
          />
          <SvgText
            x={dim.l - padD}
            y={yLimite - 7}
            fill={COR_SEM_ACAO}
            fillOpacity={0.8}
            fontSize={10}
            fontFamily={fonts.bodySemiBold}
            textAnchor="end"
          >
            LIMITE CRÍTICO · 0.30
          </SvgText>

          <Line x1={xHoje} y1={padT} x2={xHoje} y2={yBase} stroke="#ffffff20" strokeWidth={1} strokeDasharray="3 4" />
          <SvgText x={xHoje} y={padT - 3} fill="#64748B" fontSize={10} fontFamily={fonts.bodySemiBold} textAnchor="middle">
            HOJE
          </SvgText>

          <Polyline points={pontos(comAcao)} fill="none" stroke={COR_COM_ACAO} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
          <Polyline
            points={pontos(semAcao)}
            fill="none"
            stroke={COR_SEM_ACAO}
            strokeWidth={2.5}
            strokeDasharray="7 5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <Polyline points={pontos(observado)} fill="none" stroke={COR_OBSERVADO} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

          {observado.map((p) => (
            <Circle key={`o-${p.d}`} cx={px(p.d)} cy={py(p.v)} r={3} fill={COR_OBSERVADO} />
          ))}
          <Circle cx={xHoje} cy={py(observado[observado.length - 1].v)} r={5} fill="#0A0F1A" stroke={COR_OBSERVADO} strokeWidth={2} />

          <SvgText x={padE} y={dim.a - 6} fill="#475569" fontSize={11} fontFamily={fonts.body} textAnchor="start">
            -4d
          </SvgText>
          <SvgText x={dim.l - padD} y={dim.a - 6} fill="#475569" fontSize={11} fontFamily={fonts.body} textAnchor="end">
            +7d
          </SvgText>
        </Svg>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  area: {
    flex: 1,
    minHeight: 220,
  },
});
