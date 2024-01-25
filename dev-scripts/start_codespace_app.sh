#!/bin/bash

bundle exec rake db:migrate

bin/rails s -p 3001 --binding 0.0.0.0