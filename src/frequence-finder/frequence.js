window.onload = (async () => {
    let volumeCallback = null
    let volumeInterval = null

    const startButton = document.getElementById("start")
    const stopButton = document.getElementById("stop")
    const audio_file = document.getElementById("audio_file")
    const xhr = new XMLHttpRequest()
    // const recognition = new webkitSpeechRecognition()

    async function sendAudioindex(index) {
        // xhr.open("POST", "http://localhost:3876/notes/hertz", true)
        // xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
        // xhr.setRequestHeader(
        //     "Content-Type",
        //     "application/x-www-form-urlencoded"
        // )

        // xhr.send(
        //     JSON.stringify({
        //         index: `${index}`
        //     })
        // )

        // xhr.onreadystatechange = async () => {
        //     if (xhr.status == 200 && xhr.readyState == 4) {
        //         const { chord } = JSON.parse(xhr.responseText)
        //         console.log(chord)

        //         // document.getElementById("chord").innerHTML =
        //         //     "<h1>" + chord + "</h1>"
        //     }
        // }

        const response = await fetch("http://localhost:3876/find/scale", {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: JSON.stringify({
                index: `${index}`
            })
        })

        if (index == "fim") {
            const chord = await response.text()

            return chord
        }
    }

    try {
        // const audioStream = await navigator.mediaDevices.getUserMedia({
        //     audio: {
        //         googEchoCancellation: true,
        //         googAutoGainControl: false,
        //         googNoiseSuppression: true,
        //         googHighpassFilter: false
        //     }
        // })
        let audio = document.querySelector("audio")
        audio_file.onchange = function () {
            var files = this.files
            var file = URL.createObjectURL(files[0])
            audio.src = file
        }
        // Get the source

        const audioContext = new (AudioContext || window.webkitAudioContext)({
            sampleRate: 48000
        })

        audio.onplaying = () => audioContext.resume()

        const audioSource = audioContext.createMediaElementSource(audio)

        const analyser = audioContext.createAnalyser()

        analyser.fftSize = 1024
        analyser.minDecibels = -127
        analyser.maxDecibels = 0
        analyser.smoothingTimeConstant = 0.4
        audioSource.connect(analyser)
        var FFT = new Float32Array(analyser.frequencyBinCount)

        const notes = [
            "C",
            "C#",
            "D",
            "D#",
            "E",
            "F",
            "F#",
            "G",
            "G#",
            "A",
            "A#",
            "B"
        ]

        function autoCorrelate(buf, sampleRate) {
            // Implements the ACF2+ algorithm
            var SIZE = buf.length
            var rms = 0

            for (var i = 0; i < SIZE; i++) {
                var val = buf[i]
                rms += val * val
            }
            rms = Math.sqrt(rms / SIZE)
            if (rms < 0.01)
                // not enough signal
                return -1

            var r1 = 0,
                r2 = SIZE - 1,
                thres = 0.2
            for (let i = 0; i < SIZE / 2; i++) {
                if (Math.abs(buf[i]) < thres) {
                    r1 = i
                    break
                }
            }

            for (let j = 1; j < SIZE / 2; j++) {
                if (Math.abs(buf[SIZE - j]) < thres) {
                    r2 = SIZE - j
                    break
                }
            }

            buf = buf.slice(r1, r2)
            SIZE = buf.length

            var c = new Array(SIZE).fill(0)
            for (var i = 0; i < SIZE; i++)
                for (var j = 0; j < SIZE - i; j++)
                    c[i] = c[i] + buf[j] * buf[j + i]

            var d = 0
            while (c[d] > c[d + 1]) d++
            var maxval = -1,
                maxpos = -1
            for (var i = d; i < SIZE; i++) {
                if (c[i] > maxval) {
                    maxval = c[i]
                    maxpos = i
                }
            }
            var T0 = maxpos

            var x1 = c[T0 - 1],
                x2 = c[T0],
                x3 = c[T0 + 1]
            a = (x1 + x3 - 2 * x2) / 2
            b = (x3 - x1) / 2
            if (a) T0 = T0 - b / (2 * a)

            console.log(T0, sampleRate)
            return sampleRate / T0
        }

        function noteFromPitch(frequency) {
            var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2))
            return noteNum + 69
        }

        volumeCallback = async () => {
            analyser.getFloatTimeDomainData(FFT)

            var ac = autoCorrelate(FFT, audioContext.sampleRate)

            if (ac >= 0) {
                const note = noteFromPitch(ac)

                const noteFinal = notes[note % 12]

                await sendAudioindex(note)

                document.getElementById("Hertz").innerHTML =
                    "<h1>" + noteFinal + "</h1>"
            } else {
                document.getElementById("Hertz").innerHTML = "<h1>" + "</h1>"
            }
        }
    } catch (e) {
        console.error("Falha para inicializar", e)
    }

    startButton.addEventListener("click", () => {
        // document.getElementById("chord").innerHTML = ""
        // update a cada 100ms
        if (volumeCallback !== null && volumeInterval === null)
            volumeInterval = setInterval(volumeCallback, 100)
    })

    stopButton.addEventListener("click", async () => {
        if (volumeInterval !== null) {
            clearInterval(volumeInterval)
            volumeInterval = null

            const note = await sendAudioindex("fim")

            document.getElementById("chord").innerHTML = "<h1>" + note + "</h1>" //ver isso amanha
        }
    })
})()
