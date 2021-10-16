const baseUrl = "https://rivlib.libcal.com/1.1";

export async function getToken() {
  const path = "/oauth/token";
  const params = {
    client_id: process.env.REACT_APP_CLIENT_ID,
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
    grant_type: "client_credentials"
  };

  const body = Object.keys(params)
    .map((key) => {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(params[key]);
      return `${encodedKey}=${encodedValue}`;
    })
    .join("&");

  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });
  if (!response.ok) {
    throw new Error(
      `Could not fetch ${path}` + `, received ${response.status}`
    );
  }

  const payload = await response.json();
  return payload.access_token;
}

export async function getCalendars(token) {
  const path = "/calendars";
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error(
      `Could not fetch ${path}` + `, received ${response.status}`
    );
  }
  return await response.json();
}

export async function getEvents(token, calendarId) {
  const path = "/events";
  const response = await fetch(
    `${baseUrl}${path}?cal_id=${calendarId}&limit=12`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  if (!response.ok) {
    throw new Error(
      `Could not fetch ${path}` + `, received ${response.status}`
    );
  }
  return await response.json();
}
