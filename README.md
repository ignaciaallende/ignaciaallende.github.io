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

Append `?pid=<record id>` as before (for example from REDCap); the value is stored with the data.
The old addresses (`/iat-en/exampleiat.html`, `/iat-de/exampleiat.html`) forward to the new ones.

## Layout

```
en/, de/, no/          one small entry page per language (only the `LANG` line differs)
survey/mgr.js          study sequence and data upload (shared)
survey/raceiat.js      IAT configuration (shared)
survey/iat10.js        the IAT engine (minno-tasks 0.7.3 with one small local patch, see its header)
survey/images/         the twelve stimulus photos
survey/lang/<code>/    everything a participant reads in that language:
    strings.js             short texts: buttons, headers, IAT screen sentences, stimulus words
    intro.jst              welcome page
    raceiat_instructions.jst   IAT instructions page (word lists are filled in from strings.js)
    lastpage.jst           debrief and withdrawal question
```

Names written to the data (`Men`, `Women`, `Urgent words`, `Non-urgent words`) stay in English in
every language; each uploaded row also carries a `lang` column (`en`, `de`, `no`).

## Adding another language

1. Copy `survey/lang/en/` to `survey/lang/<code>/` and translate the four files.
2. Copy `en/index.html` to `<code>/index.html` and change the `LANG` line.

## Testing locally

Serve the repository root with any static server, for example `python3 -m http.server 8000`,
and open `http://localhost:8000/en/?pid=TEST`. Note that finishing the survey uploads a row to
the live DataPipe experiment, so use a recognisable `pid` for test runs.
