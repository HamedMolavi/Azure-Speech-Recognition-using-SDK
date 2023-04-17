async function getTokenOrRefresh() {
    const speechToken = Cookies.get('speech-token');

    if (speechToken === undefined) {
        try {
            const res = await fetch('/api/get-speech-token').then(res => res.json());
            const token = res.token;
            const region = res.region;
            console.log('Token Updated.')
            return { authToken: token, region: region };
        } catch (err) {
            console.log(err);
            return { authToken: null, error: err.response.data };
        }
    } else {
        const idx = speechToken.indexOf(':');
            console.log('Token Cached with cookie.')
            return { authToken: speechToken.slice(idx + 1), region: speechToken.slice(0, idx) };
    };
};