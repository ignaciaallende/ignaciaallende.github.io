# The REDCap bridge

This folder holds a small program that stands between the survey and REDCap.

The survey runs inside the participant's web browser, and anything the browser holds, the
participant can read. REDCap only accepts data from a program that presents a secret key (an
"API token"), and that key must never be in the survey itself — anyone taking the survey could
copy it and get into your REDCap project.

So the survey sends its data here instead. This program adds the secret key and passes the data
on to REDCap. The key is stored by Cloudflare and never reaches anyone's browser.

```
participant's browser  ──►  this program  ──►  your REDCap project
   (holds no secrets)        (holds the key)
```

## Before you start: what to ask your REDCap administrator

1. **An API token** for the study's project. Ask for it to be issued to an account that can
   **import/update records only, with export switched off**. If this program were ever
   misused, that token could add data but never read your dataset out.
2. **The API address**, usually something like `https://redcap.yourinstitute.edu/api/`.
3. **"Is API access limited to particular IP addresses?"** This one matters. Cloudflare sends
   requests from a large shared pool of addresses, so it cannot satisfy a narrow allowlist.
   If the answer is yes, this program needs to run on an Institute server with a fixed address
   instead — the code stays the same, so ask your developer or IT contact to host `src/index.js`.
4. **"Is the project longitudinal, or does it use repeating instruments?"** If yes, you will
   need to set `REDCAP_EVENT` in `wrangler.toml`; the administrator can tell you the event name.

## Fields to add to the REDCap project

Ask whoever manages the project to add these to the instrument. If you prefer different names,
change them at the top of `src/index.js` to match.

| Field name | Type | What it holds |
|---|---|---|
| `iat_data_file` | File upload | The participant's full trial-by-trial CSV |
| `iat_d_score` | Text | The D score calculated by the task |
| `iat_feedback` | Text | The task's own summary of the result |
| `iat_block3cond` | Text | Which categories were paired in block 3 |
| `iat_lang` | Text | `en`, `de` or `no` |
| `iat_is_touch` | Text | `1` for a touchscreen, `0` for a keyboard |
| `iat_session_id` | Text | Ties the attached file to the row |
| `iat_completed_at` | Text | When the task finished |
| `iat_withdraw` | Text | `yes` or `no` from the final page |

## Setting it up

You need [Node.js](https://nodejs.org) installed. Everything below is typed in a terminal,
in this `worker` folder.

**1. Create a free Cloudflare account** at https://dash.cloudflare.com/sign-up.

**2. Sign in from your machine.** A browser window opens; approve it.

```bash
npx wrangler login
```

**3. Give it the REDCap address and key.** Each command asks you to paste a value. Nothing is
written into the project's files, so neither value ends up on GitHub.

```bash
npx wrangler secret put REDCAP_API_URL
```

```bash
npx wrangler secret put REDCAP_API_TOKEN
```

**4. Publish it.** This prints an address ending in `.workers.dev` — copy it.

```bash
npx wrangler deploy
```

**5. Tell the survey where to find it.** In `survey/mgr.js`, set `UPLOAD_ENDPOINT_LIVE` to the
address you just copied, with `/iat` on the end, and set `CONTACT_EMAIL` to the address a
participant should write to if their data cannot be saved.

**6. Test once while nothing is written to REDCap.** `DRY_RUN` is `"true"` in `wrangler.toml`
to begin with, which means the bridge checks each upload and reports success without saving
anything. Run through the survey once and confirm you see no errors.

**7. Go live.** Set `DRY_RUN = "false"` in `wrangler.toml`, then:

```bash
npx wrangler deploy
```

Run the survey once more with a made-up participant code, check in REDCap that the record has
the summary fields and the attached CSV, then delete that test record.

## Testing on your own machine

You do not need Cloudflare or a REDCap token for this. Run the static site and the stand-in
bridge in two terminals:

```bash
python3 -m http.server 8000
```

```bash
python3 worker/mock_server.py
```

Then open http://localhost:8000/en/?pid=TEST. The survey notices it is running locally and
talks to the stand-in instead of the real bridge. Uploads are printed and saved under
`worker/received/` so you can see exactly what was sent.

To check what a participant sees when saving fails:

```bash
FORCE_STATUS=500 python3 worker/mock_server.py
```

## If something goes wrong

The survey never pretends an upload worked. If it cannot save, the participant sees a page
explaining that, with a button to download their own data, and is not sent onwards.

To see what the bridge is doing:

```bash
npx wrangler tail
```

Common causes: `redcap_failed` usually means the token, the API address, or a field name is
wrong, or that REDCap is refusing Cloudflare's IP address (see question 3 above).
`origin_not_allowed` means the survey is being served from an address that is not in
`ALLOWED_ORIGINS` at the top of `src/index.js`.

## A note on security

Any address a browser can reach, anyone can reach. The checks in `src/index.js` — the allowed
list of sites, the strict participant-code pattern, the size limit — keep the worst case to
"somebody could add junk rows to the project". They do not make the address private. The
protection that matters is the one in step 1: a token that can add data but never read it.
