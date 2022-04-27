from django.contrib.auth.admin import UserAdmin, admin
from auction.models import Item, SilentAuction, Profile, Bid, Winner

# Register your models here.

UserAdmin.list_display = ('username', 'first_name', 'last_name', 'id', )


class ItemAdmin(admin.ModelAdmin):
    list_display = ('item_name', 'image', )


admin.site.register(Item, ItemAdmin)

admin.site.register(SilentAuction)

admin.site.register(Profile)


admin.site.register(Bid)

admin.site.register(Winner)
