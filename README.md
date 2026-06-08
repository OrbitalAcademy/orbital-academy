# 🛰️ Orbital Academy

> Dado espacial em decisão real, sem precisar ser especialista.

Plataforma que pega o que a NASA e o INPE já enxergam lá de cima — risco em lavoura, foco de calor, déficit hídrico — e coloca na mão de quem precisa **decidir o que fazer**. Um modelo prevê, um otimizador aloca, você opera. O satélite finalmente chega em campo.

**Global Solution FIAP · Space Connect · 2026.1** — Engenharia de Software, 3º semestre.

---

## 🌎 Sobre

O dado espacial é abundante, gratuito e cada vez mais preciso. O que ainda é escasso é a **capacidade de transformar esse dado em ação** sob recurso limitado, em tempo real, por pessoas que não têm formação em sensoriamento remoto.

O Orbital Academy não substitui o especialista técnico: ele torna a decisão com dado espacial acessível para qualquer operador, produtor rural ou equipe de campo que antes ficava de fora desse ciclo. A plataforma percorre o ciclo completo:

> **Ver → Prever → Validar → Decidir → Otimizar → Agir → Medir**

O app é **responsivo** (desktop e mobile), feito em **React Native + Expo** rodando também na **web**.

---

## 🧩 Arquitetura da solução

Não é um sistema monolítico, e sim uma arquitetura de componentes integrados — retire qualquer peça e o ciclo para:

- **Console de Missão** — interface central de operação (mapa + ranking + decisões).
- **Motor de Decisão** — modelo de ML (Random Forest e Regressão Logística) sobre dados reais de NASA Earthdata, INMET e INPE (NDVI, temperatura de superfície, déficit hídrico).
- **Otimizador de Recursos** — alocação ótima de recursos escassos (água, equipe, ordem e tempo) sobre o score de risco.
- **Câmera de Validação** — visão computacional local que confirma ou corrige a previsão do satélite, fechando o loop de *ground-truth*.

---

## 🛠️ Stack

- **[Expo](https://expo.dev/) ~56** + **Expo Router ~56** (navegação file-based, `typedRoutes`)
- **React Native 0.85** / **React 19** (com React Compiler habilitado)
- **react-native-web** — mesma base roda na web
- **react-native-svg** — gráficos (previsão, impacto) e mapa de risco
- **@react-native-async-storage/async-storage** — persistência de sessão
- **@expo-google-fonts** — Nunito (corpo) e Roboto (títulos)
- **@expo/vector-icons** (Ionicons)
- **TypeScript** (na camada de rotas) + **JavaScript/JSX** (features e componentes)

---

## 📂 Estrutura de pastas

```
globalAcademy/
├─ app/                      # Rotas (Expo Router)
│  ├─ _layout.tsx            # Carrega fontes + Stack
│  ├─ global.css
│  └─ (feature)/index.tsx    # Monta <Home />
├─ assets/                   # Imagens, logos e fotos do time
├─ src/
│  ├─ features/              # Telas: home, console, missao, camera,
│  │                         #        indicadores, espacoteca, login, cadastro
│  ├─ components/            # Reutilizáveis: sidebar, painel, campoFormulario,
│  │                         #   fundoEstrelas, estadoVazioTela, acessoBloqueado,
│  │                         #   botaoDesativado, mapaRisco, graficoImpacto, graficoPrevisao
│  ├─ hooks/                 # useEntradaAnimada (animação de entrada das telas)
│  ├─ services/              # sessao.js (auth mock + AsyncStorage)
│  └─ styles/                # fonts, cores, auth e breakpoints
└─ app.json / package.json / vercel.json
```

A navegação entre telas é **estado interno** no `Home` (chave `ativo`), não rotas reais — a sidebar troca a tela ativa.

---

## 🚀 Como rodar

**Pré-requisitos:** [Node.js](https://nodejs.org/) (LTS) e npm. Para mobile, o app **Expo Go** no celular ou um emulador Android/iOS.

```bash
# 1. Entrar na pasta do app
cd globalAcademy

# 2. Instalar dependências
npm install

# 3. Iniciar
npm expo start          # abre o Expo 
```

---

## 🔑 Acesso de teste

A autenticação é **mock** (não há backend). Para entrar:

- **E-mail:** qualquer endereço terminando em `@teste.com` (ex.: `fiap@teste.com`)
- **Senha:** `123456`

Também é possível **criar uma conta** pela tela de Cadastro — os usuários ficam salvos localmente (AsyncStorage). Com "Manter conectado" marcado, a sessão é restaurada ao reabrir o app.

---


## 👥 Time

| Integrante | Atuação |
| --- | --- |
| [Abner de Paiva Barbosa](https://www.linkedin.com/in/abner-pb/) | RM558468 |
| [Beatriz Vieira de Novais](https://www.linkedin.com/in/beatriznovais/) | RM554746 |
| [Eduardo Dallabella Lima](https://www.linkedin.com/in/eduardo-dallabella-lima/) | RM556803 |
| [Heloísa Real](https://www.linkedin.com/in/heloisareal/) | RM554535 |
| [Mariana Neugebauer Dourado](https://www.linkedin.com/in/neugema/) | RM550494 |

> Cinco pessoas, oito matérias, uma arquitetura.
