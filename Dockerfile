FROM ubuntu:16.04 as base

RUN apt-get update
RUN apt-get install -y locales && locale-gen en_US.UTF-8 && dpkg-reconfigure locales
ENV LANGUAGE=en_US.UTF-8 LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8

# Utilities
RUN apt-get install -y --no-install-recommends wget 
# vim less net-tools inetutils-ping curl git telnet nmap socat dnsutils netcat tree htop unzip sudo software-properties-common jq psmisc iproute python ssh rsync gettext-base

# Nodejs
RUN wget -O - https://nodejs.org/dist/v10.1.0/node-v10.1.0-linux-x64.tar.gz | tar xz
RUN mv node* node
ENV PATH $PATH:/node/bin

# Build Stage
FROM base as build

# Build tools
RUN apt-get install -y build-essential
COPY . /app
RUN cd /app && \
    npm --unsafe-perm install
RUN cd /app && \
    if cat package.json | jq -e '.scripts|has("build")' > /dev/bull; then \
      npm --unsafe-perm run build; \
    fi

# Final Stage
FROM base as final
COPY --from=build /app /app

# Open port for dev
EXPOSE 8080

WORKDIR /app

CMD ["npm", "start" ]
