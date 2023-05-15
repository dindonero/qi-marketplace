from PIL import Image
import os


# Set the directory where the images are stored
image_dir = "./KARACTERS/"

# Loop through each image in the directory
for filename in os.listdir(image_dir):
    if filename.endswith(".jpg") or filename.endswith(".jpeg") or filename.endswith(".png"):
        # Open the image and convert it to RGBA mode
        img = Image.open(image_dir + filename).convert("RGBA")
        datas = img.getdata()

        # Replace all white pixels with transparent pixels
        newData = []
        for item in datas:
            if item[0] > 250 and item[1] > 250 and item[2] > 250:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        # Create a new image with the transparent background
        img.putdata(newData)
        img.save(image_dir + "WHITE_REMOVAL/" + filename.split(".")[0] + "_transparent.png", "PNG")
