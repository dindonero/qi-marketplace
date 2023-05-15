import cv2
import os

# Set the directory where the images are stored
image_dir = "./KARACTERS/"

# Loop through each image in the directory
for filename in os.listdir(image_dir):
    if filename.endswith(".png"):
        # Open the image and convert it to RGBA mode
        img = cv2.imread(image_dir + filename)
        
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Threshold the image to create a mask of the white background
        _, mask = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY)
        
        # Invert the mask so that the foreground object is white and the background is black
        mask_inv = cv2.bitwise_not(mask)

        # Convert the original image to BGRA (4 channels)
        bgra = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

        # Apply the mask to set the alpha channel of the background pixels to 0
        bgra[:, :, 3] = mask_inv
        # Save the result as a PNG file
        cv2.imwrite(image_dir + "BACKGROUND_REMOVAL/" + filename.split(".")[0] + "_transparent.png", bgra)

