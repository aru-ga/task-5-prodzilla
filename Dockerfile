FROM node:20

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build  # Ensure this command is compiling your TypeScript files

EXPOSE 3000

CMD ["node", "build/index.js"]  # Assuming your TypeScript compiles to a 'build' directory
