import mysql.connector

try:
    conn = mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="",
        database="iwpaint_optimized"
    )
    cursor = conn.cursor()
    tables = ['sales_transactions', 'products', 'customers', 'salesmen', 'supervisors', 'salesman_targets']
    for t in tables:
        print(f"\n--- {t} ---")
        try:
            cursor.execute(f"DESCRIBE {t}")
            for row in cursor.fetchall():
                print(f"{row[0]} ({row[1]})")
        except Exception as e:
            print(f"Error describing {t}: {e}")
    conn.close()
except Exception as e:
    print(f"Error connecting: {e}")
