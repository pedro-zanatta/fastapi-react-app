from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Connecting our fastAPI app to our sqlite database

# This line defines the URL for connecting to a database. Here, it specifies a SQLite database named finance.db located in the current directory (./). 
# SQLite is a lightweight disk-based database that doesn't require a separate server process.
URL_DATABASE = 'sqlite:///./finance.db'

# create_engine creates an engine instance which is the starting point for any SQLAlchemy application. 
# It's responsible for connecting to the database using the provided URL.
# connect_args={"check_same_thread": False} is specific to SQLite and is used to disable SQLite's 
# default behavior of allowing only one thread to communicate with the database at a time. 
# This setting is necessary for applications like FastAPI, where multiple threads might interact with the database concurrently.
engine = create_engine(URL_DATABASE, connect_args={"check_same_thread": False})

# cria sessoes do banco que vao ser usadas em todas as interacoes com o banco
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#cria uma classe base para o modelo sql
Base = declarative_base()