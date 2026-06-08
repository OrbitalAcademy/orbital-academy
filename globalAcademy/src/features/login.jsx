import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../styles/fonts';
import { useBreakpoint } from '../styles/breakpoint';
import { autenticar, salvarSessao } from '../services/sessao';
import { authStyles } from '../styles/auth';
import CampoFormulario from '../components/campoFormulario';
import FundoEstrelas from '../components/fundoEstrelas';

export default function Login({ aoEntrar, aoPedirCadastro }) {
  const { isMobile } = useBreakpoint();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [manterConectado, setManterConectado] = useState(true);
  const [erro, setErro] = useState('');

  const animX = useRef(new Animated.Value(-64)).current;
  const animOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animX, { toValue: 0, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(animOp, { toValue: 1, duration: 520, useNativeDriver: true }),
    ]).start();
  }, []);

  // Autentica (credencial de teste ou usuário cadastrado) e persiste a sessão.
  async function entrar() {
    const usuario = await autenticar(email, senha);
    if (!usuario) {
      setErro('E-mail ou senha inválidos.');
      return;
    }
    setErro('');
    if (manterConectado) await salvarSessao(usuario);
    aoEntrar?.(usuario);
  }

  return (
    <View style={authStyles.container}>
      <FundoEstrelas opacity={animOp} />

      <Animated.View
        style={[
          authStyles.conteudo,
          isMobile && authStyles.conteudoMobile,
          { opacity: animOp, transform: [{ translateX: animX }] },
        ]}
      >
        <Text style={authStyles.eyebrow}>ACESSO · USUÁRIO</Text>
        <Text style={authStyles.titulo}>Entrar nesta Missão?</Text>
        <Text style={authStyles.subtitulo}>Use suas credenciais da missão para continuar.</Text>

        <View style={authStyles.form}>
          <CampoFormulario
            rotulo="E-mail"
            icone="mail-outline"
            valor={email}
            aoMudar={(v) => { setEmail(v); if (erro) setErro(''); }}
            placeholder="nome@teste.com"
            teclado="email-address"
          />
          <CampoFormulario
            rotulo="Senha"
            icone="lock-closed-outline"
            valor={senha}
            aoMudar={(v) => { setSenha(v); if (erro) setErro(''); }}
            placeholder="••••••••"
            senha
          />

          {erro ? (
            <View style={authStyles.erroCaixa}>
              <Ionicons name="alert-circle-outline" size={15} color="#EF4444" />
              <Text style={authStyles.erroTexto}>{erro}</Text>
            </View>
          ) : null}

          <View style={estilos.opcoes}>
            <Pressable style={estilos.checkboxLinha} onPress={() => setManterConectado((v) => !v)}>
              <View style={[estilos.checkbox, manterConectado && estilos.checkboxAtivo]}>
                {manterConectado && <Ionicons name="checkmark" size={13} color="#050810" />}
              </View>
              <Text style={estilos.checkboxTexto}>Manter conectado</Text>
            </Pressable>
            <Pressable hitSlop={6}>
              <Text style={authStyles.link}>Esqueci a senha</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [authStyles.btnPrimario, pressed && authStyles.btnPrimarioPressed]}
            onPress={entrar}
          >
            <Text style={authStyles.btnPrimarioTexto}>Acessar console</Text>
            <Ionicons name="arrow-forward-outline" size={18} color="#050810" />
          </Pressable>

          <View style={authStyles.rodape}>
            <Text style={authStyles.rodapeTexto}>Primeiro acesso? </Text>
            <Pressable hitSlop={6} onPress={() => aoPedirCadastro?.()}>
              <Text style={authStyles.link}>Criar conta</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const estilos = StyleSheet.create({
  opcoes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  checkboxLinha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ffffff25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxAtivo: { backgroundColor: '#38BDF8', borderColor: '#38BDF8' },
  checkboxTexto: { color: '#94A3B8', fontSize: 13, fontFamily: fonts.body },
});
