"""
Script para asignar creadores a grupos existentes
Asigna como creador al primer admin de cada grupo
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from finances.models import Grupo, UsuarioGrupo

def fix_creadores():
    grupos_sin_creador = Grupo.objects.filter(creador__isnull=True)
    
    print(f"Encontrados {grupos_sin_creador.count()} grupos sin creador")
    
    for grupo in grupos_sin_creador:
        # Buscar el primer admin del grupo
        primer_admin = UsuarioGrupo.objects.filter(
            grupo=grupo,
            rol='admin'
        ).first()
        
        if primer_admin:
            grupo.creador = primer_admin.usuario
            grupo.save()
            print(f"✅ Grupo '{grupo.nombre}' - Creador asignado: {primer_admin.usuario.email}")
        else:
            # Si no hay admin, buscar cualquier miembro
            cualquier_miembro = UsuarioGrupo.objects.filter(grupo=grupo).first()
            if cualquier_miembro:
                grupo.creador = cualquier_miembro.usuario
                # Promover a admin
                cualquier_miembro.rol = 'admin'
                cualquier_miembro.save()
                grupo.save()
                print(f"⚠️ Grupo '{grupo.nombre}' - Sin admin. Creador asignado y promovido: {cualquier_miembro.usuario.email}")
            else:
                print(f"❌ Grupo '{grupo.nombre}' - Sin miembros! No se puede asignar creador")
    
    print("\n✨ Proceso completado")

if __name__ == '__main__':
    fix_creadores()
