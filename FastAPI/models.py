from database import Base
from sqlalchemy import Column, Integer, String, Boolean, Float

#Creating the database tables

class Transaction(Base):
    #create table called transactions
    __tablename__ = 'transactions'
    #create columns and data types
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    category = Column(String)
    description = Column(String)
    is_income = Column(Boolean)
    date = Column(String)