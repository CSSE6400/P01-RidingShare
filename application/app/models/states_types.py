from enum import Enum


class TripRequestState(Enum):
    PENDING = "Pending"
    MATCHED = "Matched"
    CANCELLED = "Cancelled"


class TripState(Enum):
    PENDING = "Pending"
    MATCHED = "Matched"
    CANCELLED = "Cancelled"
    ONGOING = "Ongoing"
    COMPLETED = "Completed"
