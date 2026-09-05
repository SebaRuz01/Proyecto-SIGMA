from django.contrib import admin
from .models import (
    Taller, Usuario, Modulo, ModuloContratado,
    Tecnico, Repuesto, OrdenTrabajo, OrdenRepuesto
)

admin.site.register(Taller)
admin.site.register(Usuario)
admin.site.register(Modulo)
admin.site.register(ModuloContratado)
admin.site.register(Tecnico)
admin.site.register(Repuesto)
admin.site.register(OrdenTrabajo)
admin.site.register(OrdenRepuesto)