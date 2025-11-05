from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from . import models, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class RegisterAPIView(APIView):
    permission_classes = []  # allow any

    def post(self, request):
        serializer = serializers.RegisterSerializer(data=request.data)
        if serializer.is_valid():
            created = serializer.save()
            return Response({'token': created.get('token'), 'usuario_id': created.get('usuario').usuario_id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = models.Usuario.objects.all()
    serializer_class = serializers.UsuarioSerializer
    # Allow unauthenticated users to create (register). Other actions require authentication.
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # AllowAnyone for create (registration), otherwise require IsAuthenticated
        if self.action == 'create':
            from rest_framework.permissions import AllowAny

            return [AllowAny()]
        return [p() for p in self.permission_classes]

    def create(self, request, *args, **kwargs):
        # Create user and return token in response for convenience
        response = super().create(request, *args, **kwargs)
        # Generate token for the new user
        try:
            from rest_framework.authtoken.models import Token
            # serializer saved instance is in response.data['usuario_id'] or 'id'
            # Retrieve user by email if present
            email = response.data.get('email')
            if email:
                user = models.Usuario.objects.filter(email=email).first()
            else:
                # fallback: try to extract usuario_id
                usuario_id = response.data.get('usuario_id') or response.data.get('id')
                user = models.Usuario.objects.filter(usuario_id=usuario_id).first() if usuario_id else None
            if user:
                token, _ = Token.objects.get_or_create(user=user)
                # append token to response data
                response.data['token'] = token.key
        except Exception:
            # don't block user creation if token creation fails
            pass
        return response


class GrupoViewSet(viewsets.ModelViewSet):
    queryset = models.Grupo.objects.all()
    serializer_class = serializers.GrupoSerializer
    permission_classes = [IsAuthenticated]


class BolsilloViewSet(viewsets.ModelViewSet):
    queryset = models.Bolsillo.objects.all()
    serializer_class = serializers.BolsilloSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user or user.is_anonymous:
            return models.Bolsillo.objects.none()
        grupos = models.UsuarioGrupo.objects.filter(usuario=user).values_list('grupo', flat=True)
        return models.Bolsillo.objects.filter(Q(usuario=user) | Q(grupo__in=grupos))

    def perform_create(self, serializer):
        user = self.request.user
        if user and not serializer.validated_data.get('grupo'):
            serializer.save(usuario=user)
        else:
            serializer.save()


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = models.Categoria.objects.all()
    serializer_class = serializers.CategoriaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user or user.is_anonymous:
            return models.Categoria.objects.none()
        grupos = models.UsuarioGrupo.objects.filter(usuario=user).values_list('grupo', flat=True)
        return models.Categoria.objects.filter(Q(usuario=user) | Q(grupo__in=grupos))

    def perform_create(self, serializer):
        user = self.request.user
        if user and not serializer.validated_data.get('grupo'):
            serializer.save(usuario=user)
        else:
            serializer.save()


class TransferenciaViewSet(viewsets.ModelViewSet):
    queryset = models.Transferencia.objects.all()
    serializer_class = serializers.TransferenciaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user or user.is_anonymous:
            return models.Transferencia.objects.none()
        grupos = models.UsuarioGrupo.objects.filter(usuario=user).values_list('grupo', flat=True)
        return models.Transferencia.objects.filter(
            Q(de_bolsillo__usuario=user) | Q(a_bolsillo__usuario=user) | Q(de_bolsillo__grupo__in=grupos) | Q(a_bolsillo__grupo__in=grupos)
        )


class IngresoViewSet(viewsets.ModelViewSet):
    queryset = models.Ingreso.objects.all()
    serializer_class = serializers.IngresoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user or user.is_anonymous:
            return models.Ingreso.objects.none()
        grupos = models.UsuarioGrupo.objects.filter(usuario=user).values_list('grupo', flat=True)
        return models.Ingreso.objects.filter(Q(usuario=user) | Q(grupo__in=grupos))

    def perform_create(self, serializer):
        user = self.request.user
        if user and not serializer.validated_data.get('grupo'):
            serializer.save(usuario=user)
        else:
            serializer.save()


class EgresoViewSet(viewsets.ModelViewSet):
    queryset = models.Egreso.objects.all()
    serializer_class = serializers.EgresoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user or user.is_anonymous:
            return models.Egreso.objects.none()
        grupos = models.UsuarioGrupo.objects.filter(usuario=user).values_list('grupo', flat=True)
        return models.Egreso.objects.filter(Q(usuario=user) | Q(grupo__in=grupos))

    def perform_create(self, serializer):
        user = self.request.user
        if user and not serializer.validated_data.get('grupo'):
            serializer.save(usuario=user)
        else:
            serializer.save()


class MovimientoViewSet(viewsets.ModelViewSet):
    queryset = models.Movimiento.objects.all()
    serializer_class = serializers.MovimientoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user or user.is_anonymous:
            return models.Movimiento.objects.none()
        grupos = models.UsuarioGrupo.objects.filter(usuario=user).values_list('grupo', flat=True)
        return models.Movimiento.objects.filter(Q(usuario=user) | Q(grupo__in=grupos))

    def perform_create(self, serializer):
        user = self.request.user
        if user and not serializer.validated_data.get('grupo'):
            serializer.save(usuario=user)
        else:
            serializer.save()
