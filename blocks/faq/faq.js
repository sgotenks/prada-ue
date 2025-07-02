/* eslint-disable no-underscore-dangle */
export default async function decorate(block) {
  const props = [...block.children];
  const firsttag = props[0].textContent.trim();
  const variationname = props[1].textContent.trim() || 'master';
  const cachebuster = Math.floor(Math.random() * 1000);

  //const url = `https://publish-p129757-e1266090.adobeaemcloud.com/graphql/execute.json/securbank/FAQListbyTag;tag=${firsttag};variation=${variationname}?ts=${cachebuster}`;
  const aempublishurl = 'https://publish-p129757-e1266090.adobeaemcloud.com';
  const aemauthorurl = 'https://author-p129757-e1266090.adobeaemcloud.com';
  const persistedquery = '/graphql/execute.json/securbank/FAQListbyTag';
  const options = {};

  const url = window.location && window.location.origin && window.location.origin.includes('author')
    ? `${aemauthorurl}${persistedquery};tag=${firsttag};variation=${variationname}?ts=${cachebuster}`
    : `${aempublishurl}${persistedquery};tag=${firsttag};variation=${variationname}?ts=${cachebuster}`;
  
  const faq = await fetch(url, options);
  const index = await faq.json();

  let itemsHTML = '';
  index.data.faqList.items.forEach((item) => {
    itemsHTML += `
    <li data-aue-resource="urn:aemconnection:${item._path}/jcr:content/data/master" data-aue-type="reference" data-aue-label="faq content fragment" data-aue-filter="cf">
        <details class="faq-details">    
          <summary class="faq-heading">
            <span data-aue-prop="question" data-aue-label="question" data-aue-type="text">${item.question}</span>
            <b></b>
          </summary>
          <div data-aue-prop="answer" data-aue-label="answer" data-aue-type="richtext" class="faq-description">${item.answer.html}</div>
        </details>
      </li>`;
  });

  block.innerHTML = `
    <h2 class='section-heading'>Frequently Asked Questions</h2>
    <ul class="faq-list">
      ${itemsHTML}
    </ul>`;
}
