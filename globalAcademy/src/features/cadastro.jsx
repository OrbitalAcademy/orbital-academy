import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBreakpoint } from '../styles/breakpoint';
import { cadastrarUsuario, salvarSessao } from '../services/sessao';
import { authStyles } from '../styles/auth';
import CampoFormulario from '../components/campoFormulario';
import FundoEstrelas from '../components/fundoEstrelas';

export default function Cadastro({ aoEntrar, aoVoltarLogin }) {
  const { isMobile } = useBreakpoint();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');

  const animX = useRef(new Animated.Value(-64)).current;
  const animOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animX, { toValue: 0, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(animOp, { toValue: 1, duration: 520, useNativeDriver: true }),
    ]).start();
  }, []);

  function ligar(setter) {
    return (v) => { setter(v); if (erro) setErro(''); };
  }

  async function cadastrar() {
    if (!nome.trim()) return setErro('Informe seu nome.');
    if (!email.includes('@')) return setErro('Informe um e-mail válido.');
    if (senha.length < 6) return setErro('A senha precisa de ao menos 6 caracteres.');
    if (senha !== confirmar) return setErro('As senhas não conferem.');

    const res = await cadastrarUsuario({ nome, email, senha });
    if (!res.ok) return setErro(res.erro);

    setErro('');
    await salvarSessao(res.usuario);
    aoEntrar?.(res.usuario);
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
        <Text style={authStyles.eyebrow}>ACESSO · NOVO CADASTRO</Text>
        <Text style={authStyles.titulo}>Criar sua conta</Text>
        <Text style={authStyles.subtitulo}>Cadastre-se para operar as missões do Orbital Academy.</Text>

        <View style={authStyles.form}>
          <CampoFormulario
            rotulo="Nome"
            icone="person-outline"
            valor={nome}
            aoMudar={ligar(setNome)}
            placeholder="Seu nome"
            autoCapitalize="words"
          />
          <CampoFormulario
            rotulo="E-mail"
            icone="mail-outline"
            valor={email}
            aoMudar={ligar(setEmail)}
            placeholder="nome@teste.com"
            teclado="email-address"
          />
          <CampoFormulario
            rotulo="Senha"
            icone="lock-closed-outline"
            valor={senha}
            aoMudar={ligar(setSenha)}
            placeholder="Mínimo 6 caracteres"
            senha
          />
          <CampoFormulario
            rotulo="Confirmar senha"
            icone="lock-closed-outline"
            valor={confirmar}
            aoMudar={ligar(setConfirmar)}
            placeholder="Repita a senha"
            senha
          />

          {erro ? (
            <View style={authStyles.erroCaixa}>
              <Ionicons name="alert-circle-outline" size={15} color="#EF4444" />
              <Text style={authStyles.erroTexto}>{erro}</Text>
            </View>
          ) : null}

          <Pressable
            style={({ pressed }) => [authStyles.btnPrimario, pressed && authStyles.btnPrimarioPressed]}
            onPress={cadastrar}
          >
            <Text style={authStyles.btnPrimarioTexto}>Criar conta</Text>
            <Ionicons name="arrow-forward-outline" size={18} color="#050810" />
          </Pressable>

          <View style={authStyles.rodape}>
            <Text style={authStyles.rodapeTexto}>Já tem conta? </Text>
            <Pressable hitSlop={6} onPress={() => aoVoltarLogin?.()}>
              <Text style={authStyles.link}>Entrar</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
