FROM ruby:3.1.2

SHELL ["/bin/bash", "-c"]

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -\
  && apt-get update -qq && apt-get install -qq --no-install-recommends \
    nodejs \
  && apt-get upgrade -qq \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*\
  && npm install -g yarn@1

# setup rails project
ENV INSTALL_PATH /opt/essential-backend
RUN mkdir -p $INSTALL_PATH

# Install rails
RUN gem install rails bundler

WORKDIR /opt/essential-backend
COPY . .
RUN bundle install

CMD ["bin/rails s -p 3031"]