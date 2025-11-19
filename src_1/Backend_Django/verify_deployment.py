"""
Script de verificación pre-despliegue para Railway
Ejecutar antes de desplegar para verificar que todo está configurado correctamente

Uso:
    python verify_deployment.py
"""

import os
import sys
import json
from pathlib import Path

# Colores para terminal
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.BLUE}{Colors.BOLD}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}{Colors.BOLD}{text.center(60)}{Colors.END}")
    print(f"{Colors.BLUE}{Colors.BOLD}{'='*60}{Colors.END}\n")

def print_success(text):
    print(f"{Colors.GREEN}✓ {text}{Colors.END}")

def print_error(text):
    print(f"{Colors.RED}✗ {text}{Colors.END}")

def print_warning(text):
    print(f"{Colors.YELLOW}⚠ {text}{Colors.END}")

def print_info(text):
    print(f"{Colors.BLUE}ℹ {text}{Colors.END}")

def check_file_exists(filepath, description):
    """Verifica si un archivo existe"""
    if os.path.exists(filepath):
        print_success(f"{description} existe")
        return True
    else:
        print_error(f"{description} NO encontrado: {filepath}")
        return False

def check_requirements():
    """Verifica requirements.txt del backend"""
    print_header("Verificando Backend Dependencies")
    
    req_file = "requirements.txt"
    if not check_file_exists(req_file, "requirements.txt"):
        return False
    
    required_packages = [
        ('django', 'Django'),
        ('djangorestframework', 'djangorestframework'),
        ('django-cors-headers', 'django-cors-headers'),
        ('gunicorn', 'gunicorn'),
        ('whitenoise', 'whitenoise'),
        ('psycopg2-binary', 'psycopg2-binary'),
        ('dj-database-url', 'dj-database-url'),
        ('python-dotenv', 'python-dotenv')
    ]
    
    with open(req_file, 'r') as f:
        content = f.read()
        content_lower = content.lower()
    
    all_present = True
    for display_name, search_name in required_packages:
        # Buscar el paquete (case insensitive)
        found = search_name.lower() in content_lower
        
        if found:
            print_success(f"Paquete '{display_name}' presente")
        else:
            print_error(f"Paquete '{display_name}' FALTANTE")
            all_present = False
    
    return all_present

def check_procfile():
    """Verifica Procfile"""
    print_header("Verificando Procfile")
    
    if not check_file_exists("Procfile", "Procfile"):
        return False
    
    with open("Procfile", 'r') as f:
        content = f.read()
    
    if "gunicorn" in content and "backend.wsgi" in content:
        print_success("Procfile configurado correctamente")
        return True
    else:
        print_error("Procfile no tiene configuración correcta de gunicorn")
        return False

def check_railway_json():
    """Verifica railway.json"""
    print_header("Verificando railway.json")
    
    if not check_file_exists("railway.json", "railway.json"):
        print_warning("railway.json no encontrado (opcional pero recomendado)")
        return True
    
    try:
        with open("railway.json", 'r') as f:
            config = json.load(f)
        print_success("railway.json es JSON válido")
        return True
    except json.JSONDecodeError:
        print_error("railway.json tiene formato JSON inválido")
        return False

def check_settings_py():
    """Verifica configuración de settings.py"""
    print_header("Verificando settings.py")
    
    settings_file = "backend/settings.py"
    if not check_file_exists(settings_file, "settings.py"):
        return False
    
    with open(settings_file, 'r') as f:
        content = f.read()
    
    checks = {
        'SECRET_KEY': 'os.getenv' in content and 'SECRET_KEY' in content,
        'DEBUG': 'os.getenv' in content and 'DEBUG' in content,
        'ALLOWED_HOSTS': 'ALLOWED_HOSTS' in content and 'os.getenv' in content,
        'DATABASE_URL': 'dj_database_url' in content or 'DATABASE_URL' in content,
        'WhiteNoise': 'whitenoise' in content.lower(),
        'CORS': 'CORS_ALLOWED_ORIGINS' in content,
        'CSRF': 'CSRF_TRUSTED_ORIGINS' in content,
    }
    
    all_passed = True
    for check_name, passed in checks.items():
        if passed:
            print_success(f"{check_name} configurado")
        else:
            print_error(f"{check_name} NO configurado o faltante")
            all_passed = False
    
    return all_passed

def check_gitignore():
    """Verifica .gitignore"""
    print_header("Verificando .gitignore")
    
    if not check_file_exists(".gitignore", ".gitignore"):
        print_warning(".gitignore no encontrado")
        return False
    
    with open(".gitignore", 'r') as f:
        content = f.read()
    
    important_items = ['.env', '*.pyc', 'db.sqlite3', '__pycache__']
    
    all_present = True
    for item in important_items:
        if item in content:
            print_success(f"'{item}' en .gitignore")
        else:
            print_warning(f"'{item}' NO está en .gitignore")
            all_present = False
    
    return all_present

