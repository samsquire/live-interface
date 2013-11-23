#!/bin/bash

SOCKET=$(curl --silent --output - http://localhost:1444/bucket | jq '.uuid' -r)

echo $SOCKET

open http://localhost:1444/bucket/$SOCKET

SOCKET_FILE=/tmp/$SOCKET.socket

echo $SOCKET_FILE

sleep 2

nc -U $SOCKET_FILE
