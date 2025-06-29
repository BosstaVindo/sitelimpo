# Sistema Auto Dialer

Sistema completo de discagem automática com interface web e aplicativo Android.

## 🚀 Funcionalidades

### Interface Web
- **Gerenciamento de Listas**: Criar, editar e enviar listas de números
- **Monitoramento de Dispositivos**: Visualizar dispositivos conectados em tempo real
- **Gerador QR Code**: Conectar novos dispositivos facilmente
- **Dashboard**: Estatísticas e status do sistema

### Aplicativo Android
- **Discagem Automática**: Até 6 chamadas simultâneas
- **Gerenciamento de Conferências**: Controle inteligente de chamadas
- **Conexão HTTP Polling**: Comunicação estável com o servidor
- **Interface Intuitiva**: Fácil de usar e configurar

## 📋 Pré-requisitos

- Node.js 18+
- NPM ou Yarn
- Android Studio (para compilar o app)

## 🛠️ Instalação

### 1. Clone o repositório
\`\`\`bash
git clone https://github.com/seu-usuario/autodialer-system.git
cd autodialer-system
\`\`\`

### 2. Instale as dependências
\`\`\`bash
npm install
\`\`\`

### 3. Execute o servidor
\`\`\`bash
npm run dev
\`\`\`

### 4. Acesse o sistema
Abra http://localhost:3000 no seu navegador

## 🌐 Deploy no Render

### 1. Conecte o GitHub
- Faça login no Render.com
- Conecte sua conta GitHub
- Selecione este repositório

### 2. Configuração Automática
O arquivo `render.yaml` configura automaticamente:
- Build: `npm install && npm run build`
- Start: `npm start`
- Port: 10000

### 3. Variáveis de Ambiente
- `NODE_ENV`: production
- `PORT`: 10000

## 📱 Compilar App Android

### 1. Abra no Android Studio
\`\`\`bash
cd android-app
\`\`\`

### 2. Configure o projeto
- Abra o Android Studio
- Importe o projeto
- Sincronize o Gradle

### 3. Compile e instale
- Build > Build APK
- Instale no dispositivo Android

## 🎯 Como Usar

### 1. Configurar Dispositivo
1. Acesse a aba "QR Code" no painel web
2. Gere um QR Code
3. Escaneie com o app Android
4. Dispositivo aparecerá na aba "Dispositivos"

### 2. Criar Lista
1. Vá para aba "Listas"
2. Clique em "Nova Lista"
3. Adicione números (formato: +5511999999999)
4. Salve a lista

### 3. Enviar Lista
1. Selecione a lista criada
2. Escolha o dispositivo de destino
3. Clique em "Enviar Lista"
4. O app Android iniciará as chamadas automaticamente

### 4. Monitorar
- Acompanhe o status na aba "Dispositivos"
- Veja estatísticas na aba "Status"
- Monitore chamadas em tempo real

## 🔧 API Endpoints

### Listas
- `GET /api/lists` - Listar todas as listas
- `POST /api/lists` - Criar nova lista
- `PUT /api/lists/:id` - Atualizar lista
- `DELETE /api/lists/:id` - Deletar lista

### Dispositivos
- `GET /api/devices` - Listar dispositivos
- `POST /api/connect` - Conectar dispositivo
- `POST /api/poll` - Polling de mensagens
- `POST /api/send` - Enviar mensagem

### Sistema
- `GET /health` - Health check

## 🛡️ Segurança

- Validação de números de telefone
- Controle de rate limiting
- Sanitização de dados
- Logs de auditoria

## 📊 Monitoramento

- Status de dispositivos em tempo real
- Estatísticas de chamadas
- Logs de sistema
- Alertas de desconexão

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🆘 Suporte

Para suporte e dúvidas:
- Abra uma issue no GitHub
- Entre em contato via email

## 🔄 Atualizações

### v2.1.0
- Interface web completa
- Sistema de polling otimizado
- Melhorias na UI/UX
- Deploy automático no Render

### v2.0.0
- Reescrita completa do sistema
- Nova arquitetura de comunicação
- Interface moderna
- Suporte a múltiplos dispositivos

---

**Sistema Auto Dialer** - Desenvolvido com ❤️ para automação de chamadas
