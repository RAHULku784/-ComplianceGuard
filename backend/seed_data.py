from datetime import date, timedelta

from app.database.database import SessionLocal
from app.models.company import Company
from app.models.rule import Rule
from app.models.compliance_check import ComplianceCheck
from app.models.user import User


db = SessionLocal()

try:
    print("Starting database seed...")

    # -------------------------------------------------
    # 1. COMPANIES
    # -------------------------------------------------

    company_data = [
        {
            "company_name": "ABC Technologies Pvt Ltd",
            "gstin": "20ABCDE1234F1Z5",
            "email": "compliance@abctech.com",
            "phone": "9876543210",
            "address": "Ranchi, Jharkhand"
        },
        {
            "company_name": "SmartTrade Pvt Ltd",
            "gstin": "19SMART1234A1Z8",
            "email": "admin@smarttrade.com",
            "phone": "9876500001",
            "address": "Kolkata, West Bengal"
        },
        {
            "company_name": "TechNova Solutions",
            "gstin": "21TECHN1234B1Z6",
            "email": "legal@technova.com",
            "phone": "9876500002",
            "address": "Bhubaneswar, Odisha"
        },
        {
            "company_name": "Global Finance Ltd",
            "gstin": "27GLOBL1234C1Z9",
            "email": "audit@globalfinance.com",
            "phone": "9876500003",
            "address": "Mumbai, Maharashtra"
        }
    ]

    companies = []

    for data in company_data:

        company = (
            db.query(Company)
            .filter(
                Company.company_name == data["company_name"]
            )
            .first()
        )

        if not company:
            company = Company(**data)
            db.add(company)
            db.flush()

        companies.append(company)

    print("Companies ready.")

    # -------------------------------------------------
    # 2. COMPLIANCE RULES
    # -------------------------------------------------

    rule_data = [
        {
            "rule_name": "GST Return Filing",
            "description": "Monthly GST return must be filed before the due date.",
            "category": "Tax",
            "severity": "High"
        },
        {
            "rule_name": "Annual Financial Audit",
            "description": "Annual financial statements require compliance audit.",
            "category": "Finance",
            "severity": "Critical"
        },
        {
            "rule_name": "KYC Verification",
            "description": "Customer KYC information must remain verified.",
            "category": "Regulatory",
            "severity": "High"
        },
        {
            "rule_name": "Data Privacy Review",
            "description": "Review organizational data privacy controls.",
            "category": "Privacy",
            "severity": "Medium"
        },
        {
            "rule_name": "Security Assessment",
            "description": "Periodic information security assessment.",
            "category": "Security",
            "severity": "Critical"
        }
    ]

    rules = []

    # Existing user will own seeded rules.
    admin = (
        db.query(User)
        .order_by(User.user_id.asc())
        .first()
    )

    if not admin:
        raise Exception(
            "No user exists. Create/login a user before running seed_data.py."
        )

    for data in rule_data:

        rule = (
            db.query(Rule)
            .filter(
                Rule.rule_name == data["rule_name"]
            )
            .first()
        )

        if not rule:

            rule = Rule(
                rule_name=data["rule_name"],
                description=data["description"],
                category=data["category"],
                severity=data["severity"],
                status=True,
                created_by=admin.user_id
            )

            db.add(rule)
            db.flush()

        rules.append(rule)

    print("Compliance rules ready.")

    # -------------------------------------------------
    # 3. DEMO AUDITS / COMPLIANCE CHECKS
    # -------------------------------------------------

    # Avoid creating the demo records every time
    # the script is executed.
    existing_demo_check = (
        db.query(ComplianceCheck)
        .filter(
            ComplianceCheck.company_name ==
            "ABC Technologies Pvt Ltd"
        )
        .first()
    )

    if not existing_demo_check:

        today = date.today()

        audit_data = [
            # Completed
            {
                "rule": rules[0],
                "company": companies[0],
                "status": "Completed",
                "due_date": today - timedelta(days=20),
                "remarks": "GST filing successfully verified."
            },
            {
                "rule": rules[2],
                "company": companies[1],
                "status": "Completed",
                "due_date": today - timedelta(days=12),
                "remarks": "KYC verification completed."
            },
            {
                "rule": rules[3],
                "company": companies[2],
                "status": "Completed",
                "due_date": today - timedelta(days=5),
                "remarks": "Privacy review completed."
            },

            # Pending
            {
                "rule": rules[0],
                "company": companies[1],
                "status": "Pending",
                "due_date": today + timedelta(days=14),
                "remarks": "GST documents under preparation."
            },
            {
                "rule": rules[3],
                "company": companies[3],
                "status": "Pending",
                "due_date": today + timedelta(days=10),
                "remarks": "Privacy review scheduled."
            },

            # Due soon -> notification
            {
                "rule": rules[2],
                "company": companies[0],
                "status": "Pending",
                "due_date": today + timedelta(days=3),
                "remarks": "KYC verification requires attention."
            },
            {
                "rule": rules[4],
                "company": companies[2],
                "status": "Pending",
                "due_date": today + timedelta(days=6),
                "remarks": "Security assessment scheduled."
            },

            # Overdue
            {
                "rule": rules[1],
                "company": companies[3],
                "status": "Pending",
                "due_date": today - timedelta(days=8),
                "remarks": "Financial audit deadline missed."
            },
            {
                "rule": rules[4],
                "company": companies[1],
                "status": "Pending",
                "due_date": today - timedelta(days=4),
                "remarks": "Security assessment overdue."
            },
            {
                "rule": rules[0],
                "company": companies[2],
                "status": "Pending",
                "due_date": today - timedelta(days=2),
                "remarks": "GST filing overdue."
            }
        ]

        for item in audit_data:

            check = ComplianceCheck(
                rule_id=item["rule"].rule_id,
                company_name=item["company"].company_name,
                assigned_to=admin.user_id,
                due_date=item["due_date"],
                status=item["status"],
                remarks=item["remarks"]
            )

            db.add(check)

        print("Demo audits created.")

    else:
        print(
            "Demo compliance checks already exist. "
            "Skipping duplicate creation."
        )

    db.commit()

    print("---------------------------------------")
    print("DATABASE SEEDED SUCCESSFULLY")
    print("---------------------------------------")

finally:
    db.close()