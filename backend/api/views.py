import requests
import csv
from django.http import JsonResponse

COCKTAILS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRxZnG0uDkj24vDcMr96JYTqKeaVyYmvAvEwKF_SgSEXM12rKl_TIufI_oDKaSIKmLMfZU1srdDB1oS/pub?gid=0&single=true&output=csv"
INGREDIENTS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRxZnG0uDkj24vDcMr96JYTqKeaVyYmvAvEwKF_SgSEXM12rKl_TIufI_oDKaSIKmLMfZU1srdDB1oS/pub?gid=1237016155&single=true&output=csv"

def fetch_cocktails(request):
    cocktails_response = requests.get(COCKTAILS_CSV_URL)
    ingredients_response = requests.get(INGREDIENTS_CSV_URL)

    cocktails_content = cocktails_response.content.decode('utf-8')
    ingredients_content = ingredients_response.content.decode('utf-8')

    cocktails_csv = csv.reader(cocktails_content.splitlines(), delimiter=',')
    ingredients_csv = csv.reader(ingredients_content.splitlines(), delimiter=',')

    cocktails_list = list(cocktails_csv)[2:]  # Skip the first two rows by using list slicing
    ingredients_list = list(ingredients_csv)[1:]  # Skip header

    cocktails = {}
    for row in cocktails_list:
        cocktails[row[0]] = {
            "name": row[1],
            "base_spirit": row[2],
            "category": row[3],
            "description": row[4],
            "instructions": row[5],
            "recommendations": row[6],
            "history": row[7],
            "ingredients": []
        }

    for row in ingredients_list:
        cocktail_id = row[0]
        if cocktail_id in cocktails:
            cocktails[cocktail_id]["ingredients"].append({
                "ingredient": row[1],
                "amount": row[2]
            })

    cocktails_data = list(cocktails.values())
    return JsonResponse(cocktails_data, safe=False)
