# Face Grouping Feature

## Overview

The face recognition system now intelligently groups multiple encodings of the same person together for improved recognition accuracy and efficiency.

## How It Works

### 1. **Automatic Grouping**

When you enroll multiple images of the same person (same name), the system automatically:

- Groups all encodings for that person together
- Maintains a dictionary structure: `face_encodings_by_name[name] = [encoding1, encoding2, ...]`
- Logs the number of encodings per person

### 2. **Enhanced Recognition Algorithm**

The recognition process now uses a **two-strategy approach**:

#### Strategy 1: Initial Matching

- Compares the detected face with ALL individual encodings in the database
- Finds the best match (minimum distance)

#### Strategy 2: Grouped Verification

When a potential match is found, the system:

- Retrieves ALL encodings for that matched person
- Compares against all of them
- Calculates:
  - **Best distance**: Minimum distance from all encodings
  - **Average distance**: Mean distance from all encodings
  - **Match rate**: Percentage of encodings that match
  - **Confidence**: `(1 - best_distance) × 100`

#### Matching Criteria

**For single encoding (1 image enrolled):**

- Standard matching with tolerance and confidence threshold

**For multiple encodings (2+ images enrolled):**

- Confidence must be ≥ threshold (60% by default)
- AND either:
  - Match rate ≥ 50% (at least half of encodings match)
  - OR best distance < 0.4 (very strong match)

### 3. **Benefits**

✅ **Improved Accuracy**: Multiple reference images reduce false negatives
✅ **Better Robustness**: Handles different angles, lighting, expressions
✅ **Enhanced Confidence**: More data points for confidence calculation
✅ **Automatic Grouping**: No manual configuration needed

## Usage

### Enrolling Multiple Images

Simply enroll multiple images with the **same name**:

```python
# First image
POST /api/faces/enroll
{
  "name": "John Doe",
  "image_data": "base64_image_1..."
}
Response: "Face enrolled successfully for John Doe"

# Second image (different angle/lighting)
POST /api/faces/enroll
{
  "name": "John Doe",
  "image_data": "base64_image_2..."
}
Response: "Face enrolled successfully for John Doe. Now have 2 encodings for improved recognition accuracy."

# Third image
POST /api/faces/enroll
{
  "name": "John Doe",
  "image_data": "base64_image_3..."
}
Response: "Face enrolled successfully for John Doe. Now have 3 encodings for improved recognition accuracy."
```

### Recognition

Recognition automatically uses all grouped encodings:

```python
POST /api/faces/recognize
{
  "image_data": "base64_test_image..."
}

Response:
{
  "faces_detected": 1,
  "results": [
    {
      "name": "John Doe",
      "confidence": 87.5,  # Higher confidence due to multiple matches
      "face_location": [100, 200, 300, 150]
    }
  ],
  "processing_time": 0.234
}
```

### Statistics API

New endpoint to view grouping statistics:

```python
GET /api/faces/statistics

Response:
{
  "total_encodings": 15,
  "unique_people": 5,
  "people_with_multiple_encodings": 3,
  "grouped_faces": {
    "John Doe": 3,
    "Jane Smith": 2,
    "Bob Wilson": 1,
    "Alice Johnson": 4,
    "Charlie Brown": 5
  }
}
```

## Logging

Enhanced logging provides detailed matching information:

```
INFO: Loaded 3 encoding(s) for 'John Doe'
INFO: Loaded 2 encoding(s) for 'Jane Smith'
INFO: Person 'John Doe': 3 encodings, match_rate=0.67, avg_dist=0.380, best_dist=0.350, confidence=65.0%
INFO: Match found (grouped encodings): John Doe with 65.0% confidence (2/3 encodings matched)
```

## Configuration

Adjust these settings in `.env`:

```env
# Tolerance: Lower = stricter matching (0.4 recommended)
FACE_RECOGNITION_TOLERANCE=0.45

# Confidence threshold: Minimum confidence % for match (60% recommended)
FACE_RECOGNITION_CONFIDENCE_THRESHOLD=60.0
```

## Best Practices

1. **Enroll 2-4 images per person** for optimal accuracy
2. Use images with:
   - Different angles (front, slight left, slight right)
   - Different lighting conditions
   - Different expressions (if relevant)
3. Ensure all images are **clear and well-lit**
4. Keep faces **centered** in the frame

## Technical Details

### Data Structures

```python
# Individual lists (backward compatible)
known_face_encodings = [enc1, enc2, enc3, enc4, enc5]
known_face_names = ["John", "John", "John", "Jane", "Jane"]

# Grouped dictionary (new)
face_encodings_by_name = {
    "John": [enc1, enc2, enc3],
    "Jane": [enc4, enc5]
}
```

### Algorithm Complexity

- **Single encoding**: O(n) - linear scan
- **Multiple encodings**: O(n + m) where n = total encodings, m = encodings for matched person
- **Slight overhead** for grouped verification, but **significantly better accuracy**

## Migration

This feature is **backward compatible**:

- Existing single-enrollment faces work as before
- No database migration needed
- Automatically activates when multiple faces with same name exist

## Future Enhancements

Potential improvements:

- Average encoding vectors for even faster matching
- Automatic outlier detection to remove poor quality encodings
- Weighted confidence based on encoding quality
- Face clustering to suggest potential duplicates with different names
