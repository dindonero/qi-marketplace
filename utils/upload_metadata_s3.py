import boto3
import gspread
import pandas as pd
from oauth2client.service_account import ServiceAccountCredentials

AWS_ACCESS_KEY_ID='AKIAUNWF6BHQVLSM3NEM'
AWS_SECRET_ACCESS_KEY='yRHfHHXCvhBsLe5/pVT9gBAAFxisaws2u9jPpiMb'

BUCKET='qicity-transparent'



url = "https://docs.google.com/spreadsheets/d/your-spreadsheet-id/pub?output=csv"
df = pd.read_csv(url)

# Replace 'Sheet1' with your sheet name
sheet = client.open('Sheet1').sheet1

# Get all values and convert them to pandas DataFrame
data = sheet.get_all_values()
df = pd.DataFrame(data[1:], columns=data[0])

# Now, let's iterate over all rows in the DataFrame and upload the images to S3
s3 = boto3.client('s3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    #aws_session_token='my_session_token' TODO is this needed?
)

for index, row in df.iterrows():
    image_filename = row['image filename']
    gender = row['gender']
    zodiac_animal = row['zodiac animal']
    color = row['color']
    image_location = row['image location']

    # Download the image from S3 to a local file
    s3.download_file('my-bucket', image_filename, image_filename)

    # Re-upload the file with metadata
    s3.upload_file(image_filename, 'my-bucket', image_filename, ExtraArgs={
        'Metadata': {
            'gender': gender,
            'zodiac-animal': zodiac_animal,
            'color': color,
            'image-location': image_location
        }
    })
