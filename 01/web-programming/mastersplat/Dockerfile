# base image
FROM node:8.11.1
LABEL description="PW-Mastersplat" version="1.0"
# Expose Port
EXPOSE 3000 8080
# Create a new directory for apllication
RUN mkdir -p /home/node/app
# Copy server and client folders
COPY ./mastersplat_app/ /home/node/app

# Change working directory: Client
WORKDIR /home/node/app/client
# Install angular CLI
RUN npm install -g @angular/cli@6.0.7
# Install all the dependencies in the package.json in
RUN npm install
# Build angular to production
RUN ng build --prod
# Copy compiled angular for correct the folder
RUN cp -r ./dist/mastersplat-layout/* /home/node/app/server/public

# Change working directory: Server
WORKDIR /home/node/app/server
# Install all the dependencies: --unsafe-perm: for run harvest package.json
RUN npm install --unsafe-perm

CMD ["npm","start"]
