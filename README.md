# robertbooth.fr

A Jekyll site. **All the content lives in `_data/*.yml` and `_config.yml`** — you
should almost never need to touch HTML.

## Running it locally

```bash
bundle install          # once
bundle exec jekyll serve # then open http://localhost:4000
```

Edits to `_data/` and pages reload automatically. Changes to `_config.yml`
require restarting the server.

## Where things live

| I want to change…            | Edit                          |
|------------------------------|-------------------------------|
| A news item                  | `_data/news.yml`              |
| A talk (or add slides/video) | `_data/talks.yml`             |
| A paper                      | `_data/publications.yml`      |
| Research cards & sub-goals   | `_data/research.yml`          |
| Academic path (timeline)     | `_data/path.yml`              |
| Students                     | `_data/students.yml`          |
| Any long paragraph           | `_data/prose.yml`             |
| Name, tagline, links, email  | `_config.yml`                 |
| Keyword chip labels          | `_data/tags.yml`              |
| Colours, fonts, spacing      | `assets/css/style.css`        |

Slides go in `pdfs/slides/`, photos in `pictures/`.

## Common tasks

### Add a talk

Put it at the **top** of `_data/talks.yml` (the list is newest-first):

```yaml
- date: "Mar 2027"
  title: "The title of the talk"
  venue: "QPL 2027, Somewhere"
  tags: [conference, faulttol, algebra]
  slides: "2027-03-QPL_short-name.pdf"   # optional; file in pdfs/slides/
  video: "https://youtube.com/..."       # optional
```

Chip counts, the "showing 8 of N", and the show-all button all update by
themselves.

### Add a paper

```yaml
- id: myshortname            # only needed if a research card links to it
  title: "Paper title"
  authors: "Robert I. Booth, Someone Else"
  venue: "QPL 2027"
  url: "https://arxiv.org/abs/…"
  blurb: "One line on what it does."
  tags: [semantics, stabiliser]
  status: peer-reviewed      # or: preprint
```

Your own name is bolded automatically. To cite the paper from a research card,
add `- { id: myshortname, label: "QPL 2027" }` under that sub-objective's
`refs:` in `_data/research.yml`.

### Invent a new keyword

Add the token to a `tags:` list, **and** add a label for it in `_data/tags.yml`:

```yaml
bosonic: "bosonic codes"
```

Skip the second step and the chip shows the raw token (`bosonic`) instead of a
nice label. Nothing breaks, it just looks wrong.

### Mark a sub-objective as done

In `_data/research.yml`, flip `done: false` to `done: true` and add a `refs:`
entry pointing at the paper. The dot fills in and the "open" tag is replaced by
the citation automatically.

## Things to leave alone unless you're feeling brave

- `_includes/derivation.svg` — the hero diagram, hand-plotted coordinates.
- `assets/js/site.js` — search/filter logic; it's configured from `_config.yml`.
- The grid rules for `.sub` and `.talk` in the stylesheet.

## Deploying

Push to GitHub; GitHub Pages builds it. If you'd rather build yourself,
`bundle exec jekyll build` writes the finished site to `_site/`.
