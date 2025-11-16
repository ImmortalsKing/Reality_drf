fetch('http://127.0.0.1:8000/feedbacks/')
    .then(res => {
        if (!res.ok) {
            console.log('something went wrong...');
        }
        return res.json()
    })
    .then(data => {
        console.log(data[0].hashtag);
    })
    .catch(error => {
        console.log(error);
    })