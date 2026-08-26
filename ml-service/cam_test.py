import cv2
import base64

from deltoid_model import DeltoidDetectionModel


def image_to_base64(frame):
    _, buffer = cv2.imencode(".jpg", frame)
    return base64.b64encode(buffer).decode("utf-8")


model = DeltoidDetectionModel()

camera = cv2.VideoCapture(0)

if not camera.isOpened():
    print("ERROR: Camera could not be opened.")
    exit()

print("Camera started.")
print("Press Q to quit.")

while True:
    ret, frame = camera.read()

    if not ret:
        print("ERROR: Failed to read camera frame.")
        break

    # Convert frame to Base64
    image_base64 = image_to_base64(frame)

    # Detect shoulder/deltoid
    result = model.detect_deltoid(image_base64)

    if result["detected"]:
        coordinates = result["coordinates"]

        x = coordinates["x"]
        y = coordinates["y"]

        # Draw detected point
        cv2.circle(frame, (x, y), 10, (0, 255, 0), -1)

        cv2.putText(
            frame,
            f"Confidence: {result['confidence']:.2f}",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 0),
            2
        )

    else:
        cv2.putText(
            frame,
            "Person not detected",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 0, 255),
            2
        )

    cv2.imshow("Smart Vaccination - Deltoid Detection", frame)

    # Press Q to exit
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break


camera.release()
cv2.destroyAllWindows()