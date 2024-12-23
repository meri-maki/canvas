/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from 'react'
import { domToBlob } from "modern-screenshot"

import './App.css'
export async function promisifyFileReader(input: File) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = (e) => resolve(e.target?.result)
        fileReader.onerror = (e) => reject(e.target?.error)
        fileReader.readAsDataURL(input)
    })
}

function App() {
  const [generation, setGeneration] = useState('')
 const createBlob = useCallback(async (): Promise<Blob | null> => {
        const node = document.getElementById("story")
        if (!node) return null
        try {
            const blob = await domToBlob(node, {
                width: 430,
                backgroundColor: "#18181b",
                drawImageInterval: 200,
                timeout: 300,
                debug: true,
                maximumCanvasSize: 4096
                /*  fetch: {
                    bypassingCache: true
                } */
            })
            console.log("generate block run", blob, blob.size)
            if (!blob) {
                throw new Error("Failed to create blob from element")
            }
            return blob
        } catch (err) {

            console.log(err, "error create blob")
            return null
        }
    }, [])

    const handleStoryShare = useCallback(async () => {
        const results: Array<[string | null, string | Blob | null]> = []
        for (let n = 0; n < 1; n++) {
            // Generate first two blobs without storing
            const blob = await createBlob()
            results.push([null, blob])
        }
        // Generate and convert the third blob
        const thirdBlob = await createBlob()
        if (thirdBlob) {
            const file = new File([thirdBlob], "image.png", { type: thirdBlob.type })
            const fileFromReader = await promisifyFileReader(file)
            results.push(["link", fileFromReader as string])
        }

        // Use the last entry (the converted one) if it exists
        const lastResult = results[results.length - 1]

        if (lastResult && lastResult[1] && lastResult[0]) {
            const [_sourceImageUrl, storedBlob] = lastResult
setGeneration(storedBlob as string)

        }

        // Turn off loader

    }, [createBlob])
  return (
    <>
      <div id='story'>
       
       
          <img src="https://tooncoin-assets.photo-cdn.net/toonnation-test/tw/ea7a7a68f12007733f7eadc496bfb9f9a001b558_mWM.png" className="logo react" alt="React logo" height={300}/>
        
      <h1>demo</h1>
      <button onClick={handleStoryShare}>GENERATE</button>
      </div>
      <div className="card">
        <h2>Result of generation</h2>
         {generation && <img src={generation} className="logo react" alt="React logo" height={300}/>} 
        </div>
    </>
  )
}

export default App
