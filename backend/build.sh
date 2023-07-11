#!/usr/bin/env bash

set -o errexit  # exit on error

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py createsuperuser --noinput --username $DJANGO_SUPERUSER_USERNAME
python manage.py migrate