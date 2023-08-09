from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import sessionmaker, declarative_base
import psycopg2
import json
import os
from dotenv import load_dotenv
load_dotenv()

engine = create_engine(os.getenv('ENGINE'))
Base = declarative_base()

dbname = os.getenv('DBNAME')
user = os.getenv('USER')
password = os.getenv('PASSWORD')
host = os.getenv('HOST')

class BudgetLines(Base):
    __tablename__ = 'budget_lines'

    id = Column(Integer, primary_key=True)
    budgetid = Column(Integer)
    userid = Column(Integer)
    month = Column(String)
    category = Column(String)
    goal = Column(Float)
    currentvalue = Column(Float)

def insert_new_budget_line(budgetid,
                           userid,
                           month,
                           category,
                           goal,
                           currentvalue):
    Session = sessionmaker(bind=engine)
    session = Session()

    Base.metadata.create_all(engine)

    new_budget_line = BudgetLines(budgetid=budgetid,
                                  userid=userid,
                                  month=month,
                                  category=category,
                                  goal=goal,
                                  currentvalue=currentvalue)
    session.add(new_budget_line)
    session.commit()

def create_table(table_name, column_list, type_list):
    conn = psycopg2.connect(
    dbname=dbname,
    user=user,
    password=password,
    host=host
    )
    cur = conn.cursor()
    # Execute a SQL query
    sql = f"CREATE TABLE {table_name} ("
    for i in range(len(column_list)):
        column = str(column_list[i])
        var_type = str(type_list[i])
        if i == len(column_list)-1:
            sql+=column+" "+var_type
        else:
            sql+=column+" "+var_type+", "
    sql+=");"
    print(sql)
    cur.execute(sql)
    conn.commit()

    cur.close()
    conn.close()

def fetch_data_by_user(table_name,userid):
    conn = psycopg2.connect(
    dbname=dbname,
    user=user,
    password=password,
    host=host
    )
    cur = conn.cursor()
    # Fetch all the rows
    sql = f"SELECT * FROM {table_name} WHERE userid={userid};"
    cur.execute(sql)
    # Fetch column names from cursor's description
    column_names = [desc[0] for desc in cur.description]

    rows = cur.fetchall()

    # Convert rows to list of dictionaries
    dict_rows = [dict(zip(column_names, row)) for row in rows]
    result_dict = {row[column_names.index('id')]: {column_name: value for column_name, value in zip(column_names, row) if column_name != 'id'} for row in rows}
    # Convert list of dictionaries to JSON
    json_data = json.dumps(dict_rows)

    # Close the connection
    cur.close()
    conn.close()

    return json_data