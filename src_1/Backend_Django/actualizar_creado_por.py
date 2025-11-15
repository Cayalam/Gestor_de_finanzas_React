"""
Script para actualizar el campo creado_por en transacciones existentes
que no tienen este campo establecido.

Este script asigna el campo creado_por basándose en:
- Para transacciones personales: el usuario asociado
- Para transacciones de grupo: intenta obtenerlo de la aportación relacionada
"""

import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from finances.models import Ingreso, Egreso

def actualizar_ingresos():
    """Actualiza el campo creado_por en ingresos que no lo tienen"""
    ingresos_sin_creador = Ingreso.objects.filter(creado_por__isnull=True)
    contador = 0
    
    print(f"Encontrados {ingresos_sin_creador.count()} ingresos sin creador...")
    
    for ingreso in ingresos_sin_creador:
        # Si es una transacción personal (tiene usuario)
        if ingreso.usuario:
            ingreso.creado_por = ingreso.usuario
            ingreso.save()
            contador += 1
            print(f"✓ Ingreso {ingreso.ingreso_id}: asignado creador {ingreso.usuario.email}")
        
        # Si es una transacción de grupo, intentar obtener el usuario de la aportación
        elif ingreso.grupo:
            # Verificar si tiene una aportación relacionada
            if hasattr(ingreso, 'aportacion_ingreso'):
                aportacion = ingreso.aportacion_ingreso.first()
                if aportacion and aportacion.usuario:
                    ingreso.creado_por = aportacion.usuario
                    ingreso.save()
                    contador += 1
                    print(f"✓ Ingreso {ingreso.ingreso_id}: asignado creador de aportación {aportacion.usuario.email}")
                else:
                    print(f"⚠ Ingreso {ingreso.ingreso_id}: transacción de grupo sin aportación asociada")
            else:
                print(f"⚠ Ingreso {ingreso.ingreso_id}: transacción de grupo sin información de creador")
    
    print(f"\n✅ Se actualizaron {contador} ingresos")
    return contador

def actualizar_egresos():
    """Actualiza el campo creado_por en egresos que no lo tienen"""
    egresos_sin_creador = Egreso.objects.filter(creado_por__isnull=True)
    contador = 0
    
    print(f"\nEncontrados {egresos_sin_creador.count()} egresos sin creador...")
    
    for egreso in egresos_sin_creador:
        # Si es una transacción personal (tiene usuario)
        if egreso.usuario:
            egreso.creado_por = egreso.usuario
            egreso.save()
            contador += 1
            print(f"✓ Egreso {egreso.egreso_id}: asignado creador {egreso.usuario.email}")
        
        # Si es una transacción de grupo, intentar obtener el usuario de la aportación
        elif egreso.grupo:
            # Verificar si tiene una aportación relacionada
            if hasattr(egreso, 'aportacion_egreso'):
                aportacion = egreso.aportacion_egreso.first()
                if aportacion and aportacion.usuario:
                    egreso.creado_por = aportacion.usuario
                    egreso.save()
                    contador += 1
                    print(f"✓ Egreso {egreso.egreso_id}: asignado creador de aportación {aportacion.usuario.email}")
                else:
                    print(f"⚠ Egreso {egreso.egreso_id}: transacción de grupo sin aportación asociada")
            else:
                print(f"⚠ Egreso {egreso.egreso_id}: transacción de grupo sin información de creador")
    
    print(f"\n✅ Se actualizaron {contador} egresos")
    return contador

if __name__ == '__main__':
    print("=" * 60)
    print("ACTUALIZANDO CAMPO 'creado_por' EN TRANSACCIONES EXISTENTES")
    print("=" * 60)
    
    total_ingresos = actualizar_ingresos()
    total_egresos = actualizar_egresos()
    
    print("\n" + "=" * 60)
    print(f"RESUMEN: Se actualizaron {total_ingresos + total_egresos} transacciones en total")
    print("=" * 60)
