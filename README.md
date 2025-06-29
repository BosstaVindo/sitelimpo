# Sistema Auto Dialer

Sistema completo para automação de chamadas telefônicas com conexão via QR Code entre dispositivos Android e painel web.

## 🚀 Deploy no Render

### Método 1: Deploy Automático via GitHub
1. **Fork este repositório** no GitHub
2. **Conecte sua conta** do Render ao GitHub
3. **Crie um novo Web Service** no Render
4. **Selecione este repositório**
5. **Configure automaticamente** (render.yaml já configurado)

### Método 2: Deploy Manual
1. Clone o repositório
2. Execute `npm install`
3. Execute `npm run build`
4. Faça upload para o Render

## 📋 Configuração no Render

### Configurações Automáticas (render.yaml)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18
- **Port**: 10000 (automático)

### Variáveis de Ambiente
\`\`\`bash
NODE_ENV=production
PORT=10000
\`\`\`

## 🔧 Funcionalidades

- ✅ **Geração de QR Codes** para conexão de dispositivos
- ✅ **Gerenciamento de listas** de números com DDD opcional
- ✅ **Painel de controle** em tempo real
- ✅ **Monitoramento de dispositivos** conectados
- ✅ **Sistema de polling** HTTP para comunicação
- ✅ **Interface responsiva** e moderna

## 📱 Como Usar

1. **Acesse** a URL do seu deploy no Render
2. **Vá para a aba "QR Code"**
3. **Escaneie o QR Code** com o app Android
4. **Crie listas** de números na aba "Listas"
5. **Envie as listas** para os dispositivos conectados
6. **Monitore o progresso** na aba "Dispositivos"

## 🛠️ Desenvolvimento Local

\`\`\`bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
\`\`\`

## 📁 Estrutura do Projeto

\`\`\`
app/
├── components/          # Componentes React
├── api/                # API Routes
└── page.tsx           # Página principal

public/                 # Arquivos estáticos
\`\`\`

## 🌐 Endpoints da API

- `GET /api/health` - Health check
- `GET /api/devices` - Listar dispositivos
- `POST /api/connect` - Conectar dispositivo
- `GET /api/poll` - Polling de mensagens
- `POST /api/send` - Enviar comandos
- `GET /api/lists` - Gerenciar listas

## 📞 Suporte

Para suporte técnico, abra uma issue no repositório.

---

**Desenvolvido para automação de chamadas telefônicas** 📞
# sitelimpo
