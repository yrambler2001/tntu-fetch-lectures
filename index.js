(async () => {
  window.cache = window.cache || {};
  const cacheEnabled = true;
  const cacheData = async (key, fnForData) => (cacheEnabled && window.cache[key]) || (window.cache[key] = await fnForData());
  const fetchWithCache = async (...params) => cacheData(JSON.stringify(params), () => fetch(...params).then((r) => r.text()));
  const fetchWithCacheGet = async (url) =>
    fetchWithCache(url, {
      headers: {
        accept: 'application/json',
        authorization: window.auth_,
      },
      method: 'GET',
    });
  const urls = [...document.querySelectorAll('#menu_content_navigation a[href*="cid="]')].map((e) =>
    e.href.includes('&cframe=1') ? e.href : `${e.href}&cframe=1`,
  );
  const fetchedDocs = [];
  let i = 1;
  for (const url of urls) {
    console.log(`${i++} of ${urls.length}`);
    fetchedDocs.push(await fetchWithCacheGet(url));
    await new Promise((res) => window.setTimeout(res, 2000));
  }
  const divs = fetchedDocs.map((doc) => {
    const div = document.createElement('div');
    div.innerHTML = doc;
    // div.innerHTML = div.querySelector('.page-contents').outerHTML;
    return div;
  });
  const aDiv = document.createElement('div');
  divs.forEach((div) => aDiv.appendChild(div));
  window.backup = document.body.innerHTML;
  document.body.innerHTML = aDiv.outerHTML;
  console.log('ok');
  // document.body.innerHTML
})();
