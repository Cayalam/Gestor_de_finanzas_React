import sqlite3
conn = sqlite3.connect('db.sqlite3')
cur = conn.cursor()
print('TABLES:')
for row in cur.execute("SELECT name FROM sqlite_master WHERE type='table'"):
    print(row[0])
print('\nSCHEMA authtoken_token:')
for row in cur.execute("PRAGMA table_info('authtoken_token')"):
    print(row)
conn.close()
