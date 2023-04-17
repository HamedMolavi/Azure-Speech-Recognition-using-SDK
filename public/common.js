reloadPage = `
<div class="p-4">
    <button style="color: crimson;" class="p-2" onclick="()=>{window.location.href='/'}">Reload</button>
</div>
`;

function isItSuccesful(result, sdk) {
    switch (result.reason) {
        case sdk.ResultReason.RecognizedSpeech:
        case 3:
            output = `RECOGNIZED: Text=${result.text}`;
            break;
        case sdk.ResultReason.NoMatch:
            output = "NOMATCH: Speech could not be recognized.";
            break;
        case sdk.ResultReason.Canceled:
            const cancellation = sdk.CancellationDetails.fromResult(result);
            output = `CANCELED: Reason=${cancellation.reason}`;
            if (cancellation.reason == sdk.CancellationReason.Error) {
                output += `\nCANCELED: ErrorCode=${cancellation.ErrorCode}`;
                output += `\nCANCELED: ErrorDetails=${cancellation.errorDetails}`;
            };
            break;
    };
    return output;
}