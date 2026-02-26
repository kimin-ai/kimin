app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:3000/auth/google/callback"
    })
  });

  const data = await response.json();

  const userInfo = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    { headers: { Authorization: `Bearer ${data.access_token}` } }
  );

  const user = await userInfo.json();

  console.log(user); // email, name, picture
});
