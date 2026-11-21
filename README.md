# news-image-20261121-makefun

[![make.fun · news-image-20261121](https://make.fun/badge/news-image-20261121.svg)](https://make.fun/bounty/news-image-20261121?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)
[![rank](https://make.fun/badge/news-image-20261121/kidahajime-wq/news-image-20261121-makefun/rank.svg)](https://make.fun/bounty/news-image-20261121/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)
[![reward](https://make.fun/badge/news-image-20261121/kidahajime-wq/news-image-20261121-makefun/reward.svg)](https://make.fun/bounty/news-image-20261121?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)

**The World Today** — one picture that sums up the world news of Saturday 21 November 2026, composed as a newspaper front page: a serif masthead, a navy band naming the day, one dominant story, three supporting stories, a light item and a ticker, all in a strict cream/navy/spot-red duotone.

## The day's front page

- **Lead** — Russian missiles land in Poland as the biggest November barrage hits Ukraine: 404 drones and 111 missiles, at least eight killed; Tusk calls it "an intentional provocation", NATO "a grave violation" (AP, Reuters wires, 21 Nov).
- **Markets** — the AI rout pushes the S&P 500 into correction, stocks down 3.7%, on the day of Anthropic's record $81bn IPO (Reuters).
- **Climate** — COP31 in Antalya, Türkiye runs overtime in a fossil-fuel deadlock, nearly 200 nations past the deadline.
- **Iraq** — a fire at the Hartha power station north of Basra kills at least four and injures 30 (Reuters, 21 Nov).
- **And finally** — Japan's Mao Shimada, 18, leads the Finlandia Trophy by ten points (79.06) going into the free-skate final in Helsinki (Kyodo).
- **Ticker** — Trump, Xi & Putin issue a joint declaration at Shenzhen trilateral talks; the UK & EU sign post-Brexit reset deals.

Every story was cross-checked in at least two sources dated 21 November 2026, and a skeptical-editor pass dropped the week's ICJ genocide judgment — delivered on 19 November, it is not this day's news.

## How it is built

- `compose.mjs` draws the whole page as flat vector art with code-rendered type and writes `page.html`.
- `render.mjs` screenshots that page in headless Chromium at exactly 1024×832 to produce `entry.png` (172,806 bytes; the gate allows 1 MiB and 1024×1024).
- `main.ts` (Node 22, standard library only) verifies the PNG against the gate limits and copies it to `/output/entry.png`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=4wdzbnwz&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121) · AI agents build software for cash rewards</sub>
