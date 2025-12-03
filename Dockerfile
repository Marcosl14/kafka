FROM confluentinc/cp-kafka-connect:7.5.0

USER root

# Instalar HTTP Sink Connector
RUN confluent-hub install --no-prompt confluentinc/kafka-connect-http:1.7.11

# Instalar File Source Connector
RUN mkdir -p /usr/share/confluent-hub-components/kafka-connect-file && \
    curl -L -o /usr/share/confluent-hub-components/kafka-connect-file/connect-file-3.9.0.jar \
    https://repo1.maven.org/maven2/org/apache/kafka/connect-file/3.9.0/connect-file-3.9.0.jar

USER appuser