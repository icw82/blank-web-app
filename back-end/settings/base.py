import os,sys

DEBUG = True

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(1, os.path.join(BASE_DIR, 'apps'))

DEFAULT_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'ckeditor',
    'ckeditor_uploader',
    'sorl.thumbnail',
    'nested_admin',
    'kk',
]

PROJECT_APPS = [
    'main',
    'places',
    'entities',
    'contacts',
    'articles',
    'posters',
    'galleries',
    'files',
    'vacancies',
    'facts',
    'forms',
    'pages',
]

INSTALLED_APPS = DEFAULT_APPS + THIRD_PARTY_APPS + PROJECT_APPS

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'main.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'static', 'templates')
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
#                "django.template.context_processors.i18n",
                "django.template.context_processors.tz",
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, '../db.sqlite3'),
    }
}

VALIDATION_PREFIX = 'django.contrib.auth.password_validation.'
AUTH_PASSWORD_VALIDATORS = [{
    'NAME': VALIDATION_PREFIX + 'UserAttributeSimilarityValidator',
}, {
    'NAME': VALIDATION_PREFIX + 'MinimumLengthValidator',
}, {
    'NAME': VALIDATION_PREFIX + 'CommonPasswordValidator',
}, {
    'NAME': VALIDATION_PREFIX + 'NumericPasswordValidator',
}]


LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Asia/Yekaterinburg'
USE_I18N = True
USE_L10N = True
USE_TZ = True


STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
STATIC_URL = '/static/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
