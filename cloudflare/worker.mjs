const CARRD_ORIGIN = "https://furrycolombia.carrd.co";
const CARRD_HOST = "furrycolombia.carrd.co";
const PRIMARY_DOMAIN = "https://furrycolombia.com";

function isCarrdProxyHost(hostname) {
  return hostname === "furrycolombia.com";
}

function rewriteCarrdString(value) {
  return value
    .replaceAll(CARRD_ORIGIN, PRIMARY_DOMAIN)
    .replaceAll(`//${CARRD_HOST}`, "//furrycolombia.com")
    .replaceAll(CARRD_HOST, "furrycolombia.com");
}

function rewriteCarrdHeaders(headers) {
  const nextHeaders = new Headers(headers);
  nextHeaders.delete("set-cookie");

  const location = nextHeaders.get("location");
  if (location) {
    nextHeaders.set("location", rewriteCarrdString(location));
  }

  return nextHeaders;
}

async function proxyCarrdRequest(request) {
  const incomingUrl = new URL(request.url);
  const upstreamUrl = new URL(
    `${incomingUrl.pathname}${incomingUrl.search}`,
    CARRD_ORIGIN
  );
  const upstreamHeaders = new Headers(request.headers);
  upstreamHeaders.set("host", CARRD_HOST);
  upstreamHeaders.set("origin", CARRD_ORIGIN);

  const upstreamRequest = new Request(upstreamUrl, {
    method: request.method,
    headers: upstreamHeaders,
    body: request.body,
    redirect: "manual",
  });

  const upstreamResponse = await fetch(upstreamRequest);
  const responseHeaders = rewriteCarrdHeaders(upstreamResponse.headers);
  const contentType = responseHeaders.get("content-type") ?? "";

  if (contentType.includes("text/html")) {
    const html = rewriteCarrdString(await upstreamResponse.text());
    responseHeaders.delete("content-length");
    return new Response(html, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (isCarrdProxyHost(url.hostname)) {
      return proxyCarrdRequest(request);
    }

    return env.ASSETS.fetch(request);
  },
};
