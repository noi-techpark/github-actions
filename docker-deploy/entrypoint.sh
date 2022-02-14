#!/bin/bash

set -euxo pipefail

RELEASE_NAME=$(date +'%Y-%m-%dT%H:%M:%S')

INPUT_SSH_PRIVATE_KEY="$(env | sed -n 's/^INPUT_SSH-PRIVATE-KEY=\(.*\)/\1/p')"
INPUT_WORKING_DIRECTORY="$(env | sed -n 's/^INPUT_WORKING-DIRECTORY=\(.*\)/\1/p')"
INPUT_REQUIREMENTS_FILE="$(env | sed -n 's/^INPUT_REQUIREMENTS-FILE=\(.*\)/\1/p')"
INPUT_PLAYBOOK_FILE="$(env | sed -n 's/^INPUT_PLAYBOOK-FILE=\(.*\)/\1/p')"
INPUT_PROJECT_NAME="$(env | sed -n 's/^INPUT_PROJECT-NAME=\(.*\)/\1/p')"
INPUT_DOCKER_HOST="$(env | sed -n 's/^INPUT_DOCKER-HOST=\(.*\)/\1/p')"
INPUT_DOCKER_USERNAME="$(env | sed -n 's/^INPUT_DOCKER-USERNAME=\(.*\)/\1/p')"
INPUT_DOCKER_PASSWORD="$(env | sed -n 's/^INPUT_DOCKER-PASSWORD=\(.*\)/\1/p')"

eval `ssh-agent -s`
ssh-add - <<< ${INPUT_SSH_PRIVATE_KEY}

cd "${INPUT_WORKING_DIRECTORY}"
ansible-galaxy install -f -r "${INPUT_REQUIREMENTS_FILE}"
ansible-playbook --limit="${INPUT_HOSTS}" "${INPUT_PLAYBOOK_FILE}" --extra-vars "project_name=${INPUT_PROJECT-NAME}" --extra-vars "release_name=${RELEASE_NAME}" --extra-vars "docker_host=${INPUT_DOCKER_HOST}" --extra-vars "docker_username=${INPUT_DOCKER_USERNAME}" --extra-vars "docker_password=${INPUT_DOCKER_PASSWORD}"
