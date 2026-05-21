# Étape 1 : Construction
FROM node:20-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier le fichier package.json et lock (si disponible)
COPY package*.json ./

# Installer toutes les dépendances (y compris devDependencies pour la compilation)
RUN npm install

# Copier le reste du code source
COPY . .

# Compiler l'application React et le serveur Express
RUN npm run build

# Étape 2 : Production
FROM node:20-alpine

WORKDIR /app

# Définir les variables d'environnement obligatoires, notamment pour Dokploy
ENV NODE_ENV=production
ENV PORT=3000

# On ne copie que ce qui est nécessaire depuis l'étape de build
COPY package*.json ./
# Installer uniquement les dépendances de production
RUN npm install --production

# Copier le client React minifié (dist/) et le serveur compilé (dist/server.cjs)
COPY --from=builder /app/dist ./dist

# Exposer le port 3000 pour Dokploy
EXPOSE 3000

# Démarrer le serveur compilé
CMD ["npm", "start"]
