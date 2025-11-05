from django.db import models


class Usuario(models.Model):
    usuario_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    email = models.EmailField(max_length=120, unique=True)
    password_hash = models.CharField(max_length=255)
    DIVISA_CHOICES = [
        ("USD", "USD"), ("EUR", "EUR"), ("GBP", "GBP"), ("JPY", "JPY"), ("COP", "COP"),
    ]
    divisa_pref = models.CharField(max_length=3, choices=DIVISA_CHOICES, default="COP")

    class Meta:
        db_table = "usuario"


class Grupo(models.Model):
    grupo_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, db_index=True)
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "grupo"


class UsuarioGrupo(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE)
    ROL_CHOICES = [("admin", "admin"), ("miembro", "miembro")]
    rol = models.CharField(max_length=10, choices=ROL_CHOICES, default="miembro")

    class Meta:
        db_table = "usuario_grupo"
        unique_together = (("usuario", "grupo"),)


class Bolsillo(models.Model):
    bolsillo_id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    grupo = models.ForeignKey(Grupo, on_delete=models.SET_NULL, null=True, blank=True)
    nombre = models.CharField(max_length=100)
    saldo = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)

    class Meta:
        db_table = "bolsillo"
        constraints = [
            models.CheckConstraint(check=(models.Q(usuario__isnull=True) ^ models.Q(grupo__isnull=True)), name="chk_bolsillo_owner"),
            models.UniqueConstraint(fields=["usuario", "nombre"], name="uk_bolsillo_usuario_nombre"),
            models.UniqueConstraint(fields=["grupo", "nombre"], name="uk_bolsillo_grupo_nombre"),
        ]


class Categoria(models.Model):
    categoria_id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    grupo = models.ForeignKey(Grupo, on_delete=models.SET_NULL, null=True, blank=True)
    nombre = models.CharField(max_length=100)
    TIPO_CHOICES = [("ing", "ing"), ("eg", "eg")]
    tipo = models.CharField(max_length=3, choices=TIPO_CHOICES)

    class Meta:
        db_table = "categoria"
        constraints = [
            models.CheckConstraint(check=(models.Q(usuario__isnull=True) ^ models.Q(grupo__isnull=True)), name="chk_categoria_owner"),
            models.UniqueConstraint(fields=["usuario", "nombre", "tipo"], name="uk_cat_u_nombre_tipo"),
            models.UniqueConstraint(fields=["grupo", "nombre", "tipo"], name="uk_cat_g_nombre_tipo"),
        ]


class Transferencia(models.Model):
    transferencia_id = models.AutoField(primary_key=True)
    de_bolsillo = models.ForeignKey(Bolsillo, related_name="transferencias_origen", on_delete=models.RESTRICT)
    a_bolsillo = models.ForeignKey(Bolsillo, related_name="transferencias_destino", on_delete=models.RESTRICT)
    monto_origen = models.DecimalField(max_digits=14, decimal_places=2)
    monto_destino = models.DecimalField(max_digits=14, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    creado_por = models.ForeignKey(Usuario, on_delete=models.RESTRICT)

    class Meta:
        db_table = "transferencia"
        constraints = [
            models.CheckConstraint(check=~models.Q(de_bolsillo=models.F('a_bolsillo')), name="chk_transferencia_bolsillos_diff"),
            models.CheckConstraint(check=(models.Q(monto_origen__gt=0) & models.Q(monto_destino__gt=0)), name="chk_transferencia_montos_pos"),
        ]


class Ingreso(models.Model):
    ingreso_id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    grupo = models.ForeignKey(Grupo, on_delete=models.SET_NULL, null=True, blank=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True)
    bolsillo = models.ForeignKey(Bolsillo, on_delete=models.SET_NULL, null=True, blank=True)
    transferencia = models.ForeignKey(Transferencia, on_delete=models.SET_NULL, null=True, blank=True)
    monto = models.DecimalField(max_digits=14, decimal_places=2)
    fecha = models.DateField()
    descripcion = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "ingreso"
        constraints = [
            models.CheckConstraint(check=(models.Q(usuario__isnull=True) ^ models.Q(grupo__isnull=True)), name="chk_ingreso_owner"),
            models.CheckConstraint(check=models.Q(monto__gt=0), name="chk_ingreso_monto"),
        ]


class Egreso(models.Model):
    egreso_id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    grupo = models.ForeignKey(Grupo, on_delete=models.SET_NULL, null=True, blank=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True)
    bolsillo = models.ForeignKey(Bolsillo, on_delete=models.SET_NULL, null=True, blank=True)
    transferencia = models.ForeignKey(Transferencia, on_delete=models.SET_NULL, null=True, blank=True)
    monto = models.DecimalField(max_digits=14, decimal_places=2)
    fecha = models.DateField()
    descripcion = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "egreso"
        constraints = [
            models.CheckConstraint(check=(models.Q(usuario__isnull=True) ^ models.Q(grupo__isnull=True)), name="chk_egreso_owner"),
            models.CheckConstraint(check=models.Q(monto__gt=0), name="chk_egreso_monto"),
        ]


class Movimiento(models.Model):
    movimiento_id = models.AutoField(primary_key=True)
    TIPO_CHOICES = [("ing", "ing"), ("eg", "eg")]
    tipo = models.CharField(max_length=3, choices=TIPO_CHOICES)
    monto = models.DecimalField(max_digits=15, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    grupo = models.ForeignKey(Grupo, on_delete=models.SET_NULL, null=True, blank=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True)
    bolsillo = models.ForeignKey(Bolsillo, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = "movimiento"
        constraints = [
            models.CheckConstraint(check=(models.Q(usuario__isnull=True) ^ models.Q(grupo__isnull=True)), name="chk_movimiento_owner"),
            models.CheckConstraint(check=models.Q(monto__gt=0), name="chk_movimiento_monto"),
        ]
