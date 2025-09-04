import base64
import cv2
import numpy as np
from PIL import Image
from io import BytesIO

def image_to_base64(image_path: str) -> str:
    """Convert image file to base64 string"""
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode()
    return f"data:image/jpeg;base64,{encoded_string}"

def base64_to_cv2(base64_string: str) -> np.ndarray:
    """Convert base64 string to OpenCV image"""
    if "," in base64_string:
        base64_string = base64_string.split(",")[1]
    
    image_data = base64.b64decode(base64_string)
    pil_image = Image.open(BytesIO(image_data))
    
    if pil_image.mode != 'RGB':
        pil_image = pil_image.convert('RGB')
    
    cv2_image = np.array(pil_image)
    cv2_image = cv2.cvtColor(cv2_image, cv2.COLOR_RGB2BGR)
    
    return cv2_image

def validate_image_format(base64_string: str) -> bool:
    """Validate if base64 string represents a valid image"""
    try:
        base64_to_cv2(base64_string)
        return True
    except:
        return False

def resize_image(image: np.ndarray, max_width: int = 800, max_height: int = 600) -> np.ndarray:
    """Resize image while maintaining aspect ratio"""
    height, width = image.shape[:2]
    
    if width <= max_width and height <= max_height:
        return image
    
    # Calculate scaling factor
    width_scale = max_width / width
    height_scale = max_height / height
    scale = min(width_scale, height_scale)
    
    # Calculate new dimensions
    new_width = int(width * scale)
    new_height = int(height * scale)
    
    # Resize image
    resized_image = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)
    
    return resized_image
