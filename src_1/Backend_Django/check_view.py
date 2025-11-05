import sqlite3
import sys

def main():
    db = 'db.sqlite3'
    try:
        conn = sqlite3.connect(db)
        cur = conn.cursor()
        cur.execute("SELECT name, type FROM sqlite_master WHERE name='v_movimientos';")
        rows = cur.fetchall()
        if not rows:
            print('v_movimientos: NOT FOUND')
            return 1
        print('v_movimientos: FOUND ->', rows)
        # show up to 5 rows
        try:
            cur.execute('SELECT * FROM v_movimientos LIMIT 5;')
            for r in cur.fetchall():
                print(r)
        except Exception as e:
            print('Could not SELECT from view:', e)
        return 0
    except Exception as e:
        print('Error opening DB:', e)
        return 2

if __name__ == '__main__':
    sys.exit(main())
