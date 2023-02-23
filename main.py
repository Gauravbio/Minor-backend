from deepface import DeepFace
import base64
image=input()

decoded_image=base64.b64decode(image)

with open("out.png","wb") as out_file:
    out_file.write(decoded_image)

result=DeepFace.analyze('out.png',actions=['emotion'])
print(result[0]['dominant_emotion'])