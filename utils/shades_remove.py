import cv2
import numpy as np
from PIL import Image
import os
import glob

# Path where the images are located
input_path = '../../5000-images/original/*'
# Output Path
output_path = '../../5000-images/transparent/'

i = 0
j = 0

for filename in glob.glob(input_path):
    # Open the image file.
    img = cv2.imread(filename, cv2.IMREAD_UNCHANGED)

    # Convert the image from BGR to RGB color space
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Create a mask where white pixels ([255, 255, 255]) are
    # This mask will be True for areas that are white.
    lower = np.array([240, 250, 250], np.uint8) # you can change these values to suit your specific use case
    upper = np.array([255, 255, 255], np.uint8) # you can change these values to suit your specific use case
    mask = cv2.inRange(img, lower, upper)

    # Create an inverted mask
    inv_mask = cv2.bitwise_not(mask)

    # Convert to a 4-channel image (RGBA) so we can use the mask in the next step
    img = cv2.cvtColor(img, cv2.COLOR_RGB2RGBA)

    # Make the image's white area transparent by applying the mask
    img[mask==255] = (255, 255, 255, 0)

    if i != 0 and i % 1000 == 0:
        j += 1
    i += 1

    # Save the output
    output_filename = os.path.join(output_path, os.path.basename(filename))
    cv2.imwrite(output_path + f'{j}/' + os.path.basename(filename).split('.')[0] + '.png', img)

"""
    import cv2
    import numpy as np
    from PIL import Image
    import os
    import glob

    # Path where the images are located
    input_path = '../../5000-images/*'
    # Output Path
    output_path = '../../5000-images/results/'

    for filename in glob.glob(input_path):
        # Open the image file.
        img = cv2.imread(filename, cv2.IMREAD_UNCHANGED)

        # Convert the image from BGR to RGB color space
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Define color range for the mask
        lower = np.array([200, 200, 200], np.uint8)
        upper = np.array([255, 255, 255], np.uint8)

        # Create a mask where the defined color range are
        mask = cv2.inRange(img, lower, upper)

        # Invert the mask
        mask_inv = cv2.bitwise_not(mask)

        # Convert to a 4-channel image (RGBA)
        img = cv2.cvtColor(img, cv2.COLOR_RGB2RGBA)

        # Use the mask to make the 'white' areas transparent
        img[mask == 255] = (255, 255, 255, 0)

        # Save the output
        output_filename = os.path.join(output_path, os.path.basename(filename))
        # Convert image from OpenCV's default BGR format to PIL's default RGB format before saving
        output_image = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGRA2RGBA))
        output_image.save(output_filename)
"""
