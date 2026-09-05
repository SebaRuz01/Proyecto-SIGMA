from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .permissions import TieneModuloActivo, EsSuperAdmin

from .models import (
    Taller, Usuario, Modulo, ModuloContratado,
    Tecnico, Repuesto, OrdenTrabajo, OrdenRepuesto
)
from .serializers import (
    TallerSerializer, UsuarioSerializer,
    ModuloSerializer, ModuloContratadoSerializer,
    TecnicoSerializer, RepuestoSerializer,
    OrdenTrabajoSerializer, OrdenRepuestoSerializer,
    CustomTokenObtainPairSerializer,
    TecnicoCreateSerializer,
    TallerCreateSerializer
)
from .permissions import TieneModuloActivo


class TallerViewSet(viewsets.ModelViewSet):
    queryset = Taller.objects.all()
    serializer_class = TallerSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class ModuloViewSet(viewsets.ModelViewSet):
    queryset = Modulo.objects.all()
    serializer_class = ModuloSerializer

class ModuloContratadoViewSet(viewsets.ModelViewSet):
    queryset = ModuloContratado.objects.all()
    serializer_class = ModuloContratadoSerializer

class TecnicoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, TieneModuloActivo]
    modulo_requerido = 'tecnicos'

    def get_queryset(self):
        usuario = self.request.user
        if usuario.taller_id is None:
            return Tecnico.objects.all()
        return Tecnico.objects.filter(taller_id=usuario.taller_id)

    def get_serializer_class(self):
        if self.action == 'create':
            return TecnicoCreateSerializer
        return TecnicoSerializer

class RepuestoViewSet(viewsets.ModelViewSet):
    serializer_class = RepuestoSerializer
    permission_classes = [IsAuthenticated, TieneModuloActivo]
    modulo_requerido = 'inventario'

    def get_queryset(self):
        usuario = self.request.user
        if usuario.taller_id is None:
            return Repuesto.objects.all()
        return Repuesto.objects.filter(taller_id=usuario.taller_id)

    def perform_create(self, serializer):
        serializer.save(taller_id=self.request.user.taller_id)

class OrdenTrabajoViewSet(viewsets.ModelViewSet):
    serializer_class = OrdenTrabajoSerializer
    permission_classes = [IsAuthenticated, TieneModuloActivo]
    modulo_requerido = 'ordenes'

    def get_queryset(self):
        usuario = self.request.user
        if usuario.taller_id is None:
            return OrdenTrabajo.objects.all()
        return OrdenTrabajo.objects.filter(taller_id=usuario.taller_id)

    def perform_create(self, serializer):
        serializer.save(taller_id=self.request.user.taller_id)

class OrdenRepuestoViewSet(viewsets.ModelViewSet):
    queryset = OrdenRepuesto.objects.all()
    serializer_class = OrdenRepuestoSerializer
    permission_classes = [IsAuthenticated, TieneModuloActivo]
    modulo_requerido = 'ordenes'

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class TallerViewSet(viewsets.ModelViewSet):
    queryset = Taller.objects.all()
    permission_classes = [IsAuthenticated, EsSuperAdmin]

    def get_serializer_class(self):
        if self.action == 'create':
            return TallerCreateSerializer
        return TallerSerializer


class ModuloViewSet(viewsets.ModelViewSet):
    queryset = Modulo.objects.all()
    serializer_class = ModuloSerializer
    permission_classes = [IsAuthenticated]


class ModuloContratadoViewSet(viewsets.ModelViewSet):
    queryset = ModuloContratado.objects.all()
    serializer_class = ModuloContratadoSerializer
    permission_classes = [IsAuthenticated, EsSuperAdmin]