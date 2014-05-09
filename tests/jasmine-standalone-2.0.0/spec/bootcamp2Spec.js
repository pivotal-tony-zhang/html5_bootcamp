describe("getApiUrl()", function() {
	it("url is valid given both parameters", function() {
		expect(getApiUrl(10, 0)).toBe("http://api.espn.com/v1/sports/news/?limit=10&offset=0&apikey=8pa4vr4uquavzwq2ffm7w5cx");
	});
	it("url is valid given one parameters", function() {
		expect(getApiUrl(10)).toBe("http://api.espn.com/v1/sports/news/?limit=10&offset=0&apikey=8pa4vr4uquavzwq2ffm7w5cx");
	});
	it("url is valid given no parameters", function() {
		expect(getApiUrl()).toBe("http://api.espn.com/v1/sports/news/?limit=10&offset=0&apikey=8pa4vr4uquavzwq2ffm7w5cx");
	});
});

describe("makeArticle()", function() {
	var completeArticle = {
		headline: "foobar",
		description: "I like bananas.",
		lastModified: "2014-05-09T15:07:32Z",
		links: {"web" : {"href" : "https://www.google.com/"}},
		images: [{"url": "https://developer.chrome.com/extensions/examples/api/idle/idle_simple/sample-128.png"}]
	};
	var emptyArticle = {};
	var completeStoryDiv = makeArticle(completeArticle, 42, true);
	var emptyStoryDiv = makeArticle(emptyArticle, 1337, true);
	
	/*--------------------------------------*/
	it("<----------StoryDiv checks---------->", function() {
		expect(true).toBe(true);
	});
	it("____story div created using defined members exists", function() {
		expect(completeStoryDiv).toBeDefined();
	});
	it("____story div created using no defined members exists", function() {
		expect(emptyStoryDiv).toBeDefined();
	});
	it("____story div created using defined members has correct ids for itself and its children", function() {
		expect(completeStoryDiv.id).toBe("article42");
		expect(completeStoryDiv.querySelector('.headline').id).toBe("headline42");
		expect(completeStoryDiv.querySelector('.description').id).toBe("description42");
		expect(completeStoryDiv.querySelector('.lastModified').id).toBe("lastModified42");
		expect(completeStoryDiv.querySelector('.readMore').id).toBe("link42");
		expect(completeStoryDiv.querySelector('.image').id).toBe("image42");
	});
	it("____story div created using no defined members has correct ids for itself and its children", function() {
		expect(emptyStoryDiv.id).toBe("article1337");
		expect(emptyStoryDiv.querySelector('.headline').id).toBe("headline1337");
		expect(emptyStoryDiv.querySelector('.description').id).toBe("description1337");
		expect(emptyStoryDiv.querySelector('.lastModified').id).toBe("lastModified1337");
		expect(emptyStoryDiv.querySelector('.readMore').id).toBe("link1337");
		expect(emptyStoryDiv.querySelector('.image').id).toBe("image1337");
	});
	/*--------------------------------------*/
	it("<----------Headline checks---------->", function() {
		expect(true).toBe(true);
	});
	it("____story div created using article that has headline defined 's headline exists", function() {
		expect(completeStoryDiv.querySelector('.headline')).toBeDefined();
	});
	it("____story div created using article that has defined headline should have matching headline", function() {
		expect(completeStoryDiv.querySelector('.headline').innerHTML).toBe("foobar");
	});
	it("____story div created using article that doesn't have headline defined 's headline exists", function() {
		expect(emptyStoryDiv.querySelector('.headline')).toBeDefined();
	});
	it("____story div created using article that doesn't have defined headline should have default headline", function() {
		expect(emptyStoryDiv.querySelector('.headline').innerHTML).toBe("No headline found");
	});
	/*--------------------------------------*/
	it("<---------Description checks-------->", function() {
		expect(true).toBe(true);
	});
	it("____story div created using article that has description defined 's description exists", function() {
		expect(completeStoryDiv.querySelector('.description')).toBeDefined();
	});
	it("____story div created using article that has defined description should have matching description", function() {
		expect(completeStoryDiv.querySelector('.description').innerHTML).toBe("I like bananas.");
	});
	it("____story div created using article that doesn't have description defined 's description exists", function() {
		expect(emptyStoryDiv.querySelector('.description')).toBeDefined();
	});
	it("____story div created using article that doesn't have defined description should have default description", function() {
		expect(emptyStoryDiv.querySelector('.description').innerHTML).toBe("No description found.");
	});
	/*--------------------------------------*/
	it("<---------Last modified checks-------->", function() {
		expect(true).toBe(true);
	});
	it("____story div created using article that has lastModified defined 's lastModified exists", function() {
		expect(completeStoryDiv.querySelector('.lastModified')).toBeDefined();
	});
	it("____story div created using article that has defined lastModified should have matching lastModified", function() {
		expect(completeStoryDiv.querySelector('.lastModified').innerHTML).toBe(new Date("2014-05-09T15:07:32Z").toString());
	});
	it("____<Special Case> story div created using article that has invalid lastModified should display proper message in lastModified", function() {
		invalidDateArticle = {
			lastModified: "Armageddon"
		}
		invalidDateStoryDiv = makeArticle(invalidDateArticle,0,false);
		expect(invalidDateStoryDiv.querySelector('.lastModified').innerHTML).toBe("Invalid Date");
	});
	it("____story div created using article that doesn't have lastModified defined 's lastModified exists", function() {
		expect(emptyStoryDiv.querySelector('.lastModified')).toBeDefined();
	});
	it("____story div created using article that doesn't have defined lastModified should have default text for lastModified", function() {
		expect(emptyStoryDiv.querySelector('.lastModified').innerHTML).toBe("No last modified date found.");
	});
	/*--------------------------------------*/
	it("<---------Link checks-------->", function() {
		expect(true).toBe(true);
	});
	it("____story div created using article that has link defined 's link exists", function() {
		expect(completeStoryDiv.querySelector('.readMore')).toBeDefined();
	});
	it("____story div created using article that has defined link should have proper text in link", function() {
		expect(completeStoryDiv.querySelector('.readMore').innerHTML).toBe("Read more");
	});
	//Note: mobile auto-redirects to web and vice-versa if on corresponding devices, so it's fine to set default as web
	it("____story div created using article that has defined link should have link to correct URL", function() {
		expect(completeStoryDiv.querySelector('.readMore').href).toBe("https://www.google.com/");
	});
	it("____<Special Case> story div created using article that has mobile link but not web should have link to correct URL", function() {
		mobileOnlyArticle = {
			links: {"mobile" : {"href" : "http://www.google.com/mobile/"}},
		}
		mobileOnlyStoryDiv = makeArticle(mobileOnlyArticle, 0, false);
		expect(mobileOnlyStoryDiv.querySelector('.readMore').href).toBe("http://www.google.com/mobile/");
	});
	it("____story div created using article that doesn't have link defined 's link exists", function() {
		expect(emptyStoryDiv.querySelector('.readMore')).toBeDefined();
	});
	it("____story div created using article that doesn't have defined link should have proper text in link", function() {
		expect(emptyStoryDiv.querySelector('.readMore').innerHTML).toBe("No Links Avaliable.");
	});
	/*--------------------------------------*/
	it("<---------Image checks-------->", function() {
		expect(true).toBe(true);
	});
	it("____story div created using article that has images defined and contain images exists", function() {
		expect(completeStoryDiv.querySelector('.image').src).toBeDefined();
	});
	it("____story div created using article that has images defined and contain images 's url is the correct url", function() {
		expect(completeStoryDiv.querySelector('.image').src).toBe("https://developer.chrome.com/extensions/examples/api/idle/idle_simple/sample-128.png");
	});
	it("____story div created using article that doesn't have images defined 's image exists (fallback to default image)", function() {
		expect(emptyStoryDiv.querySelector('.image').src).toBeDefined();
	});
	it("____story div created using article that doesn't have images defined 's image 's url is the default url", function() {
		expect(emptyStoryDiv.querySelector('.image').src.indexOf("img/espn_logo.jpg",emptyStoryDiv.querySelector('.image').src.length - ("img/espn_logo.jpg").length)).not.toBe(-1);
	});
	it("____<Special Case> story div created using article that has images defined but contains no images 's url is the default url", function() {
		emptyImageArrayArticle = {
			images : []
		};
		emptyImageArrayStoryDiv = makeArticle(emptyImageArrayArticle, 0, true);
		expect(emptyImageArrayStoryDiv.querySelector('.image').src.indexOf("img/espn_logo.jpg",emptyImageArrayStoryDiv.querySelector('.image').src.length - ("img/espn_logo.jpg").length)).not.toBe(-1);
	});
	it("____<Special Case> story div created using article that has images defined but does not wish to load the images", function() {
		unloadedImagesCompleteStoryDiv = makeArticle(completeArticle, 0, false);
		expect(unloadedImagesCompleteStoryDiv.querySelector('.image').src.indexOf("img/espn_logo.jpg",unloadedImagesCompleteStoryDiv.querySelector('.image').src.length - ("img/espn_logo.jpg").length)).not.toBe(-1);
	});
});	