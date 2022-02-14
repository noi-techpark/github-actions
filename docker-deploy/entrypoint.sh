#!/bin/bash

set -euxo pipefail

RELEASE_NAME=$(date +'%Y-%m-%dT%H:%M:%S')

cd "${INPUT_WORKING-DIRECTORY}"

eval `ssh-agent -s`
ssh-add - <<< "${INPUT_SSH-PRIVATE-KEY}"

cd "${INPUT_WORKING-DIRECTORY}"
ansible-galaxy install -f -r "${INPUT_REQUIREMENTS-FILE}"
ansible-playbook --limit="${INPUT_HOSTS}" "${INPUT_PLAYBOOK-FILE}" --extra-vars "project_name=${INPUT_PROJECT-NAME}" --extra-vars "release_name=${RELEASE_NAME}" --extra-vars "docker_host=${INPUT_DOCKER-HOST}" --extra-vars "docker_username=${INPUT_DOCKER-USERNAME}" --extra-vars "docker_password=${INPUT_DOCKER-PASSWORD}"
