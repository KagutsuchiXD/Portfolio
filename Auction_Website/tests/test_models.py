from django.test import TestCase
from auction.models import Item, Bid, Profile, Winner, SilentAuction
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from django.contrib.auth.models import User
#from django.core.urlresolvers import reverse


# SilentAuction model test
class AuctionTest(TestCase):

    def create_auction(self, start_time=timezone.now(), end_time=timezone.now()):
        return SilentAuction.objects.create(
            start_time=start_time,
            end_time=end_time
        )

    def test_auction_creation(self):
        s = self.create_auction()
        self.assertTrue(isinstance(s, SilentAuction))
        self.assertEqual(s.get_start(), s.start_time)
        self.assertEqual(s.get_end(), s.end_time)


# Winner model test
# class ProfileTest(TestCase):
#
#     def create_profile(
#         self,
#         user=User.objects.create_user(
#             username="username0",
#             password="passthing",
#             email="email@email.com"
#         ),
#         email_confirmed=False
#     ):
#         return SilentAuction.objects.create(
#             user=user,
#             email_confirmed=email_confirmed
#         )
#
#     def test_profile_creation(self):
#         u = self.create_profile()
#         self.assertTrue(isinstance(u, Profile))
#         self.assertEqual(u.get_user(), u.user)
#         self.assertEqual(u.get_email_confirmed(), u.email_confirmed)


# Winner model test
# class WinnerTest(TestCase):
#
#     def create_winner(self, user=models.ForeignKey, item_won=models.ForeignKey):
#         return SilentAuction.objects.create(
#             user=user,
#             item_won=item_won
#         )
#
#     def test_winner_creation(self):
#         w = self.create_winner()
#         self.assertTrue(isinstance(w, Winner))
#         self.assertEqual(w.get_winner(), w.user)
#         self.assertEqual(w.get_item, w.item_won)
