FROM node:16 as essential-photo

# install rails/ruby

SHELL ["/bin/bash", "-c"]

# rbenv install and setup.
RUN apt-get -y update
RUN apt-get install -y rbenv
ENV PATH /root/.rbenv/bin:/root/.rbenv/shims:$PATH

RUN git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build

# Install ruby
RUN rbenv install 3.1.2
RUN rbenv rehash
RUN rbenv local 3.1.2

# setup rails project
ENV INSTALL_PATH /opt/essential-backend
RUN mkdir -p $INSTALL_PATH


# Install rails
RUN gem install rails bundler

WORKDIR /opt/essential-backend
COPY . .
RUN bundle install

RUN bin/rails webpacker:install
RUN bin/rails webpacker:install:react
#RUN bin/rails db:migrate

CMD ["bin/rails s -p 3031"]