import cv2
import os
import np

# Set the directory where the images are stored
image_dir = "./KARACTERS/"

# Loop through each image in the directory
for filename in os.listdir(image_dir):
    if filename.endswith(".jpg") or filename.endswith(".jpeg") or filename.endswith(".png"):
        # Load the image
        img = cv2.imread(image_dir + filename)

        # Convert the image to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Apply a threshold to the image to isolate the foreground object
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

        # Find the contours of the foreground object
        contours, hierarchy = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # Create a mask for the foreground object
        mask = np.zeros(img.shape[:2], np.uint8)
        cv2.drawContours(mask, contours, -1, 255, -1)
        

        # Convert the original image to BGRA (4 channels)
        bgra = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

        # Apply the mask to set the alpha channel of the background pixels to 0
        bgra[:, :, 3] = mask

        # Save the result as a PNG file
        cv2.imwrite(image_dir + "LINE_REMOVAL/" + filename.split(".")[0] + "_transparent.png", bgra)
