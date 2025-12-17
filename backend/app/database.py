from pymongo import MongoClient

MONGO_URI = "mongodb+srv://admin:<Admin123>@cluster0.bvegxfp.mongodb.net/?appName=Cluster0"

client = MongoClient(MONGO_URI)
db = client["ai_resume_analyzer"]

users_collection = db["users"]
resumes_collection = db["resumes"]
