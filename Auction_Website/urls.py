from django.urls import path
from . import views

app_name = 'auction'

urlpatterns = [
    path('', views.index, name='index'),
    path('home/', views.home, name='home'),
    path('signup/', views.signup, name='signup'),
    path('account_activation_sent/', views.account_activation_sent, name='account_activation_sent'),
    path('activate/(<uidb64>[0-9A-Za-z_\-]+)/(<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/', views.activate,
         name='activate'),
    path('<int:item_id>/', views.item_details, name='item_details'),
    path('profile_page/', views.profile_page, name='profile_page'),
    path('favorite/<item_id>/', views.favorites, name='favorite'),
    path('favorites/', views.favorites_page, name='favorites'),
    path('add_bid/<int:item_id>', views.add_bid, name='add_bid'),
    path('winners/', views.winners, name='winners'),
    path('bids/', views.bids_page, name='bids_page'),

]
