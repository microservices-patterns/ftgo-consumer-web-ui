#! /bin/bash

path=$1
shift
ports=$*

echo $path
echo $ports

host=${DOCKER_HOST_IP:-localhost}

done=false
counter=0

while [[ "$done" = false ]]; do
	for port in $ports; do
		url=http://${host}:${port}$path
		curl --fail $url >& /dev/null
		if [[ "$?" -eq "0" ]]; then
			done=true
		else
			done=false
			break
		fi
	done
	if [[ "$done" = true ]]; then
		echo connected
		break;
  fi
  if [[ "$counter" -gt 12 ]]; then
    echo "Error. Timed out service: $url. Check list: $ports"
	  exit 1
	else
	  counter=$((counter+1))
    echo "$counter"
	  echo -n .
    sleep 5
  fi
done
