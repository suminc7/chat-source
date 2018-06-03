#
# MongoDB Dockerfile
#
# https://github.com/dockerfile/mongodb
#

# Pull base image.
FROM mongo:3.4

# Define mountable directories.
VOLUME ["/data/db"]

# Define working directory.
WORKDIR /data

EXPOSE 27017

# Define default command.
CMD ["mongod"]