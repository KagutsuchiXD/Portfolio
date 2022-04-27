from django.test import TestCase, Client
from django.urls import reverse
from auction.models import *
import json


# class TestViews(TestCase):

    # def test_index(self):
    #     client = Client()
    #     response = client.get(reverse('SilentAuction'))
    #     self.assertEquals(response.status_code, 200)
    #     self.assertTemplateUsed(response, 'auction/gallery.html')