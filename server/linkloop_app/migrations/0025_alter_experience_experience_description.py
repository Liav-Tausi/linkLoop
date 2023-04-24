# Generated by Django 4.1.7 on 2023-04-24 15:52

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('linkloop_app', '0024_alter_experience_experience_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='experience',
            name='experience_description',
            field=models.TextField(db_column='experience_description', max_length=300, unique=True, validators=[django.core.validators.MinLengthValidator(1)]),
        ),
    ]
