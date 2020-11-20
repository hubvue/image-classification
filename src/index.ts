import {IMAGENET_CLASSES} from './classes'
import { imgToTensor, loadModel, predict } from "./predict"
const createInputElement = ():Promise<File> => {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.addEventListener('input', e => {
      const event = e as any
      const file = event.path[0].files[0]
      resolve(file)
    })
    input.click()
  })
  
}
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = e => {
      resolve(e.target.result as string)
    }
  })
} 
const base64ToImg = (base64: string):Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = document.createElement('img')
    img.width = 224;
    img.height = 224;
    img.src = base64
    img.onload = () => resolve(img)
  })
}

const getImageEle = async () => {
  const imageFile = await createInputElement()
  const imageBase64 = await fileToBase64(imageFile)
  const imgEle = await base64ToImg(imageBase64)
  return imgEle
}
async function run() {
  const btn = document.querySelector('#btn')
  const resultEle = document.querySelector('#result')
  await loadModel()
  btn.addEventListener('click', async (e) => {
      const imgElem = await getImageEle()
      const features = imgToTensor(imgElem)
      const result = predict(features)
      resultEle.innerHTML = IMAGENET_CLASSES[result]
  })
}

run()