# AutoDialer System

Sistema completo de chamadas automáticas com conferência para dispositivos Android.

## 🚀 Funcionalidades

- **Painel Web Completo**: Interface moderna para gerenciar listas e dispositivos
- **Conexão via QR Code**: Conecte dispositivos Android facilmente
- **Gerenciamento de Listas**: Crie, edite e gerencie listas de números
- **Conferências Automáticas**: Até 6 números por conferência
- **Monitoramento em Tempo Real**: Acompanhe dispositivos e chamadas
- **Sistema de Polling**: Comunicação estável entre web e mobile

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **UI Components**: Radix UI, Lucide Icons
- **QR Code**: qrcode library
- **Deploy**: Render, Vercel

## 📦 Instalação

### Desenvolvimento Local

\`\`\`bash
# Clone o repositório
git clone https://github.com/seu-usuario/autodialer-system.git
cd autodialer-system

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
\`\`\`

Acesse: http://localhost:3000

### Deploy no Render

1. **Fork** este repositório
2. **Conecte** sua conta GitHub ao Render
3. **Crie** um novo Web Service
4. **Selecione** seu repositório
5. **Deploy automático** via `render.yaml`

### Deploy na Vercel

\`\`\`bash
# Instale a CLI da Vercel
npm i -g vercel

# Deploy
vercel
\`\`\`

## 🎯 Como Usar

### 1. Painel Web
- Acesse a URL do seu deploy
- Use as 4 abas principais: Listas, Dispositivos, QR Code, Status

### 2. Conectar Dispositivo Android
- Vá para a aba "QR Code"
- Gere um QR Code
- Escaneie no app Android
- Dispositivo aparecerá na aba "Dispositivos"

### 3. Criar Lista de Chamadas
- Vá para a aba "Listas"
- Clique em "Nova Lista"
- Adicione nome e números (um por linha)
- Salve a lista

### 4. Enviar Lista para Dispositivos
- Na lista criada, clique "Enviar para Dispositivos"
- O app Android receberá a lista
- Chamadas começarão automaticamente

## 📱 App Android

O aplicativo Android deve ser compilado separadamente com os arquivos Java/Kotlin fornecidos.

### Funcionalidades do App:
- **Escaneamento de QR Code**
- **Conexão automática com servidor**
- **Recebimento de listas via polling**
- **Conferências automáticas (até 6 números)**
- **Auto-restart após chamadas**
- **Interface de monitoramento**

## 🔧 Configuração

### Variáveis de Ambiente (Opcional)
\`\`\`env
NODE_ENV=production
PORT=10000
\`\`\`

### Estrutura de Arquivos
\`\`\`
autodialer-system/
├── app/
│   ├── components/          # Componentes React
│   ├── api/                # API Routes
│   └── globals.css         # Estilos globais
├── components/ui/          # Componentes UI
├── lib/                   # Utilitários
├── public/               # Arquivos estáticos
└── README.md
\`\`\`

## 🌐 APIs Disponíveis

- `GET /api/health` - Health check
- `GET /api/lists` - Buscar listas
- `POST /api/lists` - Criar/gerenciar listas
- `GET /api/devices` - Buscar dispositivos
- `POST /api/devices` - Gerenciar dispositivos
- `POST /api/connect` - Conectar dispositivo
- `POST /api/poll` - Polling de mensagens
- `POST /api/send` - Enviar mensagens

## 🎨 Interface

### Telas Principais:
1. **Listas**: Criar e gerenciar listas de números
2. **Dispositivos**: Monitorar dispositivos conectados
3. **QR Code**: Gerar códigos para conexão
4. **Status**: Estatísticas do sistema

### Recursos da Interface:
- ✅ Design responsivo
- ✅ Tema moderno
- ✅ Notificações em tempo real
- ✅ Atualização automática
- ✅ Indicadores de status

## 🔍 Monitoramento

- **Status de Conexão**: Indicador em tempo real
- **Dispositivos Online**: Contador de dispositivos ativos
- **Chamadas Realizadas**: Estatísticas de uso
- **Health Check**: Endpoint para monitoramento

## 🚨 Troubleshooting

### Problemas Comuns:

1. **Build Error**: Verifique se todas as dependências estão instaladas
2. **QR Code não funciona**: Verifique a URL do servidor
3. **Dispositivo não conecta**: Verifique a conexão de internet
4. **Listas não aparecem**: Verifique os logs da API

### Logs:
- Render: Dashboard > Logs
- Vercel: Dashboard > Functions > Logs
- Local: Terminal do `npm run dev`

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte e dúvidas:
- Abra uma issue no GitHub
- Verifique a documentação
- Consulte os logs de erro

---

**AutoDialer System v2.1.0** - Sistema completo de chamadas automáticas 🚀
