import { browser, LayersModel, loadLayersModel, Tensor, tidy } from '@tensorflow/tfjs'
const MOBILE_NET_PATH = 'http://172.25.144.104:8080/model/model.json'
let model: LayersModel

export const loadModel = async() => {
  model = await loadLayersModel(MOBILE_NET_PATH)
}
export const imgToTensor =  (img: HTMLImageElement) => {
  const pred = tidy(() => {
    const input = browser.fromPixels(img)
        .toFloat()
        .sub(255/2) 
        .div(255/2)
        .reshape([1, 224, 224, 3])
    return input
  })
  return pred
}

export const predict =  (features: Tensor) => {
  const resultTensor =  model.predict(features) as Tensor
  return resultTensor.argMax(1).dataSync()[0]
}