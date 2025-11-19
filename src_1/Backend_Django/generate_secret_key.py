"""
Script para generar una SECRET_KEY segura para Django
Ejecutar con: python generate_secret_key.py
"""

from django.core.management.utils import get_random_secret_key

if __name__ == '__main__':
    secret_key = get_random_secret_key()
    print("\n" + "="*60)
    print("🔑 SECRET_KEY generada para Django:")
    print("="*60)
    print(f"\n{secret_key}\n")
    print("="*60)
    print("\n💡 Copia esta clave y úsala en Railway como variable de entorno:")
    print("   SECRET_KEY=" + secret_key)
    print("\n⚠️  IMPORTANTE: Guarda esta clave de forma segura.")
    print("   NO la compartas públicamente ni la subas a GitHub.\n")
