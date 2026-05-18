
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
 
db = SQLAlchemy()
 
 
class User(db.Model):
    """User model with friend request and friendship relationships."""
 
    __tablename__ = 'user'
 
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
 
    # Relationships for friend requests
    sent_requests: Mapped[list['FriendRequest']] = relationship(
        'FriendRequest',
        foreign_keys='FriendRequest.sender_id',
        backref='sender',
        cascade='all, delete-orphan'
    )
    received_requests: Mapped[list['FriendRequest']] = relationship(
        'FriendRequest',
        foreign_keys='FriendRequest.receiver_id',
        backref='receiver',
        cascade='all, delete-orphan'
    )
 
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
 
    def get_friends(self):
        """Get list of accepted friends (both directions)."""
        accepted_requests = FriendRequest.query.filter(
            ((FriendRequest.sender_id == self.id) | (FriendRequest.receiver_id == self.id)),
            FriendRequest.status == FriendRequestStatus.ACCEPTED
        ).all()
 
        friends = []
        for request in accepted_requests:
            if request.sender_id == self.id:
                friends.append(request.receiver)
            else:
                friends.append(request.sender)
 
        return friends
 
    def get_pending_received_requests(self):
        """Get pending friend requests received by this user."""
        return FriendRequest.query.filter(
            FriendRequest.receiver_id == self.id,
            FriendRequest.status == FriendRequestStatus.PENDING
        ).all()
 
    def get_pending_sent_requests(self):
        """Get pending friend requests sent by this user."""
        return FriendRequest.query.filter(
            FriendRequest.sender_id == self.id,
            FriendRequest.status == FriendRequestStatus.PENDING
        ).all()
 
 
class FriendRequestStatus(enum.Enum):
    """Enum for friend request status."""
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'
 
 
class FriendRequest(db.Model):
    """
    Model to handle friend requests between users.
 
    Supports:
    - HU-04: Send friend request (via QR code scan - use user ID)
    - HU-05: Accept friend request
    - HU-06: Reject friend request
    - HU-07: View friends list (via User.get_friends())
    """
 
    __tablename__ = 'friend_request'
 
    id: Mapped[int] = mapped_column(primary_key=True)
    sender_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)
    receiver_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)
    status: Mapped[FriendRequestStatus] = mapped_column(
        Enum(FriendRequestStatus),
        default=FriendRequestStatus.PENDING,
        nullable=False
    )
 
    def serialize(self):
        return {
            "id": self.id,
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
            "sender_email": self.sender.email if self.sender else None,
            "receiver_email": self.receiver.email if self.receiver else None,
            "status": self.status.value
        }
 
    def accept(self):
        """Accept the friend request."""
        self.status = FriendRequestStatus.ACCEPTED
        db.session.commit()
 
    def reject(self):
        """Reject the friend request."""
        self.status = FriendRequestStatus.REJECTED
        db.session.commit()