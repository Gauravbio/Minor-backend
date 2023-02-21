import sys
from deepface import DeepFace
import cv2

image=cv2.imread(sys.argv[0])

result=DeepFace.analyze(image,actions=['emotion'])
print(result[0]['dominant_emotion'])