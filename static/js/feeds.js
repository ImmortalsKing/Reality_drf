const apiUrl = '/feedbacks/';
const csrftoken = document.querySelector('meta[name="csrftoken"]').getAttribute('content');
const spinnerEL = document.querySelector('.spinner');
let allFeedbacks = []

const textAreaEL = document.querySelector('.form__textarea');
const submitbtnEL = document.querySelector('.submit-btn');
const counterEL = document.querySelector('.counter');
const formEL = document.querySelector('.form');
const feedbacksEL = document.querySelector('.feedbacks');
const hashtagsEL = document.querySelector('.hashtags')

textAreaEL.addEventListener('input', () => {
    counterEL.textContent = 150 - textAreaEL.value.length;
})

function scrollToLastFeedback() {
    const lastMessage = feedbacksEL.lastElementChild;
    if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth" })
    } else {
        console.error('No feedback to scroll in.')
    }
}

submitbtnEL.addEventListener('click', (event) => {
    event.preventDefault()
    if (textAreaEL.value.length >= 10 && textAreaEL.value.includes('#')) {
        formEL.classList.add('form--valid')
        setTimeout(() => {
            formEL.classList.remove('form--valid')
        }, 2000)
        const text = textAreaEL.value;
        const hashtag = text.split(' ').find(word => word.includes('#')).substring(1);
        const badgeLetter = hashtag.substring(0, 1).toUpperCase()
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
        feedbacksEL.insertAdjacentHTML('beforeend', `
            <li class="feedback">
            <button class="upvote">
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${feedItem.badge_letter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${feedItem.hashtag}</p>
                <p class="feedback__text">${feedItem.text}</p>
            </div>
            <p class="feedback__date">NOW</p>
        </li>
            `)
        textAreaEL.value = '';
        counterEL.textContent = 150;
        submitbtnEL.blur();
        scrollToLastFeedback()
    } else {
        formEL.classList.add('form--invalid')
        setTimeout(() => {
            formEL.classList.remove('form--invalid')
        }, 2000)
        textAreaEL.focus()
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
            allFeedbacks = data;

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


// add expand event to feedbacks

const clickHandler = event => {
    const clickEL = event.target;
    if (clickEL.className.includes('upvote')) {
        console.log('Nothing happend...');
    } else {
        clickEL.closest('.feedback').classList.toggle('feedback--expand');
    };
};

feedbacksEL.addEventListener('click', clickHandler)

// find feedbacks from hashtags

const findFeedbacksFromHashtags = event => {
    const clickEL = event.target;
    console.log(clickEL);
    if (clickEL.className === 'hashtags') {
        return;
    } else if (clickEL.textContent.includes('AllFeedbacks')) {
        feedbacksEL.innerHTML = '';
        showFeedbacksList()
    } else {
        const selectedHashtagEL = clickEL.closest('.hashtag').textContent.substring(1).trim().toLowerCase();
        console.log(selectedHashtagEL);

        const filteredFeedbacks = allFeedbacks.filter(feed =>
            feed.hashtag.toLowerCase().trim() === selectedHashtagEL
        );
        console.log(filteredFeedbacks);

    }
}

hashtagsEL.addEventListener('click', findFeedbacksFromHashtags)