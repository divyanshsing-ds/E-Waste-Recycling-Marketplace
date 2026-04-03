import cloudinary.uploader


def upload_image(file, folder="ewaste"):
    """Uploads a file to cloudinary and returns the URL."""
    try:
        response = cloudinary.uploader.upload(file, folder=folder)
        return response.get("secure_url")
    except Exception as e:
        # Handle specifically in production logs
        return None


def delete_image(public_id):
    """Deletes a file from cloudinary."""
    try:
        cloudinary.uploader.destroy(public_id)
        return True
    except Exception:
        return False
