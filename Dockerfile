FROM ubuntu:16.04 as base

ENV DEBIAN_FRONTEND=noninteractive TERM=xterm
RUN echo "export > /etc/envvars" >> /root/.bashrc && \
    echo "export PS1='\[\e[1;31m\]\u@\h:\w\\$\[\e[0m\] '" | tee -a /root/.bashrc /etc/skel/.bashrc && \
    echo "alias tcurrent='tail /var/log/*/current -f'" | tee -a /root/.bashrc /etc/skel/.bashrc

RUN apt-get update
RUN apt-get install -y locales && locale-gen en_US.UTF-8 && dpkg-reconfigure locales
ENV LANGUAGE=en_US.UTF-8 LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8

# Runit
RUN apt-get install -y --no-install-recommends runit
CMD bash -c 'export > /etc/envvars && /usr/sbin/runsvdir-start'

# Utilities
RUN apt-get install -y --no-install-recommends vim less net-tools inetutils-ping wget curl git telnet nmap socat dnsutils netcat tree htop unzip sudo software-properties-common jq psmisc iproute python ssh rsync gettext-base

# Nodejs
RUN wget -O - https://nodejs.org/dist/v8.11.0/node-v8.11.0-linux-x64.tar.gz | tar xz
RUN mv node* node
ENV PATH $PATH:/node/bin

# Build Stage
FROM base as build

# Setup ssh key, docker build --build-arg SSH_KEY="$(cat id_rsa)" ...
ARG SSH_KEY
RUN if [ "$SSH_KEY" ]; then  \
      mkdir -p /root/.ssh && \
      chmod 0700 /root/.ssh && \
      ssh-keyscan github.com > /root/.ssh/known_hosts && \
      echo "${SSH_KEY}" > /root/.ssh/id_rsa && \
      chmod 600 /root/.ssh/id_rsa \
    ;fi

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


# Add runit services
# COPY sv /etc/service 
# ARG BUILD_INFO
# LABEL BUILD_INFO=$BUILD_INFO