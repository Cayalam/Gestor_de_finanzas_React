from rest_framework import serializers
from django.contrib.auth import get_user_model
from . import models
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


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
        # Create the user using the custom user manager to avoid passing
        # unexpected kwargs (like 'username') to the custom Usuario model.
        # create_user will handle password hashing.
        user = User.objects.create_user(email=email, password=password, nombre=nombre, divisa_pref=divisa)

        # Create token
        token, _ = Token.objects.get_or_create(user=user)

        # Return a consistent dict with the created user and token. Keep the
        # 'usuario' key for backwards compatibility with the view.
        return {"user": user, "token": token.key, "usuario": user}


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
