# Sistema AutoDialer

Sistema completo de discagem automática com interface web e aplicativo Android.

## 🚀 Funcionalidades

### Interface Web
- **Gerenciamento de Listas**: Crie e gerencie listas de números para discagem
- **Monitoramento de Dispositivos**: Visualize status dos dispositivos Android conectados
- **Geração de QR Code**: Conecte dispositivos facilmente via QR Code
- **Dashboard em Tempo Real**: Monitore chamadas e conexões ativas

### Aplicativo Android
- **Discagem Automática**: Realiza chamadas automáticas sequenciais
- **Conferência Múltipla**: Até 6 chamadas simultâneas por dispositivo
- **Conexão via QR Code**: Conecta ao servidor escaneando QR Code
- **Auto-restart**: Reinicia automaticamente após completar listas

## 🛠 Tecnologias

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Mobile**: Android (Java)
- **UI Components**: Radix UI, Lucide Icons
- **QR Code**: qrcode library

## 📦 Instalação

### Deploy no Render

1. **Fork este repositório**
2. **Conecte ao Render**:
   - Acesse [render.com](https://render.com)
   - Conecte sua conta GitHub
   - Crie novo Web Service
   - Selecione este repositório

3. **Configuração automática**:
   - O Render detectará automaticamente as configurações
   - Build e deploy serão executados automaticamente

### Deploy Local

\`\`\`bash
# Clone o repositório
git clone <seu-repositorio>
cd autodialer-system

# Instale dependências
npm install

# Execute em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
\`\`\`

## 🔧 Configuração

### Variáveis de Ambiente

\`\`\`env
NODE_ENV=production
PORT=3000
\`\`\`

### Android App

1. **Compile o aplicativo Android**:
   - Abra o projeto Android no Android Studio
   - Configure as permissões necessárias
   - Compile e instale no dispositivo

2. **Conecte ao servidor**:
   - Acesse a aba "QR Code" na interface web
   - Escaneie o QR Code no aplicativo Android
   - O dispositivo será conectado automaticamente

## 📱 Como Usar

### 1. Criar Lista de Chamadas
- Acesse a aba "Listas de Chamadas"
- Clique em "Nova Lista"
- Insira nome e números (um por linha)
- Clique em "Criar Lista"

### 2. Conectar Dispositivos
- Acesse a aba "QR Code"
- Escaneie o código no app Android
- Verifique conexão na aba "Dispositivos"

### 3. Enviar Lista para Dispositivos
- Selecione uma lista criada
- Clique em "Enviar para Dispositivos"
- Os dispositivos começarão a discar automaticamente

### 4. Monitorar Progresso
- Acompanhe status na aba "Dispositivos"
- Visualize chamadas ativas em tempo real
- Monitore estatísticas do sistema

## 🔄 Fluxo de Funcionamento

1. **Criação**: Usuário cria lista de números na interface web
2. **Envio**: Lista é enviada para dispositivos Android conectados
3. **Processamento**: Dispositivos processam lista sequencialmente
4. **Discagem**: Até 6 chamadas simultâneas por dispositivo
5. **Conferência**: Números são adicionados à conferência automaticamente
6. **Repetição**: Processo se repete até completar toda a lista

## 📊 Monitoramento

### Status dos Dispositivos
- **Online**: Dispositivo conectado e disponível
- **Ocupado**: Realizando chamadas
- **Offline**: Desconectado

### Métricas do Sistema
- Dispositivos conectados
- Chamadas ativas
- Listas processadas
- Tempo de atividade

## 🔒 Segurança

- Conexões HTTP seguras
- Validação de dispositivos
- Controle de acesso por QR Code
- Logs de auditoria

## 🐛 Solução de Problemas

### Dispositivo não conecta
1. Verifique conexão com internet
2. Confirme URL do servidor no QR Code
3. Reinstale o aplicativo Android

### Chamadas não iniciam
1. Verifique permissões do Android
2. Confirme que o dispositivo está "Online"
3. Verifique se há números na lista

### Interface não carrega
1. Verifique se o servidor está rodando
2. Confirme a URL de acesso
3. Limpe cache do navegador

## 📞 Suporte

Para suporte técnico:
- Verifique logs do servidor
- Consulte documentação da API
- Reporte issues no GitHub

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para detalhes.

## 🚀 Deploy Status

- ✅ Interface Web
- ✅ APIs REST
- ✅ Aplicativo Android
- ✅ Sistema de QR Code
- ✅ Monitoramento em tempo real
- ✅ Pronto para produção

---

**Sistema AutoDialer v2.1.0** - Desenvolvido para máxima eficiência em campanhas de discagem automática.
