from mitmproxy import http
import time
from collections import defaultdict, deque

#Proxy che utilizza una whitelist, più efficiente rispetto ad una blacklist ma più difficile da configurare
#per farla funzionare correttamente in contesti aziendali
WHITELIST = {"facebook.com", "google.com", "microsoft.com","wikipedia.com"}

ACCESS_LOG = defaultdict(lambda: deque(maxlen=10))  
BLOCKED_DOMAINS = set()  



MAX_REQUESTS = 5
WINDOW_SECONDS = 60

def request(flow: http.HTTPFlow) -> None:
    host = flow.request.pretty_host


    if host in BLOCKED_DOMAINS:
        flow.response = http.Response.make(
            403,
            b"L'accesso a questo dominio e' stato bloccato",
            {"Content-Type": "text/plain"}
        )
        return

    if any(whitelisted in host for whitelisted in WHITELIST):
        return

    now = time.time()
    timestamps = ACCESS_LOG[host]
    timestamps.append(now)

    while timestamps and (now - timestamps[0]) > WINDOW_SECONDS:
        timestamps.popleft()

    if len(timestamps) > MAX_REQUESTS:
        BLOCKED_DOMAINS.add(host)
        flow.response = http.Response.make(
            403,
            b"Dominio bloccato per attivita' sospetta",
            {"Content-Type": "text/plain"}
        )
