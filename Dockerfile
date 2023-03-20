FROM ruby:3.1.2 as essential-photo-backend

ENV INSTALL_PATH /opt/app
RUN mkdir -p $INSTALL_PATH


# Install rails
RUN gem install rails bundler
#RUN chown -R user:user /opt/app


WORKDIR /opt/app
COPY . /
RUN bundle install

CMD ["bash"]