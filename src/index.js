/**
 * ES6App Class
 * @author Tony Meyer <tonymeyer.dev@gmail.com>
 * @copyright Tony Meyer <tonymeyer.dev@gmail.com>
*/

'use strict';
require('./main.css');
import Header from './../components/Header';

class ES6App {
  // Initializes the app.
  constructor() {
    // Shortcuts to DOM Elements.
		this.header = document.getElementById('header');
		this.sectionContainer = document.getElementById('sectionContainer');

    // Render the navigation header
    this._renderHeader();
    // Set up Intersection Observer
    this._registerIntersectionObserver();
  }

   /**
    * @method _renderHeader
    * Renders the header component
    *
    * @memberof ES6App Class
    * @param   {array} 	state - current items in state
    * @returns {function} - Header function
    */
	_renderHeader()  {
    console.log('rendering header');
		return Header(this.header);
	}

  /**
   * @method _registerIntersectionObserver
   * Sets an Intersection Observer instance
   * https://developers.google.com/web/updates/2016/04/intersectionobserver
   */
  _registerIntersectionObserver () {

  	const pageSize = 1;
    const getRandomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const listView = document.querySelector('.content');
    const sentinelListener = (entries) => {
  		console.log('entries', entries);

  		sentinel.unsubscribe();
  		listView.classList.add('loading');
  		nextPage().then(() => {
  			updateSentinel();
  			listView.classList.remove('loading');
  		});
  	};

    // https://developers.google.com/web/updates/2016/04/intersectionobserver
    const io = new IntersectionObserver(sentinelListener, {threshold: 1});

    // Create a sentinel to trigger callback when next item is in viewport
  	const sentinel = {
  		el: null,
  		subscribe: (el) => {
  			this.el = el;
  			this.el.classList.add('sentinel');
  			io.observe(this.el);
  		},
  		unsubscribe: () => {
  			if (!this.el)
  				return;
  			io.unobserve(this.el);
  			this.el.classList.remove('sentinel');
  			this.el = null;
  		}
  	};

    // Update the sentinel position
  	const updateSentinel = () => {
  		sentinel.subscribe(listView.children[listView.children.length - pageSize]);
  	};

    // Render a batch of images
  	const renderImages = () => [...Array(20)].map((_, i) => `<img class="content__item__content__image" src="images/${getRandomInRange(0,9)}.jpg" />`);

    // Determine if an element is in the visible viewport
    const isInViewport = (el) => {
      var elemTop = el.getBoundingClientRect().top;
      var elemBottom = el.getBoundingClientRect().bottom;

      var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
      return isVisible;
    };

    // Utiliy function
    const changeClass = (el, CssClass, type)  => {
      if(type === 'add' && el.className.indexOf(CssClass) === -1) {
        el.className += CssClass;
      }

      if(type === 'remove') el.classList.remove(CssClass);
    };

    // Set the active navigation based on if a section is in viewport
    const setActiveNav = (page) => {
      if(!page) return;
      const allNavElements = document.getElementsByClassName('navA');
      Array.from(allNavElements).forEach((element) => {
        element.classList.remove('active');
      });

      [
        'features',
        'details',
        'compare',
        'media'
      ].forEach((page, i) => {
        const elements = document.getElementsByClassName(page);
        const navElement = elements[0];

        const pageSection = document.getElementById(page);
        if (pageSection) {
          if(isInViewport(pageSection)) {
            changeClass(navElement, ' active', 'add');
          }
        }
      });

    };

  	const nextPage = () => {
  		return loadNextPage().then((items) => {
  			listView.insertAdjacentHTML(
  				'beforeend',
          items.map(item => `
  					<div class="content__item">
  						<div class="content__item__content">
  							<p>${item.text}</p>
                ${renderImages()}
  						</div>
  					</div
  				`).join('')
  			);
  		});
  	};

  	const loadNextPage = (() => {
      let pageNumber = 0;
      const pages = [
        'features.html',
        'details.html',
        'compare.html',
        'media.html'
      ];

  		return () => {
  			console.log(`Loading page #${pageNumber}`);
  			return new Promise((resolve, reject) => {

          (() => {
            let httpRequest;
            const makeRequest = (url) => {
              httpRequest = new XMLHttpRequest();

              if (!httpRequest) {
                console.error('Giving up :( Cannot create an XMLHTTP instance');
                return false;
              }
              httpRequest.onreadystatechange = renderContent;
              httpRequest.open('GET', url);
              httpRequest.send();
            };

            const renderContent = () => {
              if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                  var items;
                  for (let id = pageNumber*pageSize, lastId = id + pageSize - 1; id <= lastId; ++id) {
                    items = {
                      id: id,
                      text: httpRequest.responseText
                    }
                  }
                  pageNumber++;
                  setTimeout(() => { resolve([items]); }, 0);
                } else {
                  console.error('There was a problem with the request.');
                }
              }
            };

            let page = pages[pageNumber] || 'media.html';
            let ticking = false;
            window.addEventListener('scroll', (e) => {
              if (!ticking) {
                window.requestAnimationFrame(() => {
                  setActiveNav(page);
                  ticking = false;
                });
              }
              ticking = true;
            });

            if (pageNumber < 4) makeRequest(page);
            if (pageNumber > 3) listView.classList.remove('loading');

          })();
  			});
  		}
  	})();

    nextPage().then(() => {
    	nextPage().then(updateSentinel);
    });
  }

}

// On load start the app.
window.addEventListener('load', () => new ES6App());
