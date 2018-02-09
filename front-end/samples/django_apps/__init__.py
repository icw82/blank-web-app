from os.path import dirname, basename

app_name = basename(dirname(__file__))
default_app_config = app_name + '.apps.Config'
