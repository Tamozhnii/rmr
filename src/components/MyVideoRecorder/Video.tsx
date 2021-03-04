import React from 'react'

const Video: React.FC = (): JSX.Element => {
    const video = document.querySelector('video')

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((steam) => {
        if (video) {
            video.src = window.URL.createObjectURL(steam)
        }
    })


    return (
        <div>
            <video />
        </div>
    )
}

export default Video
