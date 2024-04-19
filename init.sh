#!/bin/bash

echo "Generando archivo SQL con las consultas de inserción..."

CSV_FILE="dataset/weather_stations.csv"
SQL_FILE="dataset/init.sql"

if [ ! -f "$SQL_FILE" ]; then
    touch "$SQL_FILE"
fi

> "$SQL_FILE"

echo "CREATE TABLE IF NOT EXISTS clima (" >> "$SQL_FILE"
echo "    ciudad TEXT," >> "$SQL_FILE"
echo "    temperatura FLOAT" >> "$SQL_FILE"
echo ");" >> "$SQL_FILE"

while IFS=';' read -r ciudad temperatura; do
    echo "INSERT INTO clima (ciudad, temperatura) VALUES ('$ciudad', $temperatura);" >> $SQL_FILE
done < "$CSV_FILE"

echo "Se ha generado el archivo $SQL_FILE con las consultas de inserción."

echo "Levantando contenedores.."

docker-compose up