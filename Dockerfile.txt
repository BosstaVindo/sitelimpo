FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Criar diretório para dados
RUN mkdir -p /app/data

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
