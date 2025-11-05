import sqlite3
conn = sqlite3.connect('db.sqlite3')
cur = conn.cursor()
print('USUARIOS:')
for row in cur.execute('SELECT usuario_id, email, nombre, divisa_pref FROM usuario'):
    print(row)
print('\nTOKENS:')
for row in cur.execute('SELECT "key", created, user_id FROM authtoken_token'):
    print(row)
conn.close()
