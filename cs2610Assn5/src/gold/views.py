import json
from django.shortcuts import render, render_to_response
from django.http import HttpResponse, Http404, HttpResponseRedirect
import datetime
from django.template import loader, RequestContext
from django.shortcuts import get_object_or_404, render
from time import strftime


def index(request):
    return render(request, 'gold/index.html')
