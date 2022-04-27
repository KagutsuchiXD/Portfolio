from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auction', '0003_item'),
    ]

    operations = [
        migrations.CreateModel(
            name='BidHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bidder', models.TextField(blank=True, max_length=200)),
                ('price', models.IntegerField(blank=True, null=True)),
                ('date', models.DateTimeField(verbose_name='date published')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='auction.Item')),
            ],
        ),
    ]
