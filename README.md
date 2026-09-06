# ignaciaallende.github.io
IAT UNSW

Implicit Association Test (gender vs. urgency) built with [MinnoJS](https://minnojs.github.io/),
served by GitHub Pages.

## Survey URLs

| Language  | URL                                        |
|-----------|--------------------------------------------|
| English   | https://ignaciaallende.github.io/en/       |
| German    | https://ignaciaallende.github.io/de/       |
| Norwegian | https://ignaciaallende.github.io/no/       |

Append `?pid=<record id>` as before (for example from REDCap); the value identifies the
participant's REDCap record. A link without a usable `?pid=` shows an explanation on the first
screen instead of starting the study. The old addresses
(`/iat-en/exampleiat.html`, `/iat-de/exampleiat.html`) forward to the new ones.

## Where the data goes

Data goes to the study's **REDCap**, through the small forwarding program in `worker/`.
See [worker/README.md](worker/README.md) for how to set that up — it needs a REDCap API token,
which cannot live in the survey itself.

Each participant produces two uploads: the trial-by-trial CSV with a few summary values after
the task, and their answer to the withdrawal question after the final page. The CSV is attached
to their REDCap record; the summary values go into fields on the record.

If an upload fails the survey says so, offers the participant a copy of their own data, and
stops — it never reports success it did not have.

> Until 2026 the data went to the Open Science Framework via DataPipe. OSF Projects are being
> retired (no new projects after 16 November 2026; everything read-only from 19 February 2027),
> so that route was removed rather than repaired. If you want a DOI for the finished dataset,
> deposit it in Zenodo or the Institute's repository at publication — that is a separate step
> and needs no code.

## Layout

```
en/, de/, no/          one small entry page per language (only the `LANG` line differs)
survey/mgr.js          study sequence, and the two settings you must change before going live
survey/upload.js       sends the data to the forwarding program
survey/raceiat.js      IAT configuration (shared)
survey/iat10.js        the IAT engine (minno-tasks 0.7.3 with one small local patch, see its header)
survey/images/         the twelve stimulus photos
survey/lang/<code>/    everything a participant reads in that language:
    strings.js             short texts: buttons, headers, IAT screen sentences, stimulus words
    intro.jst              welcome page
    raceiat_instructions.jst   IAT instructions page (word lists are filled in from strings.js)
    lastpage.jst           debrief and withdrawal question
worker/                the forwarding program that holds the REDCap key
```

Names written to the data (`Men`, `Women`, `Urgent words`, `Non-urgent words`) stay in English in
every language; every uploaded row also carries a `lang` column (`en`, `de`, `no`).

## Adding another language

1. Copy `survey/lang/en/` to `survey/lang/<code>/` and translate the four files.
2. Copy `en/index.html` to `<code>/index.html` and change the `LANG` line.
3. Add the new code to `LANGS` in `worker/src/index.js`, and redeploy the worker.

## Testing locally

Run the site and a stand-in for the forwarding program, in two terminals:

```bash
python3 -m http.server 8000
```

```bash
python3 worker/mock_server.py
```

Then open http://localhost:8000/en/?pid=TEST. The survey notices it is running locally and uses
the stand-in, so nothing reaches REDCap and no account or token is needed. What was uploaded is
printed and saved under `worker/received/`. See [worker/README.md](worker/README.md) for more,
including how to test what a participant sees when saving fails.
