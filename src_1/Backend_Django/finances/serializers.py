from rest_framework import serializers
from . import models


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Usuario
        fields = '__all__'


class GrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Grupo
        fields = '__all__'


class BolsilloSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Bolsillo
        fields = '__all__'


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Categoria
        fields = '__all__'


class TransferenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Transferencia
        fields = '__all__'


class IngresoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Ingreso
        fields = '__all__'


class EgresoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Egreso
        fields = '__all__'


class MovimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Movimiento
        fields = '__all__'
