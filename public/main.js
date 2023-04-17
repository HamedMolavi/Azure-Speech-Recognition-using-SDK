
if (!!window.SpeechSDK) {
    SpeechSDK = window.SpeechSDK;
    SpeechConfig = SpeechSDK.SpeechConfig
    AudioConfig = SpeechSDK.AudioConfig
    SpeechRecognizer = SpeechSDK.SpeechRecognizer
    console.log("SDK Imported.");
}
else {
    alert('Something went wrong!');
    $('body').eq(0).html(reloadPage)
}

const tokenRes = (async () => await getTokenOrRefresh())();

if (tokenRes.authToken === null) {
    console.log('FATAL_ERROR: ' + tokenRes.error);
    $('body').eq(0).html(reloadPage);
};

async function sttFromMic() {
    const tokenObj = await getTokenOrRefresh();
    const speechConfig = SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
    speechConfig.speechRecognitionLanguage = 'fa-IR';

    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
    console.log('speak into your microphone...');

    recognizer.recognizeOnceAsync(result => {
        let displayText = isItSuccesful(result, SpeechSDK);
        $('#output').html(displayText);
    });
};

async function fileChange(event) {
    const audioFile = event.target.files[0];
    const fileInfo = audioFile.name + ` size=${audioFile.size} bytes `;
    console.log(fileInfo);

    const tokenObj = await getTokenOrRefresh();
    const speechConfig = SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
    speechConfig.speechRecognitionLanguage = 'fa-IR';

    const audioConfig = AudioConfig.fromWavFileInput(audioFile);
    const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizeOnceAsync(result => {
        let displayText = isItSuccesful(result, speechsdk);
        $('#output').html(displayText);
    });
};
$('#audio-file').on('change', fileChange);