FROM ruby:3.1.2 as essential-photo-backend

ENV INSTALL_PATH /opt/essential-backend
RUN mkdir -p $INSTALL_PATH

# update 
RUN apt-get update
# install curl 
RUN apt-get install curl
# get install script and pass it to execute: 
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash
# and install node 
RUN apt-get install nodejs

# Install rails
RUN gem install rails bundler
#RUN chown -R user:user /opt/app


WORKDIR /opt/essential-backend
COPY . /
RUN bundle install
RUN rails webpacker:install:react

CMD ["rails s -p 3031"]