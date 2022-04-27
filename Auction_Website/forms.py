from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from auction.models import Item


class SignUpForm(UserCreationForm):
    username = forms.CharField(min_length=5, max_length=50, help_text="Required. 5-50 characters.")
    first_name = forms.CharField(min_length=1, max_length=50, help_text="Required. Enter your first name.")
    email = forms.EmailField(min_length=10, max_length=100, help_text='Required. Enter a valid email address.')

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2', )


class CommentForm(forms.ModelForm):
    class Meta:
        model = Item
        fields = ('item_name', 'image', 'description', 'starting_bid')
