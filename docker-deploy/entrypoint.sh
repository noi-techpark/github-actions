#!/bin/sh

set -eu

RELEASE_NAME=$(date +'%Y-%m-%dT%H:%M:%S')

ssh-agent -a /tmp/ssh_agent.sock > /dev/null
ssh-add - <<< "$INPUT_SSH_PRIVATE_KEY"

cd $INPUT_WORKING_DIRECTORY
ansible-galaxy install -f -r $INPUT_REQUIREMENTS_FILE
ansible-playbook --limit=$INPUT_HOSTS $INPUT_PLAYBOOK_FILE --extra-vars "project_name=$INPUT_PROJECT_NAME" --extra-vars "release_name=$RELEASE_NAME" --extra-vars "docker_host=$INPUT_DOCKER_HOST" --extra-vars "docker_username=$INPUT_DOCKER_USERNAME" --extra-vars "docker_password=$INPUT_DOCKER_PASSWORD"
