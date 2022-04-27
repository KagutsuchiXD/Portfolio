from django.shortcuts import render
from .models import ConvFactor
import json
from django.http import HttpResponse


def convert(request):
    query_from = request.GET.get('from')
    query_to = request.GET.get('to')
    query_value = request.GET.get('value')

    cfs = ConvFactor()
    cfs.save()

    invalid_request = {'error': 'Invalid conversion request'}
    json_response = json.dumps(invalid_request)

    if float(query_value) >= 0.00 and (query_from == 'lbs' or query_from == 't_oz') and (query_to == 'lbs' or query_to == 't_oz'):
        if query_from == 'lbs' and query_to == 't_oz':
            json_answer = float(query_value) * cfs.lbs_to_t_oz
            json_response = json.dumps({'units': query_to, 'value': json_answer})

        if query_from == 't_oz' and query_to == 'lbs':
            json_answer = float(query_value) * cfs.t_oz_to_lbs
            json_response = json.dumps({'units': query_to, 'value': json_answer})
    return HttpResponse(json_response)