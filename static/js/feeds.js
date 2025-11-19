const apiUrl = '/feedbacks/';
const csrftoken = document.querySelector('meta[name="csrftoken"]').getAttribute('content');
const spinnerEL = document.querySelector('.spinner');

const textAreaEL = document.querySelector('.form__textarea');
const submitbtnEL = document.querySelector('.submit-btn');
const counterEL = document.querySelector('.counter');
const formEL = document.querySelector('.form');
const feedbacksEL = document.querySelector('.feedbacks');

textAreaEL.addEventListener('input', () => {
    counterEL.textContent = 150 - textAreaEL.value.length;
})

submitbtnEL.addEventListener('click', (event) => {
    event.preventDefault()
    if (textAreaEL.value.length >= 10 && textAreaEL.value.includes('#')) {
        formEL.classList.add('form--valid')
        setTimeout(() => {
            formEL.classList.remove('form--valid')
        }, 2000)
        const text = textAreaEL.value;
        const hashtag = text.split(' ').find(word => word.includes('#')).substring(1);
        const badgeLetter = hashtag.substring(1, 2).toUpperCase()
        const feedItem = {
            'text': text,
            'hashtag': hashtag,
            'badge_letter': badgeLetter
        }
        const postFeedback = async (feed) => {
            try {
                const res = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify(feed),
                    credentials: 'include'
                })
                if (!res.ok) {
                    console.log('Something went wrong...');
                    return;
                }
            } catch (error) {
                console.log("Error: ", error);

            }
        }
        postFeedback(feedItem)
    }
})

const showFeedbacksList = async () => {
    try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
            console.log('Something Went Wrong...');
            return;
        }
        const data = await res.json()
        if (data) {
            spinnerEL.classList.remove('spinner')
            data.forEach(feed => {
                feedbacksEL.insertAdjacentHTML('beforeend', `
            <li class="feedback">
            <button class="upvote">
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${feed.badge_letter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${feed.hashtag}</p>
                <p class="feedback__text">${feed.text}</p>
            </div>
            <p class="feedback__date">${feed.create_date}</p>
        </li>
            `)
            });
        }
    }
    catch (error) {
        console.log("Error: ", error);
    }
}
showFeedbacksList()