# Importing necessary modules and functions
from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware

# Create an instance of FastAPI
app = FastAPI()

# Define a list of origins that are allowed to interact with our FastAPI app
origins = [
    'http://localhost:3000',
]

# Add CORS (Cross-Origin Resource Sharing) middleware to allow requests from the defined origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Define a Pydantic model for data validation
class TransactionBase(BaseModel):
    amount: float
    category: str
    description: str
    is_income: bool
    date: str

# Extend the TransactionBase model with an ID field for responses
class TransactionModel(TransactionBase):
    id: int

    class Config:
        orm_mode = True  # Enable ORM mode for compatibility with SQLAlchemy models

# Cria e fornece uma sessao do banco, usada para interagir com o banco

def get_db():
    db = SessionLocal()  # Create a new database session
    try:
        yield db  # Provide the session to the endpoint
    finally:
        db.close()  # Close the session after the request is handled

# Dependency injection annotation for FastAPI #fornecer instâncias de objetos necessários 
# (como sessões de banco de dados) aos seus caminhos de endpoint.
db_dependency = Annotated[Session, Depends(get_db)]

# Create the database tables when the FastAPI app starts
models.Base.metadata.create_all(bind=engine)

# Define an endpoint for creating a new transaction
@app.post("/transactions/", response_model=TransactionModel)
async def create_transaction(transaction: TransactionBase, db: db_dependency):
    # Create a new Transaction model instance from the request data
    db_transaction = models.Transaction(**transaction.dict())
    db.add(db_transaction)  # Add the new transaction to the database session
    db.commit()  # Commit the changes to the database
    db.refresh(db_transaction)  # Refresh the instance with data from the database
    return db_transaction  # Return the created transaction

# Define an endpoint for retrieving transactions
@app.get("/transactions/", response_model=List[TransactionModel])
async def get_transactions(db: db_dependency, skip: int = 0, limit: int = 100):
    # Query the database for transactions, with optional skipping and limiting
    transactions = db.query(models.Transaction).offset(skip).limit(limit).all()
    return transactions  # Return the list of transactions

# Define an endpoint for deleting transactions
@app.delete("/transactions/")
async def delete_transaction(description: str, db: db_dependency):
    # Query the database to find the transaction with the given description
    transaction = db.query(models.Transaction).filter(models.Transaction.description == description).first()
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Delete the found transaction
    db.delete(transaction)
    db.commit()
    return {"detail": "Transaction deleted"}

