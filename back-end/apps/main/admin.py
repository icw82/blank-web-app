from django.contrib import admin

from kk.base.admin import BaseAdmin

from . import models

##@admin.register(models.HolderContact)
#class HolderContactInlineAdmin(admin.TabularInline):
#    model = models.HolderContact
#    fields = ('is_main', 'type', 'value', 'position', 'status')
#
#@admin.register(models.Holder)
#class HolderAdmin(BaseAdmin):
#    fields = ('status', 'title', 'logo', )
#    inlines = [
#        HolderContactInlineAdmin,
#    ]
##    list_select_related = ('contacts', )
##    list_display = ('title', 'code', 'position', 'status', )
##    list_per_page = 80
##    fields = ('status', 'title', 'code', )
#
#@admin.register(models.HolderCategory)
#class HolderCategoryAdmin(BaseAdmin):
#    pass
#
#
## —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —
#@admin.register(models.Article)
#class ArticleAdmin(BaseAdmin):
##    list_display = ('title', 'status', )
#    list_per_page = 80
