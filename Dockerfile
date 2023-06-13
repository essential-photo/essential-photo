FROM ruby:3.1.2 as essential-photo-backend

ENV INSTALL_PATH /opt/essential-backend
RUN mkdir -p $INSTALL_PATH

# install curl/nvm/node
RUN apt install curl
RUN apt update && apt upgrade
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
RUN export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
RUN nvm install --lts
RUN nvm use --lts

# Install rails
RUN gem install rails bundler
#RUN chown -R user:user /opt/app


WORKDIR /opt/essential-backend
COPY . /
RUN bundle install
RUN rails webpacker:install:react

CMD ["rails s -p 3031"]