def check_env_example():
    """Verifica .env.example"""
    print_header("Verificando .env.example")
    
    if not check_file_exists(".env.example", ".env.example"):
        print_warning(".env.example no encontrado (recomendado)")
        return True
    
    with open(".env.example", 'r') as f:
        content = f.read()
    
    required_vars = ['SECRET_KEY', 'DEBUG', 'ALLOWED_HOSTS', 'DATABASE_URL']
    
    for var in required_vars:
        if var in content:
            print_success(f"Variable '{var}' documentada")
        else:
            print_warning(f"Variable '{var}' no documentada")
    
    return True

def check_migrations():
    """Verifica que existan migraciones"""
    print_header("Verificando Migraciones")
    
    migrations_dir = "finances/migrations"
    if not os.path.exists(migrations_dir):
        print_error(f"Directorio de migraciones no encontrado: {migrations_dir}")
        return False
    
    migration_files = [f for f in os.listdir(migrations_dir) if f.endswith('.py') and f != '__init__.py']
    
    if migration_files:
        print_success(f"Encontradas {len(migration_files)} migraciones")
        for mig in migration_files[:5]:  # Mostrar primeras 5
            print_info(f"  - {mig}")
        if len(migration_files) > 5:
            print_info(f"  ... y {len(migration_files) - 5} más")
        return True
    else:
        print_error("No se encontraron archivos de migración")
        return False

def check_static_files():
    """Verifica configuración de archivos estáticos"""
    print_header("Verificando Configuración de Archivos Estáticos")
    
    settings_file = "backend/settings.py"
    with open(settings_file, 'r') as f:
        content = f.read()
    
    if 'STATIC_ROOT' in content and 'STATIC_URL' in content:
        print_success("STATIC_ROOT y STATIC_URL configurados")
        return True
    else:
        print_error("STATIC_ROOT o STATIC_URL no configurados")
        return False

def generate_secret_key():
    """Genera una SECRET_KEY"""
    try:
        from django.core.management.utils import get_random_secret_key
        return get_random_secret_key()
    except ImportError:
        print_warning("Django no está instalado, no se puede generar SECRET_KEY")
        return None

def main():
    """Función principal"""
    print(f"\n{Colors.BOLD}{'='*60}")
    print(f"  🔍 VERIFICACIÓN PRE-DESPLIEGUE RAILWAY")
    print(f"  Gestor de Finanzas - Backend Django")
    print(f"{'='*60}{Colors.END}\n")
    
    # Cambiar al directorio del backend si estamos en root
    if os.path.exists('src_1/Backend_Django'):
        os.chdir('src_1/Backend_Django')
        print_info("Cambiado a directorio: src_1/Backend_Django\n")
    
    results = {
        'Requirements': check_requirements(),
        'Procfile': check_procfile(),
        'Railway JSON': check_railway_json(),
        'Settings.py': check_settings_py(),
        'Gitignore': check_gitignore(),
        'Env Example': check_env_example(),
        'Migraciones': check_migrations(),
        'Static Files': check_static_files(),
    }
    
    # Resumen
    print_header("RESUMEN DE VERIFICACIÓN")
    
    passed = sum(results.values())
    total = len(results)
    
    print(f"\n{Colors.BOLD}Verificaciones pasadas: {passed}/{total}{Colors.END}\n")
    
    for check, result in results.items():
        if result:
            print_success(f"{check}")
        else:
            print_error(f"{check}")
    
    # Generar SECRET_KEY
    print_header("SECRET_KEY para Railway")
    secret_key = generate_secret_key()
    if secret_key:
        print_info("Copia esta SECRET_KEY para usar en Railway:")
        print(f"\n{Colors.YELLOW}{secret_key}{Colors.END}\n")
        print_warning("⚠️  IMPORTANTE: Guarda esta clave de forma segura")
        print_warning("⚠️  NO la subas a GitHub")
    
    # Conclusión
    print_header("CONCLUSIÓN")
    
    if passed == total:
        print_success("✅ Tu proyecto está LISTO para desplegar en Railway!")
        print_info("\nPróximos pasos:")
        print_info("1. Ve a https://railway.app")
        print_info("2. Sigue RAILWAY_QUICK_START.md")
        print_info("3. Usa la SECRET_KEY generada arriba")
        return 0
    elif passed >= total * 0.8:
        print_warning("⚠️  Tu proyecto está CASI listo")
        print_warning("Revisa los errores arriba y corrígelos")
        return 1
    else:
        print_error("❌ Tu proyecto necesita más configuración")
        print_error("Revisa RAILWAY_DEPLOYMENT.md para más detalles")
        return 2

if __name__ == "__main__":
    sys.exit(main())
