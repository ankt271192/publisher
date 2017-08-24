var landing = (function() {

  var offset = 0

  function init() {
    $.ajax({
      type: "GET",
      url: "https://rio.quintype.io/api/v1/stories?limit=22&offset=" + offset,
    }).done(function(data) {
      renderPage(data)
    }).fail(function(errorObject, status, error) {
      console.log(error)
    })
  }

  function scrollAJAX() {
    $.ajax({
      type: "GET",
      url: "https://rio.quintype.io/api/v1/stories?limit=10&offset=" + offset,
    }).done(function(data) {
      renderRecent(data)
    }).fail(function(errorObject, status, error) {
      console.log(error)
    })
  }

  function renderPage(data) {
    var container = $('#main-container')
    var source = $('#page-template').html()
    container.html('')

    var context = getContextData(data.stories)

    var template = Handlebars.compile(source)
    container.append(template(context))
    offset = offset + data.stories.length
    registerScrollEvent()
  }

  function renderRecent(data) {
    var loader = $('#loader')
    var source = $('#page-template').html()

    var context = getContextData(data.stories)

    var template = Handlebars.compile(source)
    loader.before(template(context))
    offset = offset + data.stories.length
  }

  function registerScrollEvent() {
    $(window).scroll(function(){
      if ($(window).scrollTop() === $(document).height() - $(window).height()) {
        scrollAJAX();
      }
    });
  }

  function getContextData(stories) {
    var contextData = {}

    stories.forEach(function(x) {
      x['posted'] = convertToTimePassed(Date.now() - x['published-at'])
      x['storySection'] = x['sections'][0]['name']
      x['sectionClass'] = x['sections'][0]['slug']
    })

    contextData.lead = stories[0]
    contextData.middle = {}
    contextData.middle.card = stories[1]
    contextData.middle.slides = stories.slice(2,5)
    contextData.mustReads = stories.slice(5,8)
    contextData.politics = {}
    contextData.politics.imageStory = stories[8]
    contextData.politics.cards = stories.slice(9,11)
    contextData.politics.cards[0].hasImage = true
    contextData.politics.slides = stories.slice(11,15)
    contextData.health = {}
    contextData.health.left = stories.slice(15,18)
    contextData.health.right = stories[18]
    contextData.recent = stories.slice(19)

    return contextData
  }

  function convertToTimePassed(x) {

    // convert to seconds
    x = x/1000

    if ((x/60) > 1) {                       //check if greater than a minute
      x = x/60                              //convert to minutes
      if ((x/60) > 1) {                     //check if greater than a hour
        x = x/60                            //convert to hours
        if((x/24) > 1) {                    //check if greater than a day
          return parseInt(x) + ' days'
        } else {
          return parseInt(x) + ' hour'
        }
      } else {
       return parseInt(x) + ' min'
      }
    } else {
      return parseInt(x) + ' sec'
    }

  }

  return { init: init }

})();
