import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import get_settings
from datetime import datetime

settings = get_settings()

async def verify_vacancies():
    """Verify vacancies in the database"""
    print("🔍 Verifying Vacancy System...")
    print("=" * 60)
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.DATABASE_NAME]
    vacancies = db.vacancies
    
    try:
        # Count total vacancies
        total = await vacancies.count_documents({})
        print(f"\n📊 Total vacancies in database: {total}")
        
        if total == 0:
            print("\n⚠️  No vacancies found. Create one through the admin dashboard!")
            print("   URL: http://localhost:3000/dashboard/admin/vacancies/create")
        else:
            print("\n✅ Vacancies found! Here are the details:\n")
            print("-" * 60)
            
            # Get all vacancies
            cursor = vacancies.find({})
            async for vacancy in cursor:
                print(f"\n📋 Vacancy ID: {vacancy.get('_id')}")
                print(f"   Job Title: {vacancy.get('job_title')}")
                print(f"   Department: {vacancy.get('department')}")
                print(f"   Positions: {vacancy.get('positions')}")
                print(f"   Status: {vacancy.get('status')}")
                print(f"   Hiring For: {vacancy.get('hiring_for')}")
                print(f"   Salary: ${vacancy.get('salary_min'):,} - ${vacancy.get('salary_max'):,}")
                print(f"   Created: {vacancy.get('created_at').strftime('%Y-%m-%d %H:%M:%S')}")
                print(f"   Created By: {vacancy.get('created_by')}")
                print(f"   Skills: {', '.join(vacancy.get('skills', []))[:50]}...")
                print("-" * 60)
        
        # Check vacancy statuses
        print("\n📈 Vacancy Status Breakdown:")
        statuses = await vacancies.distinct("status")
        for status in statuses:
            count = await vacancies.count_documents({"status": status})
            print(f"   {status.title()}: {count}")
        
        # Check hiring types
        print("\n🎯 Hiring Types:")
        hiring_types = await vacancies.distinct("hiring_for")
        for htype in hiring_types:
            count = await vacancies.count_documents({"hiring_for": htype})
            print(f"   {htype}: {count}")
        
        print("\n" + "=" * 60)
        print("✅ Verification complete!")
        print("\n🌐 Quick Links:")
        print("   • Admin Dashboard: http://localhost:3000/dashboard/admin/vacancies/list")
        print("   • Public Vacancies: http://localhost:3000/vacancies")
        print("   • Create Vacancy: http://localhost:3000/dashboard/admin/vacancies/create")
        print("   • API Docs: http://localhost:8000/docs")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
    finally:
        client.close()
        print("\n🔌 Database connection closed")

if __name__ == "__main__":
    asyncio.run(verify_vacancies())
