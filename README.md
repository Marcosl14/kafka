# Ejemplo de Kafka con Conector HTTP Sink y Consumidor

Este proyecto configura un entorno de Kafka utilizando Docker Compose. Incluye:

- Un broker de Kafka en modo KRaft.
- Kafka Connect con el conector `http-sink` de Confluent preinstalado.
- Un servicio `consumer` personalizado que lee mensajes de un topic.
- Kafka UI para la gestión y visualización del clúster.

El flujo principal consiste en producir mensajes en el topic `mensajes`, los cuales son consumidos simultáneamente por el conector `http-sink` (que los envía a un endpoint externo) y por el servicio `consumer`.

## 1. Levantar el Entorno

Para iniciar todos los servicios definidos en el archivo `docker-compose.yml`, ejecuta el siguiente comando desde la raíz del proyecto:

```bash
docker compose up --build -d
```

## 2. Crear el Conector `http-sink`

Una vez que los contenedores estén en funcionamiento, puedes crear el conector. Para ello, envía una petición `POST` al API REST de Kafka Connect con la configuración deseada.

**Endpoint:**

```
POST http://localhost:8083/connectors
```

**Body (payload):**

```json
{
  "name": "http-sink",
  "config": {
    "connector.class": "io.confluent.connect.http.HttpSinkConnector",
    "tasks.max": "1",
    "topics": "mensajes",
    "http.api.url": "https://tu-webhook.com",
    "request.method": "POST",
    "headers": "Content-Type:application/json",
    "batch.max.size": "1",
    "key.converter": "org.apache.kafka.connect.storage.StringConverter",
    "value.converter": "org.apache.kafka.connect.storage.StringConverter",
    "key.converter.schemas.enable": "false",
    "value.converter.schemas.enable": "false",
    "reporter.bootstrap.servers": "kafka:29092",
    "confluent.topic.bootstrap.servers": "kafka:29092",
    "confluent.topic.replication.factor": "1",
    "reporter.result.topic.replication.factor": "1",
    "reporter.error.topic.replication.factor": "1"
  }
}
```

## 3. Verificar el Estado del Conector

Para consultar el estado del conector y sus tareas, puedes hacer una petición `GET` al siguiente endpoint:

**Endpoint:**

```
GET http://localhost:8083/connectors/http-sink/status
```

Esto te devolverá un JSON con el estado general del conector (`RUNNING`, `FAILED`, etc.) y el estado detallado de cada una de sus tareas.

## 4. Enviar mensajes al tópico

Para enviar mensajes al tópico lo podemos hacer dentro de la misma UI, o a través del endpoint:

```bash
curl --location --request POST 'localhost:3000/send-message' \
--header 'Content-Type: application/json' \
--data-raw '{
    "key": "pepe",
    "value": {
        "tete": "lola"
    }
}'
```
