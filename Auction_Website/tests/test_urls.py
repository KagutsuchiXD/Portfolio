from django.test import SimpleTestCase
from django.urls import reverse, resolve
from auction.views import *


class testUrls(SimpleTestCase):
    def test_index_url_is_resolved(self):
        url = reverse('auction:index')
        self.assertEquals(resolve(url).func, index)

    def test_home_url_is_resolved(self):
        url = reverse('auction:home')
        self.assertEquals(resolve(url).func, home)

    def test_signup_url_is_resolved(self):
        url = reverse('auction:signup')
        self.assertEquals(resolve(url).func, signup)

    def test_account_activation_url_is_resolved(self):
        url = reverse('auction:account_activation_sent')
        self.assertEquals(resolve(url).func, account_activation_sent)

    # These are examples from
    # https://stackoverflow.com/questions/52479839/django-url-testing
    def test_unit_view_url(self):
        path = reverse('auction:item_details', kwargs={'item_id': 1})
        self.assertEquals(resolve(path).func, item_details)

    def test_profile_page_url_is_resolved(self):
        url = reverse('auction:profile_page')
        self.assertEquals(resolve(url).func, profile_page)

    def test_favorite_item_view_url(self):
        path = reverse('auction:favorite', kwargs={'item_id': 1})
        self.assertEquals(resolve(path).func, favorites)

    def test_favorites_page_view_url(self):
        path = reverse('auction:favorites')
        self.assertEquals(resolve(path).func, favorites_page)

    def test_favorites_url_is_resolved(self):
        url = reverse('auction:favorites')
        self.assertEquals(resolve(url).func, favorites_page)