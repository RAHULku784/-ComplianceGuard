from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, Boolean
from sqlalchemy.sql import func

from app.database.database import Base


class Rule(Base):
    __tablename__ = "rules"

    rule_id = Column(Integer, primary_key=True, index=True)

    rule_name = Column(String(150), nullable=False)

    description = Column(Text)

    category = Column(String(100))

    severity = Column(String(50))

    status = Column(Boolean, default=True)

    created_by = Column(Integer)

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )

    updated_at = Column(
        TIMESTAMP,
        server_default=func.now(),
        onupdate=func.now()
    )