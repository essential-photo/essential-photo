FROM ruby:3.1.2 as essential-photo-backend

ENV INSTALL_PATH /opt/essential-backend
RUN mkdir -p $INSTALL_PATH


# Install rails
RUN gem install rails bundler
#RUN chown -R user:user /opt/app


WORKDIR /opt/essential-backend
COPY . /
RUN bundle install
RUN rails webpacker:install:react

CMD ["rails s -p 3031"]