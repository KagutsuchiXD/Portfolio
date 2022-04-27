from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone


class Item(models.Model):
    item_name = models.TextField(max_length=100, blank=True)
    image = models.ImageField(upload_to='images/')
    description = models.TextField(max_length=600, blank=True)
    starting_bid = models.IntegerField(null=True, blank=True)
    favorite = models.ManyToManyField(User, related_name='favorite', blank=True)
    bid_on = models.ManyToManyField(User, related_name='bid_on', blank=True)
    is_silent_item = models.BooleanField(default=True)


class Winner(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item_won = models.ForeignKey(Item, on_delete=models.CASCADE)

    def get_winner(self):
        return self.user

    def get_item(self):
        return self.item_won


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email_confirmed = models.BooleanField(default=False)

    @receiver(post_save, sender=User)
    def update_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)
        instance.profile.save()

    def get_user(self):
        return self.user

    def get_email_confirmed(self):
        return self.email_confirmed


class SilentAuction(models.Model):
    start_time = models.DateTimeField('Start Time', default=timezone.now)
    end_time = models.DateTimeField('End Time', default=timezone.now() + timezone.timedelta(hours=4))

    def get_start(self):
        return self.start_time

    def get_end(self):
        return self.end_time


class Bid(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True)
    price = models.IntegerField(null=True, blank=True)
    bid_time = models.DateTimeField(default=timezone.now)
