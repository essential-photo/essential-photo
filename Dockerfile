FROM node:16 as essential-photo

# install rails/ruby

RUN apt-get -y update
RUN apt-get install -y rbenv
RUN git clone https://github.com/rbenv/rbenv.git ~/.rbenv
RUN echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
RUN echo 'eval "$(rbenv init -)"' >> ~/.bashrc

RUN git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
RUN echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc

RUN rbenv version
RUN rbenv install 3.1.2
RUN rbenv global 3.1.2

ENV INSTALL_PATH /opt/essential-backend
# No RUN chown -R user:user /opt/
RUN mkdir -p $INSTALL_PATH

# Install ruby

# Install rails
RUN gem install bundler -v 2.3.26
RUN gem update --system 3.2.3
# RUN gem install rails bundler
#RUN chown -R user:user /opt/app


WORKDIR /opt/essential-backend
COPY . /
RUN bundle install
RUN rails webpacker:install
RUN rails db:migrate

CMD ["rails s -p 3031"]