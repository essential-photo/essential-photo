FROM ruby:3.1.2

SHELL ["/bin/bash", "-c"]  # Set bash as the default shell instead of the default /bin/sh

RUN set -uex; \
    apt-get update; \
    apt-get install -y ca-certificates curl gnupg; \
    mkdir -p /etc/apt/keyrings; \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
     | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg; \
    NODE_MAJOR=16; \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" \
     > /etc/apt/sources.list.d/nodesource.list; \
    apt-get update; \
    apt-get install -qq --no-install-recommends nodejs -y; \
    apt-get upgrade -qq; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/*; \
    npm install -g yarn@1;

# setup rails project
ENV INSTALL_PATH /opt/essential-photo
RUN mkdir -p $INSTALL_PATH

# Install rails
RUN gem install rails bundler

WORKDIR /opt/essential-photo
COPY . .
RUN bundle install


CMD ["bin/rails s -p 3031"]