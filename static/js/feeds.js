// All Elements and inputes

const apiUrl = '/feedbacks/';
const csrftoken = document.querySelector('meta[name="csrftoken"]').getAttribute('content');
const spinnerEL = document.querySelector('.spinner');
let allFeedbacks = [];
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
const todayDate = `${year}-${month}-${day}`;
const timer = 2000;
const textAreaEL = document.querySelector('.form__textarea');
const submitbtnEL = document.querySelector('.submit-btn');
const counterEL = document.querySelector('.counter');
const formEL = document.querySelector('.form');
const feedbacksEL = document.querySelector('.feedbacks');
const hashtagsEL = document.querySelector('.hashtags');

/////////

// preloader

window.addEventListener('load', () => {
    setTimeout(() => {
      const preloader = document.getElementById('preloader');
      const content = document.getElementById('content');
      
      preloader.classList.add('hide-preloader');

      setTimeout(() => {
        preloader.style.display = 'none';
        content.style.display = 'block';
      }, 500);
    }, 1000);
  });

/////////

// render single feedback

function renderFeedbackItem(feedback) {
    const feedItem = `
            <li class="feedback">
            <button id="${feedback.id}" class="upvote">
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${feedback.badge_letter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${feedback.hashtag}</p>
                <p class="feedback__text">${feedback.text}</p>
            </div>
            <p class="feedback__date">${feedback.create_date == todayDate ? 'TODAY' : feedback.create_date}</p>
        </li>
            `
    feedbacksEL.insertAdjacentHTML('beforeend', feedItem)
}

////////

// render all feedbacks

function renderAllFeedbacks(feedbackList) {
    feedbacksEL.innerHTML = '';
    feedbackList.forEach(feedItem => {
        renderFeedbackItem(feedItem);
    });
};

////////

// scroll to last feedback after post

function scrollToLastFeedback() {
    const lastMessage = feedbacksEL.lastElementChild;
    if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth" })
    } else {
        console.error('No feedback to scroll in.')
    }
}

////////

// characters counter calculator

textAreaEL.addEventListener('input', () => {
    counterEL.textContent = 150 - textAreaEL.value.length;
})

////////

// form Element class changer

const showVisualIndicator = (textCheack) => {
    const className = textCheack === 'valid' ? 'form--valid' : 'form--invalid';
    formEL.classList.add(className);
    setTimeout(() => {
        formEL.classList.remove(className);
    }, timer);
};

////////

// post single feedback

submitbtnEL.addEventListener('click', (event) => {
    event.preventDefault()
    if (textAreaEL.value.length >= 10 && textAreaEL.value.includes('#')) {
        showVisualIndicator('valid')
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
        postFeedback(feedItem);
        renderFeedbackItem(feedItem);
        textAreaEL.value = '';
        counterEL.textContent = 150;
        submitbtnEL.blur();
        scrollToLastFeedback();
    } else {
        showVisualIndicator('invalid');
        textAreaEL.focus();
    }
})

//////////

// get all feedbacks

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
            renderAllFeedbacks(data);
        }
    }
    catch (error) {
        console.log("Error: ", error);
    }
}
showFeedbacksList()

/////////


// add expand event to feedbacks and upvote implemention

const clickHandler = event => {
    const clickEL = event.target;
    if (clickEL.className.includes('upvote')) {
        console.log(clickEL);
        // upvotebtnEL = clickEL.closest('.upvote');
        // upvotebtnEL.disabled = true;
        // const upvoteCountEL = upvotebtnEL.querySelector('.upvote__count');
        // let upvoteCount = +upvoteCountEL.textContent;
        // upvoteCountEL.textContent = ++upvoteCount;
        // const elementId = upvotebtnEL.getAttribute('id');
        // const upvoteData = {
        //     'upvote_count':upvoteCount,
        // }
        // fetch(`${apiUrl}${elementId}/`, {
        //     method:'PATCH',
        //     headers: {
        //         'content-type': 'application/json',
        //         Accept: 'application/json',
        //         'X-CSRFToken': csrftoken
        //     },
        //     body: JSON.stringify(upvoteData),
        //     credentials: 'include'
        // }).then(res => {
        //     if(!res.ok){
        //         console.error('Something went wrong...');
        //         return;
        //     }
        // }).catch(error => {
        //     console.log(error);
        // })
    } else {
        clickEL.closest('.feedback').classList.toggle('feedback--expand');
    };
};

/////////

feedbacksEL.addEventListener('click', clickHandler)

// find feedbacks from hashtags

const findFeedbacksFromHashtags = event => {
    const clickEL = event.target;
    if (clickEL.className === 'hashtags') {
        return;
    } else if (clickEL.textContent.includes('AllFeedbacks')) {
        feedbacksEL.innerHTML = '';
        showFeedbacksList()
    } else {
        const selectedHashtagEL = clickEL.closest('.hashtag').textContent.substring(1).trim().toLowerCase();

        const filteredFeedbacks = allFeedbacks.filter(feed =>
            feed.hashtag.toLowerCase().trim() === selectedHashtagEL
        );
        renderAllFeedbacks(filteredFeedbacks);

    }
}

hashtagsEL.addEventListener('click', findFeedbacksFromHashtags)

////////