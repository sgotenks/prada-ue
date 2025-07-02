/* eslint-disable no-underscore-dangle */
export default async function decorate(block) {
  const props = [...block.children];
  const firsttag = props[0].textContent.trim();
  const variationname = props[1].textContent.trim() || 'master';
  const cachebuster = Math.floor(Math.random() * 1000);

  //const url = `https://publish-p129757-e1266090.adobeaemcloud.com/graphql/execute.json/securbank/FAQListbyTag;tag=${firsttag};variation=${variationname}?ts=${cachebuster}`;
  const aempublishurl = 'https://publish-p129757-e1266090.adobeaemcloud.com';
  const aemauthorurl = 'https://author-p129757-e1266090.adobeaemcloud.com';
  const persistedquery = '/graphql/execute.json/citisignal-one/EventsListByTag';
  const options = {};

  const url = window.location && window.location.origin && window.location.origin.includes('author')
    ? `${aemauthorurl}${persistedquery};tag=${firsttag};variation=${variationname}?ts=${cachebuster}`
    : `${aempublishurl}${persistedquery};tag=${firsttag};variation=${variationname}?ts=${cachebuster}`;
  
  const event = await fetch(url, options);
  const index = await event.json();


  let itemsHTML = '';
  index.data.eventList.items.forEach((item) => {
    itemsHTML += `
    <li data-aue-resource="urn:aemconnection:${item._path}/jcr:content/data/master" data-aue-type="reference" data-aue-label="event-li content fragment" data-aue-filter="cf" class="event">
        <div class="event-image">
      		<picture>
            <img loading="lazy" alt="" src="${aempublishurl + item.picture._dynamicUrl}" data-aue-prop="picture" data-aue-label="Picture" data-aue-type="media" class='event-picture'>
          </picture>
      	</div>
        <div class="event-body">
            <div data-aue-prop="location" data-aue-label="Location" data-aue-filter="text" data-aue-type="text" class="event-location">${item.location[0]}</div>
    			  <div data-aue-prop="title" data-aue-label="Title" data-aue-filter="text" data-aue-type="text" class="event-title">${item.title}</div>
            <div data-aue-prop="ctaText" data-aue-label="Call to action" data-aue-filter="text" data-aue-type="text" class="event-cta">${item.ctaText}</div>
    	  </div>
      </li>`;
  });

  block.innerHTML = `
    <h2 class='section-heading'>Events</h2>
    <ul class="event-list">
      ${itemsHTML}
    </ul>`;
}
