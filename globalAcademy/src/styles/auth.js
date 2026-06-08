import { StyleSheet } from 'react-native';
import { fonts } from './fonts';

// Estilos compartilhados pelas telas de acesso (login / cadastro).
export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050810',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  conteudo: { width: '100%', maxWidth: 380, paddingHorizontal: 24, zIndex: 5 },
  conteudoMobile: { maxWidth: 420 },
  eyebrow: {
    color: '#475569',
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  titulo: { color: '#F1F5F9', fontSize: 32, fontFamily: fonts.titleBlack, letterSpacing: -0.5, marginBottom: 8 },
  subtitulo: { color: '#64748B', fontSize: 14, fontFamily: fonts.body, lineHeight: 22 },
  form: { marginTop: 28, gap: 18 },
  btnPrimario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#38BDF8',
    marginTop: 4,
  },
  btnPrimarioPressed: { opacity: 0.85 },
  btnPrimarioTexto: { color: '#050810', fontSize: 15, fontFamily: fonts.bodyBold },
  erroCaixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EF444430',
    backgroundColor: '#EF444410',
  },
  erroTexto: { flex: 1, color: '#FCA5A5', fontSize: 13, fontFamily: fonts.body, lineHeight: 18 },
  link: { color: '#38BDF8', fontSize: 13, fontFamily: fonts.bodySemiBold },
  rodape: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  rodapeTexto: { color: '#64748B', fontSize: 13, fontFamily: fonts.body },
});
