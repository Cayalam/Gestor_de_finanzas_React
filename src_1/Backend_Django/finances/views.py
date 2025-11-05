from rest_framework import viewsets
from . import models, serializers


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = models.Usuario.objects.all()
    serializer_class = serializers.UsuarioSerializer


class GrupoViewSet(viewsets.ModelViewSet):
    queryset = models.Grupo.objects.all()
    serializer_class = serializers.GrupoSerializer


class BolsilloViewSet(viewsets.ModelViewSet):
    queryset = models.Bolsillo.objects.all()
    serializer_class = serializers.BolsilloSerializer


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = models.Categoria.objects.all()
    serializer_class = serializers.CategoriaSerializer


class TransferenciaViewSet(viewsets.ModelViewSet):
    queryset = models.Transferencia.objects.all()
    serializer_class = serializers.TransferenciaSerializer


class IngresoViewSet(viewsets.ModelViewSet):
    queryset = models.Ingreso.objects.all()
    serializer_class = serializers.IngresoSerializer


class EgresoViewSet(viewsets.ModelViewSet):
    queryset = models.Egreso.objects.all()
    serializer_class = serializers.EgresoSerializer


class MovimientoViewSet(viewsets.ModelViewSet):
    queryset = models.Movimiento.objects.all()
    serializer_class = serializers.MovimientoSerializer
