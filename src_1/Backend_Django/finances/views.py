from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from django.db.models import Q
from . import models, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models.deletion import RestrictedError
from django.db import IntegrityError
import logging

logger = logging.getLogger(__name__)


class RegisterAPIView(APIView):
    permission_classes = []  # allow any

    def post(self, request):
        # No temporary debug logging (removed after verification)

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

    @action(detail=False, methods=['get'], url_path='check-email', permission_classes=[])
    def check_email(self, request):
        """
        Verificar si un email existe en el sistema.
        Parámetro: email (query param)
        """
        email = request.query_params.get('email')
        if not email:
            return Response({'detail': 'El parámetro email es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        exists = models.Usuario.objects.filter(email=email).exists()
        return Response({'exists': exists, 'email': email}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        """
        Obtener la información del usuario actual autenticado
        """
        user = request.user
        if not user or user.is_anonymous:
            return Response({'detail': 'No autenticado'}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'usuario_id': user.usuario_id,
            'email': user.email,
            'nombre': user.nombre
        }, status=status.HTTP_200_OK)


class GrupoViewSet(viewsets.ModelViewSet):
    queryset = models.Grupo.objects.all()
    serializer_class = serializers.GrupoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Devolver solo los grupos donde el usuario es miembro
        """
        user = self.request.user
        if not user or user.is_anonymous:
            return models.Grupo.objects.none()
        # Obtener los IDs de grupos donde el usuario es miembro
        grupos_ids = models.UsuarioGrupo.objects.filter(usuario=user).values_list('grupo', flat=True)
        return models.Grupo.objects.filter(grupo_id__in=grupos_ids)

    def perform_create(self, serializer):
        """
        Al crear un grupo, automáticamente agregar al usuario creador como admin
        """
        grupo = serializer.save()
        # Agregar al usuario actual como admin del grupo
        models.UsuarioGrupo.objects.create(
            usuario=self.request.user,
            grupo=grupo,
            rol='admin'
        )


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

    def destroy(self, request, *args, **kwargs):
        """Override destroy to return a friendly error when DB restricts deletion (e.g. transferencias)."""
        try:
            return super().destroy(request, *args, **kwargs)
        except RestrictedError:
            return Response({'detail': 'No se puede eliminar este bolsillo porque tiene transferencias relacionadas.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({'detail': 'Error al eliminar el bolsillo.'}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as e:
            return Response({'detail': 'Ya existe un bolsillo con ese nombre para este usuario o grupo.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({'detail': 'Error al crear el bolsillo.'}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError:
            return Response({'detail': 'No se puede actualizar: nombre duplicado para este usuario o grupo.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({'detail': 'Error al actualizar el bolsillo.'}, status=status.HTTP_400_BAD_REQUEST)


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
        bolsillo = serializer.validated_data.get('bolsillo')
        monto = serializer.validated_data.get('monto', 0)
        
        # Actualizar saldo del bolsillo (sumar ingreso)
        if bolsillo and monto:
            bolsillo.saldo += monto
            bolsillo.save()
        
        if user and not serializer.validated_data.get('grupo'):
            serializer.save(usuario=user)
        else:
            serializer.save()
    
    def perform_update(self, serializer):
        # Obtener el ingreso original antes de actualizar
        ingreso_original = self.get_object()
        bolsillo_original = ingreso_original.bolsillo
        monto_original = ingreso_original.monto
        
        # Revertir el saldo original si había bolsillo
        if bolsillo_original and monto_original:
            bolsillo_original.saldo -= monto_original
            bolsillo_original.save()
        
        # Aplicar el nuevo monto al bolsillo nuevo o actualizado
        bolsillo_nuevo = serializer.validated_data.get('bolsillo')
        monto_nuevo = serializer.validated_data.get('monto', 0)
        
        if bolsillo_nuevo and monto_nuevo:
            bolsillo_nuevo.saldo += monto_nuevo
            bolsillo_nuevo.save()
        
        serializer.save()
    
    def perform_destroy(self, instance):
        # Revertir el saldo al eliminar
        if instance.bolsillo and instance.monto:
            instance.bolsillo.saldo -= instance.monto
            instance.bolsillo.save()
        instance.delete()


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
        bolsillo = serializer.validated_data.get('bolsillo')
        monto = serializer.validated_data.get('monto', 0)
        
        # Validar que hay saldo suficiente en el bolsillo
        if bolsillo and monto:
            if bolsillo.saldo < monto:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({
                    'detail': f'Saldo insuficiente en el bolsillo "{bolsillo.nombre}". Saldo disponible: ${bolsillo.saldo}, monto requerido: ${monto}'
                })
            
            # Actualizar saldo del bolsillo (restar egreso)
            bolsillo.saldo -= monto
            bolsillo.save()
        
        if user and not serializer.validated_data.get('grupo'):
            serializer.save(usuario=user)
        else:
            serializer.save()
    
    def perform_update(self, serializer):
        # Obtener el egreso original antes de actualizar
        egreso_original = self.get_object()
        bolsillo_original = egreso_original.bolsillo
        monto_original = egreso_original.monto
        
        # Revertir el saldo original si había bolsillo (sumar de vuelta)
        if bolsillo_original and monto_original:
            bolsillo_original.saldo += monto_original
            bolsillo_original.save()
        
        # Validar y aplicar el nuevo monto
        bolsillo_nuevo = serializer.validated_data.get('bolsillo')
        monto_nuevo = serializer.validated_data.get('monto', 0)
        
        if bolsillo_nuevo and monto_nuevo:
            if bolsillo_nuevo.saldo < monto_nuevo:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({
                    'detail': f'Saldo insuficiente en el bolsillo "{bolsillo_nuevo.nombre}". Saldo disponible: ${bolsillo_nuevo.saldo}, monto requerido: ${monto_nuevo}'
                })
            bolsillo_nuevo.saldo -= monto_nuevo
            bolsillo_nuevo.save()
        
        serializer.save()
    
    def perform_destroy(self, instance):
        # Revertir el saldo al eliminar (sumar de vuelta)
        if instance.bolsillo and instance.monto:
            instance.bolsillo.saldo += instance.monto
            instance.bolsillo.save()
        instance.delete()


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


class UsuarioGrupoViewSet(viewsets.ModelViewSet):
    queryset = models.UsuarioGrupo.objects.all()
    serializer_class = serializers.UsuarioGrupoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user or user.is_anonymous:
            return models.UsuarioGrupo.objects.none()
        # Obtener todos los grupos donde el usuario es miembro
        grupos = models.UsuarioGrupo.objects.filter(usuario=user).values_list('grupo', flat=True)
        # Retornar todos los miembros de esos grupos
        return models.UsuarioGrupo.objects.filter(grupo__in=grupos)

    @action(detail=False, methods=['post'], url_path='add-by-email')
    def add_by_email(self, request):
        """
        Agregar un usuario a un grupo usando su email.
        Requiere: email, grupo_id, rol (opcional, default 'miembro')
        """
        email = request.data.get('email')
        grupo_id = request.data.get('grupo_id') or request.data.get('grupoId')
        rol = request.data.get('rol', 'miembro')
        
        if not email:
            raise ValidationError({'detail': 'El email es requerido'})
        if not grupo_id:
            raise ValidationError({'detail': 'El ID del grupo es requerido'})
        
        # Verificar que el usuario existe
        try:
            usuario = models.Usuario.objects.get(email=email)
        except models.Usuario.DoesNotExist:
            raise ValidationError({'detail': f'No existe ningún usuario con el email "{email}"'})
        
        # Verificar que el grupo existe
        try:
            grupo = models.Grupo.objects.get(grupo_id=grupo_id)
        except models.Grupo.DoesNotExist:
            raise ValidationError({'detail': 'El grupo no existe'})
        
        # Verificar que el usuario actual tiene permisos en el grupo (debe ser admin)
        user_grupo = models.UsuarioGrupo.objects.filter(
            usuario=request.user,
            grupo=grupo,
            rol='admin'  # Solo los admins pueden agregar usuarios
        ).first()
        
        if not user_grupo:
            raise ValidationError({'detail': 'Solo los administradores del grupo pueden agregar usuarios'})
        
        # Verificar que el usuario no esté ya en el grupo
        existe = models.UsuarioGrupo.objects.filter(
            usuario=usuario,
            grupo=grupo
        ).exists()
        
        if existe:
            raise ValidationError({'detail': f'El usuario {email} ya es miembro de este grupo'})
        
        # Crear la relación usuario-grupo
        usuario_grupo = models.UsuarioGrupo.objects.create(
            usuario=usuario,
            grupo=grupo,
            rol=rol
        )
        
        return Response({
            'detail': f'Usuario {email} agregado exitosamente al grupo',
            'usuario_id': usuario.usuario_id,
            'email': usuario.email,
            'nombre': usuario.nombre,
            'rol': rol
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='members/(?P<grupo_id>[^/.]+)')
    def list_members(self, request, grupo_id=None):
        """
        Listar todos los miembros de un grupo
        """
        try:
            grupo = models.Grupo.objects.get(grupo_id=grupo_id)
        except models.Grupo.DoesNotExist:
            raise ValidationError({'detail': 'El grupo no existe'})
        
        # Verificar que el usuario actual es miembro del grupo
        es_miembro = models.UsuarioGrupo.objects.filter(
            usuario=request.user,
            grupo=grupo
        ).exists()
        
        if not es_miembro:
            raise ValidationError({'detail': 'No tienes permisos para ver los miembros de este grupo'})
        
        # Obtener todos los miembros
        miembros = models.UsuarioGrupo.objects.filter(grupo=grupo).select_related('usuario')
        
        data = [{
            'usuario_id': m.usuario.usuario_id,
            'email': m.usuario.email,
            'nombre': m.usuario.nombre,
            'rol': m.rol
        } for m in miembros]
        
        return Response(data)
