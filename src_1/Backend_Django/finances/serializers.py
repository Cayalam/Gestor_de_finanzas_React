from rest_framework import serializers
from django.contrib.auth import get_user_model
from . import models


User = get_user_model()


class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        # Expose fields explicitly to avoid leaking internal password hash
        fields = ('usuario_id', 'email', 'nombre', 'password', 'divisa_pref', 'is_staff', 'is_active', 'date_joined')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


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
