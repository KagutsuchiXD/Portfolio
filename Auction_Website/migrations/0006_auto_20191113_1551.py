# Generated by Django 2.2.5 on 2019-11-13 22:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auction', '0005_silentauction'),
    ]

    operations = [
        migrations.RenameField(
            model_name='item',
            old_name='title',
            new_name='item_name',
        ),
    ]
