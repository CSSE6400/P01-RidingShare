from models import db
from models.user import User


def get_user_from_username(username) -> User:
	return db.session.execute(db.select(User).filter_by(username=username)).scalars().first()

