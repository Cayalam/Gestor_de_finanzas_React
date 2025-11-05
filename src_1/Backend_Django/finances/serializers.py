from rest_framework import serializers
from django.contrib.auth import get_user_model
from . import models
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password


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

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    nombre = serializers.CharField(max_length=100)
    password = serializers.CharField(write_only=True)
    divisa_pref = serializers.ChoiceField(choices=[("USD","USD"),("EUR","EUR"),("GBP","GBP"),("JPY","JPY"),("COP","COP")], default="COP")

    def create(self, validated_data):
        email = validated_data['email']
        nombre = validated_data.get('nombre', '')
        password = validated_data['password']
        divisa = validated_data.get('divisa_pref', 'COP')

        # Create Django auth user
        user = User.objects.create(username=email, email=email)
        user.set_password(password)
        user.save()

        # Create token
        token, _ = Token.objects.get_or_create(user=user)

        # Store Usuario model (password_hash uses Django's make_password)
        usuario = models.Usuario.objects.create(
            nombre=nombre, email=email, password_hash=make_password(password), divisa_pref=divisa
        )

        return {"user": user, "token": token.key, "usuario": usuario}


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
