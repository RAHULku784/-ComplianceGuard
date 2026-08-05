from sqlalchemy import Column, Integer, String, Text, Date, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func

from app.database.database import Base


class ComplianceCheck(Base):
    __tablename__ = "compliance_checks"

    check_id = Column(Integer, primary_key=True, index=True)

    rule_id = Column(
        Integer,
        ForeignKey("rules.rule_id"),
        nullable=False
    )

    company_name = Column(
        String(150),
        nullable=False
    )

    assigned_to = Column(Integer)

    due_date = Column(Date)

    status = Column(
        String(30),
        default="Pending"
    )

    remarks = Column(Text)

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )