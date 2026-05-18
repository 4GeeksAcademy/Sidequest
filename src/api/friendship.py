"""
Usage examples for friendship features.
Demonstrates how to implement each user story.
"""
 
from models import db, User, FriendRequest, FriendRequestStatus
 
 
# HU-04: Send friend request (read QR code)
def send_friend_request(sender_id: int, receiver_id: int) -> dict:
    """
    Send a friend request from one user to another.
 
    In practice, the receiver_id comes from scanning the QR code
    (which contains the user ID).
 
    Args:
        sender_id: ID of the user sending the request
        receiver_id: ID of the user receiving the request (from QR scan)
 
    Returns:
        dict with request status and message
    """
    # Validate users exist
    sender = User.query.get(sender_id)
    receiver = User.query.get(receiver_id)
 
    if not sender or not receiver:
        return {"success": False, "message": "User not found"}
 
    if sender_id == receiver_id:
        return {"success": False, "message": "Cannot send request to yourself"}
 
    # Check if request already exists
    existing_request = FriendRequest.query.filter(
        ((FriendRequest.sender_id == sender_id) & (FriendRequest.receiver_id == receiver_id)) |
        ((FriendRequest.sender_id == receiver_id) & (FriendRequest.receiver_id == sender_id))
    ).first()
 
    if existing_request:
        return {"success": False, "message": "Friend request already exists"}
 
    # Create new friend request
    friend_request = FriendRequest(
        sender_id=sender_id,
        receiver_id=receiver_id,
        status=FriendRequestStatus.PENDING
    )
 
    db.session.add(friend_request)
    db.session.commit()
 
    return {
        "success": True,
        "message": "Friend request sent successfully",
        "request_id": friend_request.id
    }
 
 
# HU-05: Accept friend request
def accept_friend_request(request_id: int, user_id: int) -> dict:
    """
    Accept a friend request.
 
    Args:
        request_id: ID of the friend request to accept
        user_id: ID of the user accepting the request (should be the receiver)
 
    Returns:
        dict with acceptance status
    """
    friend_request = FriendRequest.query.get(request_id)
 
    if not friend_request:
        return {"success": False, "message": "Request not found"}
 
    if friend_request.receiver_id != user_id:
        return {"success": False, "message": "You cannot accept this request"}
 
    if friend_request.status != FriendRequestStatus.PENDING:
        return {"success": False, "message": f"Request is already {friend_request.status.value}"}
 
    # Accept the request
    friend_request.accept()
 
    return {
        "success": True,
        "message": "Friend request accepted",
        "new_friend": friend_request.sender.serialize()
    }
 
 
# HU-06: Reject friend request
def reject_friend_request(request_id: int, user_id: int) -> dict:
    """
    Reject a friend request.
 
    Args:
        request_id: ID of the friend request to reject
        user_id: ID of the user rejecting the request (should be the receiver)
 
    Returns:
        dict with rejection status
    """
    friend_request = FriendRequest.query.get(request_id)
 
    if not friend_request:
        return {"success": False, "message": "Request not found"}
 
    if friend_request.receiver_id != user_id:
        return {"success": False, "message": "You cannot reject this request"}
 
    if friend_request.status != FriendRequestStatus.PENDING:
        return {"success": False, "message": f"Request is already {friend_request.status.value}"}
 
    # Reject the request
    friend_request.reject()
 
    return {
        "success": True,
        "message": "Friend request rejected"
    }
 
 
# HU-07: View friends list
def get_friends_list(user_id: int) -> dict:
    """
    Get the list of accepted friends for a user.
 
    Args:
        user_id: ID of the user
 
    Returns:
        dict with friends list
    """
    user = User.query.get(user_id)
 
    if not user:
        return {"success": False, "message": "User not found"}
 
    friends = user.get_friends()
 
    return {
        "success": True,
        "user_id": user_id,
        "friends_count": len(friends),
        "friends": [friend.serialize() for friend in friends]
    }
 
 
# Additional helper functions
 
def get_pending_requests(user_id: int) -> dict:
    """
    Get pending friend requests received by a user.
    """
    user = User.query.get(user_id)
 
    if not user:
        return {"success": False, "message": "User not found"}
 
    pending_requests = user.get_pending_received_requests()
 
    return {
        "success": True,
        "pending_count": len(pending_requests),
        "pending_requests": [req.serialize() for req in pending_requests]
    }
 
 
def are_friends(user_id_1: int, user_id_2: int) -> bool:
    """
    Check if two users are friends.
    """
    friend_request = FriendRequest.query.filter(
        ((FriendRequest.sender_id == user_id_1) & (FriendRequest.receiver_id == user_id_2)) |
        ((FriendRequest.sender_id == user_id_2) & (FriendRequest.receiver_id == user_id_1)),
        FriendRequest.status == FriendRequestStatus.ACCEPTED
    ).first()
 
    return friend_request is not None
 
 
def remove_friendship(user_id_1: int, user_id_2: int) -> dict:
    """
    Remove a friendship (unfriend a user).
    """
    friend_request = FriendRequest.query.filter(
        ((FriendRequest.sender_id == user_id_1) & (FriendRequest.receiver_id == user_id_2)) |
        ((FriendRequest.sender_id == user_id_2) & (FriendRequest.receiver_id == user_id_1)),
        FriendRequest.status == FriendRequestStatus.ACCEPTED
    ).first()
 
    if not friend_request:
        return {"success": False, "message": "Friendship not found"}
 
    db.session.delete(friend_request)
    db.session.commit()
 
    return {"success": True, "message": "Friendship removed"}
 
 
# Example Flask route implementations (pseudo-code)

@app.route('/api/friends/request/<int:receiver_id>', methods=['POST'])
def send_request(receiver_id):
    sender_id = get_current_user_id()  # From JWT/session
    result = send_friend_request(sender_id, receiver_id)
    return jsonify(result), 200 if result['success'] else 400
 
 
@app.route('/api/friends/request/<int:request_id>/accept', methods=['POST'])
def accept_request(request_id):
    user_id = get_current_user_id()
    result = accept_friend_request(request_id, user_id)
    return jsonify(result), 200 if result['success'] else 400
 
 
@app.route('/api/friends/request/<int:request_id>/reject', methods=['POST'])
def reject_request(request_id):
    user_id = get_current_user_id()
    result = reject_friend_request(request_id, user_id)
    return jsonify(result), 200 if result['success'] else 400
 
 
@app.route('/api/friends', methods=['GET'])
def get_friends():
    user_id = get_current_user_id()
    result = get_friends_list(user_id)
    return jsonify(result), 200 if result['success'] else 400
 
 
@app.route('/api/friends/pending', methods=['GET'])
def get_pending():
    user_id = get_current_user_id()
    result = get_pending_requests(user_id)
    return jsonify(result), 200 if result['success'] else 400
