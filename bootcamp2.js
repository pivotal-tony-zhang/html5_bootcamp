//Retrieves the API Url with the appropriate offset and articleLimit
function getApiUrl(articleLimit, offset) {
	if (articleLimit === undefined || articleLimit === null || articleLimit <= 0) {
		articleLimit = getArticleLimit();
	}
	if (offset === undefined || offset === null || offset < 0) {
		offset = 0;
	}
	return "http://api.espn.com/v1/sports/news/?limit=" + articleLimit + "&offset=" + offset + "&apikey=8pa4vr4uquavzwq2ffm7w5cx";
}



//Creates a div that coresponds to the article story with all its related features
function makeArticle(article, i, appendAfter, showImage) {
    //Create Necessary Article Divs
    var storyDiv = document.createElement('div'),
		imageTag = document.createElement('img'),
		headlineDiv = document.createElement('div'),
		descriptionDiv = document.createElement('div'),
		lastModifiedDiv = document.createElement('div'),
		readMoreLink = document.createElement('a');
	
	
    //Apply necessary ids and classes
    storyDiv.id = 'article' + i;
    storyDiv.className = 'story';

    imageTag.id = 'image' + i;
    imageTag.className = 'image';

    headlineDiv.id = 'headline' + i;
    headlineDiv.className = 'headline';

    descriptionDiv.id = 'description' + i;
    descriptionDiv.className = 'description';

    lastModifiedDiv.id = 'lastModified' + i;
    lastModifiedDiv.className = 'lastModified';

    readMoreLink.id = 'link' + i;
    readMoreLink.className = 'readMore';

	storyDiv.onclick = function(){
		if(this.style.height!=='27px'){
			this.querySelector('.image').style.display = 'none';
			this.querySelector('.lastModified').style.display = 'none';
			this.querySelector('.readMore').style.display = 'none';
			this.querySelector('.description').style.display = 'none';
			this.fullHTML = this.querySelector('.headline').innerHTML;
			if(screen.width <= 760 && this.fullHTML.length > 40){
				this.querySelector('.headline').innerHTML = this.fullHTML.substring(0, this.fullHTML.substring(0,40).lastIndexOf(" ")) + '...';
			}
			$(this).animate({height:'27px'},"slow");
		}else{
			this.querySelector('.image').style.display = 'block';
			this.querySelector('.lastModified').style.display = 'block';
			this.querySelector('.readMore').style.display = 'block';
			this.querySelector('.description').style.display = 'block';
			this.querySelector('.headline').innerHTML = this.fullHTML;
			$(this).animate({height:'230px'},"slow");
		}
	};
	
    //Append headline, description, lastModified and image to the article
    storyDiv.appendChild(imageTag);
    storyDiv.appendChild(headlineDiv);
    storyDiv.appendChild(descriptionDiv);
    storyDiv.appendChild(lastModifiedDiv);
    storyDiv.appendChild(readMoreLink);

    //Append Article to Body
    if (appendAfter) {
        document.getElementById('body').appendChild(storyDiv);
    } else {
        storyDiv.className = 'newStory';
        document.getElementById('body').insertBefore(storyDiv, document.getElementById('body').firstChild);
    }

    //Error checks to ensure headline, description, lastModified and image actually exist, and displays appropriate messages / images if they do not
    if (showImage && (article.images !== undefined) && (article.images.length > 0)) {
        imageTag.src = article.images[0].url;
    } else {
        imageTag.src = "img/espn_logo.jpg";
    }
	
	imageTag.onload = function(){
		this.style.paddingTop = (210-this.height)/2 + 'px';
	}
	
    if (article.headline !== undefined) {
        headlineDiv.innerHTML = article.headline;
    } else {
        headlineDiv.innerHTML = "No headline found";
    }

    if (article.description !== undefined) {
        descriptionDiv.innerHTML = article.description;
    } else {
        descriptionDiv.innerHTML = "No description found.";
    }

    if (article.lastModified !== undefined) {
        lastModifiedDiv.innerHTML = new Date(article.lastModified).toString();
    } else {
        lastModifiedDiv.innerHTML = "No last modified date found.";
    }

    if (article.links !== undefined) {
        readMoreLink.innerHTML = "Read more";
        if (article.links.web !== undefined) {
            readMoreLink.href = article.links.web.href;
        } else if (article.links.mobile !== undefined) {
            readMoreLink.href = article.links.mobile.href;
        } else {
            readMoreLink.innerHTML = "No Links Avaliable.";
        }
    } else {
        readMoreLink.innerHTML = "No Links Avaliable.";
    }
}

//Offline Response Function - displays stories stored in offline storage, and will display an error message if it does not find any
function offlineResponse() {
	var articles = JSON.parse(localStorage.articles);
	if (articles !== undefined && articles !== null) {
		for (var i = 0; i < articles.length; i++) {
			makeArticle(articles[i],i,true,false);
		}
	} else {
		alert("No articles found!");
	}
}

//Response Function - stores the JSON for offline access and displays related stories when window is first loaded
function onlineResponse(articleData, articleArray, articleLimit) {
	localStorage.articles = JSON.stringify(articleData);
	for (var i = articleLimit-1; i >= 0; i--) {
		articleArray.push(articleData[i]);
		makeArticle(articleData[articleLimit-1-i], i, true, true);
	}
}

//Update Function - updates and displays any new stories
function onlineUpdate(articleData, articleArray, articleLimit) {
	var i = 0;
	while (i < articleLimit && articleData[i].id !== articleArray[articleArray.length - 1].id) {
		i++;
	}
	for (var c = i - 1; c >= 0; c--) {
		articleArray.push(articleData[c]);
		makeArticle(articleData[c], articleArray.length - 1, false, true);
	}
}

//Creates and sends a JSON request to the appropriate url. Also specifies which function that's called once the server responds.
function makeRequest(inputUrl, updateFlag, articleArray, articleLimit, requestDataType) {
	var req = $.ajax({
		url : inputUrl,
		dataType : requestDataType,
		timeout : 5000
	});
	req.success(function(data){
		if (updateFlag) {
			onlineUpdate(data.headlines, articleArray, articleLimit, true);
		} else {
			onlineResponse(data.headlines, articleArray, articleLimit, true);
			setInterval(function () {
				makeRequest(getApiUrl(), true, articleArray, articleLimit, "json");
			}, 30000);/**Test link: "http://skoushan.com/articles.json"**/
		}
	});

	req.error(function() {
		if(!updateFlag){
			offlineResponse();
		}
	});
}


//Initial Load Function - called when window is first loaded. Initial variables are set, and makeRequest function is called.
function initialLoad() 
{
	if(navigator.onLine){
		makeRequest(getApiUrl(), false, [], getArticleLimit(), "jsonp");
	}else{
		offlineResponse();
	}
}

function getArticleLimit(){
	return 10;
}

window.onload = initialLoad();