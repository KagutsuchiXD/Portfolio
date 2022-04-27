from django.http import HttpResponse
from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.sites.shortcuts import get_current_site
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.utils import timezone
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.core.mail import EmailMessage

from auction.models import Item, Bid, SilentAuction, User, Winner
from auction.forms import SignUpForm
from auction.tokens import account_activation_token


@login_required
def home(request):
    if active():
        return render(request, 'auction/home.html')
    else:
        return render(request, 'auction/profile_page.html')


def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False
            user.save()

            current_site = get_current_site(request)
            mail_subject = 'Activate Your Hashira Account'
            message = render_to_string('auction/account_activation_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
            })
            to_email = form.cleaned_data.get('email')
            email = EmailMessage(
                mail_subject, message, to=[to_email]
            )

            email.send()
            return HttpResponse('Please confirm your email address to complete the registration')
    else:
        form = SignUpForm()
    return render(request, 'auction/signup.html', {'form': form})


def account_activation_sent(request):
    return render(request, 'auction/account_activation_sent.html')


def activate(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.profile.email_confirmed = True
        user.save()
        login(request, user)
        return redirect('../../../../home')
    else:
        return render(request, 'auction/account_activation_invalid.html')


def active():
    try:
        a = SilentAuction.objects.last()
        now = timezone.now()
        if a.start_time < now and now < a.end_time:
            return True
    except:
        return False


def get_balance(user):
    balance = 0
    if Item.objects.count() != 0 and Bid.objects.count() != 0:
        item_list = Item.objects.all()
        for item in item_list:
            bid = Bid.objects.filter(item=item).last()
            if bid is not None:
                if user == bid.user:
                    balance += bid.price
        return balance
    else:
        return balance


def index(request):
    balance = get_balance(request.user)
    if active():
        context = {'item': Item.objects.order_by('item_name'),
                   'balance': balance, }
        return render(request, 'auction/gallery.html', context)
    else:
        if Winner.objects.count() != 0:
            winners = Winner.objects.all().order_by('user')
            context = {'balance': balance,
                        'winner': winners,}
            return render(request, 'auction/winners.html', context)
        else:
            get_winners()
            winners = Winner.objects.all().order_by('user')
            context = {'balance': balance,
                        'winner': winners,}
            return render(request, 'auction/winners.html', context)


def item_details(request, item_id):
    balance = get_balance(request.user)
    if active():
        item = get_object_or_404(Item, pk=item_id)
        if Bid.objects.filter(item=item).exists():
            bid_list = Bid.objects.filter(item=item).last()
            bid_id = bid_list.id
            bid_object = get_object_or_404(Bid, pk=bid_id)
            bid = bid_object.price
        else:
            bid = item.starting_bid
        is_favorite = False
        if item.favorite.filter(id=request.user.id).exists():
            is_favorite = True

        context = {'item': item,
                   'bid': bid,
                   'is_favorite': is_favorite,
                   'balance': balance,
                   }

        return render(request, 'auction/item_details.html', context)
    else:
        if Winner.objects.count() != 0:
            winners = Winner.objects.all().order_by('user')
            context = {'balance': balance,
                        'winner': winners,}
            return render(request, 'auction/winners.html', context)
        else:
            get_winners()
            winners = Winner.objects.all().order_by('user')
            context = {'balance': balance,
                        'winner': winners,}
            return render(request, 'auction/winners.html', context)


def add_bid(request, item_id):
    item = get_object_or_404(Item, pk=item_id)
    bid = int(request.POST['bid'])
    if Bid.objects.filter(item=item).exists():
        bid_object = Bid.objects.filter(item=item).last()
        highest_bid = bid_object.price
    else:
        highest_bid = item.starting_bid
    if bid <= highest_bid:
        messages.add_message(request, messages.INFO, 'Please enter higher bid')
        return HttpResponseRedirect(reverse('auction:item_details', args=(item_id,)))
    else:
        user_id = request.user.id
        item.bid_on.add(request.user)
        new_bid = Bid(item=item,
                      user_id=user_id,
                      price=bid)
        new_bid.save()
        return HttpResponseRedirect(reverse('auction:item_details', args=(item_id,)))


def bids_page(request):
    balance = get_balance(request.user)
    if active():
        user = request.user
        #user_winning = winning(user)
        items_bid_on = user.bid_on.all()
        context = {
            'items_bid_on': items_bid_on,
            'bids': winning(user),
            'balance': balance,
        }
        return render(request, 'auction/bids_page.html', context)
    else:
        if Winner.objects.count() != 0:
            winners = Winner.objects.all().order_by('user')
            context = {'balance': balance,
                        'winner': winners,}
            return render(request, 'auction/winners.html', context)
        else:
            get_winners()
            winners = Winner.objects.all().order_by('user')
            context = {'balance': balance,
                        'winner': winners,}
            return render(request, 'auction/winners.html', context)


def favorites(request, item_id):
    balance = get_balance(request.user)
    if active():
        if request.user:
            item = get_object_or_404(Item, id=item_id)
            if item.favorite.filter(id=request.user.id).exists():
                item.favorite.remove(request.user)
            else:
                item.favorite.add(request.user)
            return HttpResponseRedirect(reverse('auction:item_details', args=(item_id,)))
    else:
        if Winner.objects.count() != 0:
            winners = Winner.objects.all().order_by('user')
            context = {'balance': balance,
                        'winner': winners,}
            return render(request, 'auction/winners.html', context)
        else:
            get_winners()
            winners = Winner.objects.all().order_by('user')
            context = {'balance': balance,
                        'winner': winners,}
            return render(request, 'auction/winners.html', context)


def favorites_page(request):
    balance = get_balance(request.user)
    if active():
        user = request.user
        favorite_items = user.favorite.all()
        context = {
            'favorite_items': favorite_items,
        }
        return render(request, 'auction/favorites.html', context)
    else:
        if Winner.objects.count() != 0:
            winners = Winner.objects.all().order_by('user')
            context = {'balance': balance,
                        'winner': winners,}
            return render(request, 'auction/winners.html', context)
        else:
            get_winners()
            winners = Winner.objects.all().order_by('user')
            context = {'balance': balance,
                        'winner': winners,}
            return render(request, 'auction/winners.html', context)


def profile_page(request):
    balance = get_balance(request.user)
    context = {'balance': balance,}
    return render(request, 'auction/profile_page.html', context)


def winners(request):
    balance = get_balance(request.user)
    if Winner.objects.count() != 0:
        winners = Winner.objects.all().order_by('user')
        context = {'balance': balance,
                    'winner': winners,}
        return render(request, 'auction/winners.html', context)
    else:
        get_winners()
        winners = Winner.objects.all().order_by('user')
        context = {'balance': balance,
                    'winner': winners,}
        return render(request, 'auction/winners.html', context)


def winning(user):
    bid_list = list()
    if Item.objects.count() != 0 and Bid.objects.count() != 0:
        item_list = Item.objects.all()
        for item in item_list:
            bid = Bid.objects.filter(item=item).last()
            if bid is not None:
                if user == bid.user:
                    bid_list.append(item)
        return bid_list
    else:
        return bid_list


def get_winners():
    item_list = Item.objects.all()
    for item in item_list:
        bid = Bid.objects.filter(item=item).last()
        temp = Winner(user=bid.user,
                      item_won=item)
        temp.save()
