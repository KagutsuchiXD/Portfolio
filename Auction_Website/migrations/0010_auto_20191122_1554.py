# Generated by Django 2.2.5 on 2019-11-22 22:54

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('auction', '0009_auto_20191121_2022'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='silentauction',
            name='auction_active',
        ),
        migrations.AddField(
            model_name='silentauction',
            name='start_time',
            field=models.DateTimeField(default=datetime.datetime(2019, 11, 22, 22, 54, 46, 393842, tzinfo=utc), verbose_name='Start Time'),
        ),
        migrations.AlterField(
            model_name='bid',
            name='bid_time',
            field=models.DateTimeField(default=datetime.datetime(2019, 11, 22, 22, 54, 46, 393842, tzinfo=utc)),
        ),
        migrations.RemoveField(
            model_name='favorites',
            name='item_id',
        ),
        migrations.AddField(
            model_name='favorites',
            name='item_id',
            field=models.ManyToManyField(to='auction.Item'),
        ),
        migrations.AlterField(
            model_name='silentauction',
            name='end_time',
            field=models.DateTimeField(default=datetime.datetime(2019, 11, 23, 2, 54, 46, 393842, tzinfo=utc), verbose_name='End Time'),
        ),
        migrations.CreateModel(
            name='Winner',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_won', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='auction.Item')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
