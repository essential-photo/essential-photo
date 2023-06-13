FROM ruby:3.1.2 as essential-photo-backend

ARG REFRESHED_AT
ENV REFRESHED_AT $REFRESHED_AT

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -\
  && apt-get update -qq && apt-get install -qq --no-install-recommends \
    nodejs \
  && apt-get upgrade -qq \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*\
  && npm install -g yarn@1

ENV INSTALL_PATH /opt/essential-backend
RUN mkdir -p $INSTALL_PATH

# Install ruby

# Install rails
RUN gem install rails bundler
#RUN chown -R user:user /opt/app


WORKDIR /opt/essential-backend
COPY . /
RUN bundle install
RUN rails webpacker:install:react

CMD ["rails s -p 3031"]