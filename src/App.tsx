import html2canvas from "html2canvas"
import { useEffect, useRef, useState } from "react"

function App() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const demotivatorRef = useRef<HTMLDivElement>(null)
  const [img, setImg] = useState<string>('https://placehold.co/600x400.png')
  const [result, setResult] = useState<string | null>(null)
  const uploadPic = () => {
    const files = fileInputRef.current?.files?.item(0);
    if (files) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files);
      fileReader.addEventListener("load", function () {
        setImg(this.result as string)
      });
    }
  }
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const files = e.clipboardData?.files?.item(0);
      if (files) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(files);
        fileReader.addEventListener("load", function () {
          setImg(this.result as string)
        });
      }
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  })
  // just let users copy thing manually
  const generatePic = () => {
    html2canvas(demotivatorRef.current!).then(canvas => setResult(canvas.toDataURL()))
  }
  // OLD!
  // const copyToClipboard = () => html2canvas(demotivatorRef.current!).then(canvas => canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({ 'image/png': blob! })])))
  // const download = () => {
  //   html2canvas(demotivatorRef.current!).then(canvas => {
  //     const data = canvas.toDataURL()
  //     const link = document.createElement('a')
  //     link.href = data
  //     link.download = (Math.random() * Number.MAX_SAFE_INTEGER).toString(16) + ".png"
  //     link.click()
  //   })
  // }
  return (
    <main>
      <h1>OpenDemoti</h1>
      <p>A really simple, no-bullshit demotivator generator.</p>
      <p>Upload your image or press Ctrl+V to paste clipboard image.</p>
      <p>Edit title and subtitle as you see fit. If you clear either, extra space is removed with it.</p>
      <p>Press "Generate image" to generate final result, which you can copy or download (red border not included!)</p>
      <div className="controls">
        <input type="file" ref={fileInputRef} accept="image/*" onChange={() => uploadPic()} />
        {/* <button onClick={() => setImg('https://placehold.co/600x400.png')}>Clear</button> */}
        <button onClick={() => generatePic()}>Generate image</button>
      </div>
      {result && <>
        <p>Resulting image (right click to copy or download):</p>
        <img src={result} className="result" /></>}
      <div className="block" ref={demotivatorRef}>
        <img src={img} />
        <span className="t big" contentEditable spellCheck={false}>DEMOTIVATOR TITLE</span>
        <span className="t" contentEditable spellCheck={false}>DEMOTIVATOR DESCRIPTION</span>
      </div>
    </main>
  )
}

export default App
