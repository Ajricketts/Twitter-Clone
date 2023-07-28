// import { setlocalStorage } from "/data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { tweetsDatafromFile } from "./data.js";

let tweetsData = JSON.parse(localStorage.getItem('tweetsDatafromFile'))

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
       updatelocalStorage()
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
        updatelocalStorage()
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
        updatelocalStorage()
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
        updatelocalStorage()
    }
    else if(e.target.dataset.replyBtn) {
        handleNewReplyClick(e.target.dataset.replyBtn)
        updatelocalStorage()
    }
    else if(e.target.dataset.delete) {
        handleDeleteClick(e.target.dataset.delete)
        updatelocalStorage()
    }
})

function updatelocalStorage() {
    localStorage.setItem('tweetsDatafromFile', JSON.stringify(tweetsData))
}
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    // const selectedTweet = document.getElementById(`replies-${replyId}`)
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    
}

function handleNewReplyClick(replyId) {
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === replyId
    })[0]
    // console.log(targetTweetObj.replies)
    
    const newReplyObj = 
    {
        handle: `@AJ`,
        profilePic: `images/scrimbalogo.png`,
        tweetText: `This is an example of a reply!! ❤️`,
    }
    targetTweetObj.replies.push(newReplyObj)

    render()
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleDeleteClick(tweetId){

    tweetsData = tweetsData.filter(function(tweet) {
        return tweet.uuid != tweetId
    })
    render()
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=
                `
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>
                `
            })
        }
        
          
        feedHtml += 
            `
                <div class="tweet">
                    <div class="tweet-inner">
                        <img src="${tweet.profilePic}" class="profile-pic">
                        <div>
                            <p class="handle">${tweet.handle}</p>
                            <p class="tweet-text">${tweet.tweetText}</p>
                            <div class="tweet-details">
                                <span class="tweet-detail">
                                    <i class="fa-regular fa-comment-dots"
                                    data-reply="${tweet.uuid}"
                                    ></i>
                                    ${tweet.replies.length}
                                </span>
                                <span class="tweet-detail">
                                    <i class="fa-solid fa-heart ${likeIconClass}"
                                    data-like="${tweet.uuid}"
                                    ></i>
                                    ${tweet.likes}
                                </span>
                                <span class="tweet-detail">
                                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                                    data-retweet="${tweet.uuid}"
                                    ></i>
                                    ${tweet.retweets}
                                </span>
                            </div>   
                        </div>
                        <i class="fa-solid fa-xmark" data-delete=${tweet.uuid}></i>            
                    </div>
                    <div class="hidden" id="replies-${tweet.uuid}">
                        ${repliesHtml}
                        <button class="reply-btn" data-reply-btn=${tweet.uuid}>Reply</button>
                    </div> 
                </div>
                    `
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

function main() {
    if (tweetsData) {
        render()
    }
    else {
        tweetsData = tweetsDatafromFile
        render()
    }
}

main()
