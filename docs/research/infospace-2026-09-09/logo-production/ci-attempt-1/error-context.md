# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: site.spec.ts >> keeps repository clicks separate and supports card links in another tab
- Location: tests/browser/site.spec.ts:243:1

# Error details

```
TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
=========================== logs ===========================
  "networkidle" event fired
============================================================
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - link "Skip to content" [ref=e3] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e4]:
    - generic [ref=e6]:
      - link "hexly.ai" [ref=e7] [cursor=pointer]:
        - /url: /
      - navigation "Surfaces" [ref=e13]:
        - link "Play" [ref=e14] [cursor=pointer]:
          - /url: https://lizheng.me/en/
        - link "Journal" [ref=e15] [cursor=pointer]:
          - /url: https://lizheng.blog/
        - link "Résumé" [ref=e16] [cursor=pointer]:
          - /url: https://lizheng.dev/en/
        - link "Portfolio" [ref=e17] [cursor=pointer]:
          - /url: /
      - generic [ref=e18]:
        - button "Switch to Chinese" [ref=e19] [cursor=pointer]
        - 'button "Theme: Light. Switch to dark theme." [ref=e22] [cursor=pointer]'
    - navigation "Main navigation" [ref=e25]:
      - button "Projects" [pressed] [ref=e26] [cursor=pointer]
      - button "Logo gallery" [ref=e27] [cursor=pointer]
  - main [ref=e28]:
    - region [ref=e29]:
      - generic [ref=e30]:
        - paragraph [ref=e31]: AN INDEPENDENT COLLECTION BY ZHENG LI
        - heading "Small ideas A little universe." [level=1] [ref=e33]: Small ideasA little universe.
        - paragraph [ref=e34]: Useful tools, playful experiments, and things I wished existed. A growing collection of projects, made with care.
        - generic [ref=e35]:
          - link "Explore the collection" [ref=e36] [cursor=pointer]:
            - /url: "#collection"
          - button "Meet the logos" [ref=e39] [cursor=pointer]
      - generic [ref=e42]:
        - generic [ref=e48]: +
        - generic [ref=e49]: +
        - 'button "View logo: Frogie" [ref=e50] [cursor=pointer]'
        - 'button "View logo: Pew" [ref=e52] [cursor=pointer]'
        - 'button "View logo: Firefly" [ref=e54] [cursor=pointer]'
        - 'button "View logo: Bogo" [ref=e56] [cursor=pointer]'
        - 'button "View logo: Steed" [ref=e58] [cursor=pointer]'
        - 'button "View logo: Ellie" [ref=e60] [cursor=pointer]'
        - generic [ref=e62]: A FEW FAMILIAR FACES
    - region [ref=e65]:
      - generic [ref=e66]:
        - generic [ref=e67]:
          - generic [ref=e68]:
            - heading "The collection" [level=2] [ref=e69]
            - generic [ref=e70]: "70"
          - paragraph [ref=e71]: Pick something that sparks your curiosity.
        - generic [ref=e72]:
          - generic [ref=e75]: Search projects
          - searchbox "Search projects" [ref=e76]
          - generic [ref=e77]: /
      - generic [ref=e78]:
        - group "Project categories" [ref=e79]:
          - button "All projects 50" [pressed] [ref=e80] [cursor=pointer]:
            - text: All projects
            - generic [ref=e81]: "50"
          - button "AI & agents 9" [ref=e82] [cursor=pointer]:
            - text: AI & agents
            - generic [ref=e83]: "9"
          - button "Developer tools 20" [ref=e84] [cursor=pointer]:
            - text: Developer tools
            - generic [ref=e85]: "20"
          - button "Everyday life 14" [ref=e86] [cursor=pointer]:
            - text: Everyday life
            - generic [ref=e87]: "14"
          - button "Design 3" [ref=e88] [cursor=pointer]:
            - text: Design
            - generic [ref=e89]: "3"
          - button "Play 5" [ref=e90] [cursor=pointer]:
            - text: Play
            - generic [ref=e91]: "5"
          - button "Skills & MCP 7" [ref=e92] [cursor=pointer]:
            - text: Skills & MCP
            - generic [ref=e93]: "7"
          - button "Archived 20" [ref=e94] [cursor=pointer]:
            - text: Archived
            - generic [ref=e95]: "20"
        - generic [ref=e96]:
          - generic [ref=e97]: Sort projects
          - combobox "Sort projects" [ref=e98] [cursor=pointer]:
            - option "Default order" [selected]
            - option "Name, A–Z"
      - status [ref=e99]: Showing 50 of 70 projects
      - generic [ref=e100]:
        - article [ref=e101]:
          - 'link "View logo: Raven" [ref=e102] [cursor=pointer]':
            - /url: /logos/raven
            - generic [ref=e108]:
              - heading "Raven" [level=3] [ref=e109]
              - paragraph [ref=e110]: Connect GitHub Copilot to Anthropic- and OpenAI-compatible tools and track usage.
            - generic [ref=e111]:
              - generic [ref=e112]: AI & agents
              - 'img "Color palette: #b0a6c5, #31356a, #65408f, #9bdfc6, #4fb6d0, #101633" [ref=e113]':
                - generic "#b0a6c5" [ref=e114]
                - generic "#31356a" [ref=e115]
                - generic "#65408f" [ref=e116]
                - generic "#9bdfc6" [ref=e117]
                - generic "#4fb6d0" [ref=e118]
                - generic "#101633" [ref=e119]
          - 'link "View on GitHub: Raven" [ref=e120] [cursor=pointer]':
            - /url: https://github.com/nocoo/raven
            - text: GitHub
        - article [ref=e123]:
          - 'link "View logo: Pew" [active] [ref=e124] [cursor=pointer]':
            - /url: /logos/pew
            - generic [ref=e130]:
              - heading "Pew" [level=3] [ref=e131]
              - paragraph [ref=e132]: A contribution graph for the AI-native era. See your coding tokens tell a story.
            - generic [ref=e133]:
              - generic [ref=e134]: AI & agents
              - 'img "Color palette: #bfb2cf, #fcf8f0, #232637, #827f8e, #fb9383, #73dce7, #b97ce6" [ref=e135]':
                - generic "#bfb2cf" [ref=e136]
                - generic "#fcf8f0" [ref=e137]
                - generic "#232637" [ref=e138]
                - generic "#827f8e" [ref=e139]
                - generic "#fb9383" [ref=e140]
                - generic "#73dce7" [ref=e141]
                - generic "#b97ce6" [ref=e142]
          - 'link "View on GitHub: Pew" [ref=e143] [cursor=pointer]':
            - /url: https://github.com/nocoo/pew
            - text: GitHub
        - article [ref=e146]:
          - 'link "View logo: Xray" [ref=e147] [cursor=pointer]':
            - /url: /logos/xray
            - generic [ref=e153]:
              - heading "Xray" [level=3] [ref=e154]
              - paragraph [ref=e155]: A closer look at your Twitter / X activity, with analytics and AI-powered reports.
            - generic [ref=e156]:
              - generic [ref=e157]: Everyday life
              - 'img "Color palette: #756584, #f24d31, #f6bc36, #961b54, #991c56" [ref=e158]':
                - generic "#756584" [ref=e159]
                - generic "#f24d31" [ref=e160]
                - generic "#f6bc36" [ref=e161]
                - generic "#961b54" [ref=e162]
                - generic "#991c56" [ref=e163]
          - 'link "View on GitHub: Xray" [ref=e164] [cursor=pointer]':
            - /url: https://github.com/nocoo/xray
            - text: GitHub
        - article [ref=e167]:
          - 'link "View logo: Firefly" [ref=e168] [cursor=pointer]':
            - /url: /logos/firefly
            - generic [ref=e174]:
              - heading "Firefly" [level=3] [ref=e175]
              - paragraph [ref=e176]: A modern home for writing, publishing, and the ideas worth keeping.
            - generic [ref=e177]:
              - generic [ref=e178]: Everyday life
              - 'img "Color palette: #10282e, #fbaa3a, #fcf375, #fae1b1, #271815, #706170, #fc8816" [ref=e179]':
                - generic "#10282e" [ref=e180]
                - generic "#fbaa3a" [ref=e181]
                - generic "#fcf375" [ref=e182]
                - generic "#fae1b1" [ref=e183]
                - generic "#271815" [ref=e184]
                - generic "#706170" [ref=e185]
                - generic "#fc8816" [ref=e186]
          - 'link "View on GitHub: Firefly" [ref=e187] [cursor=pointer]':
            - /url: https://github.com/nocoo/firefly
            - text: GitHub
        - article [ref=e190]:
          - 'link "View logo: Bat" [ref=e191] [cursor=pointer]':
            - /url: /logos/bat
            - generic [ref=e197]:
              - heading "Bat" [level=3] [ref=e198]
              - paragraph [ref=e199]: A lightweight watchtower for your servers, with a Rust probe and a clear dashboard.
            - generic [ref=e200]:
              - generic [ref=e201]: Developer tools
              - 'img "Color palette: #9a7e90, #72556f, #a589a4, #302935, #d78b8f, #639ea2" [ref=e202]':
                - generic "#9a7e90" [ref=e203]
                - generic "#72556f" [ref=e204]
                - generic "#a589a4" [ref=e205]
                - generic "#302935" [ref=e206]
                - generic "#d78b8f" [ref=e207]
                - generic "#639ea2" [ref=e208]
          - 'link "View on GitHub: Bat" [ref=e209] [cursor=pointer]':
            - /url: https://github.com/nocoo/bat
            - text: GitHub
        - article [ref=e212]:
          - 'link "View logo: Shrike" [ref=e213] [cursor=pointer]':
            - /url: /logos/shrike
            - generic [ref=e219]:
              - heading "Shrike" [level=3] [ref=e220]
              - paragraph [ref=e221]: A small macOS menu bar app that keeps your files in sync with Google Drive.
            - generic [ref=e222]:
              - generic [ref=e223]: Developer tools
              - 'img "Color palette: #718591, #a0a1a6, #c4c7ce, #1a1a18, #b7936f, #576475" [ref=e224]':
                - generic "#718591" [ref=e225]
                - generic "#a0a1a6" [ref=e226]
                - generic "#c4c7ce" [ref=e227]
                - generic "#1a1a18" [ref=e228]
                - generic "#b7936f" [ref=e229]
                - generic "#576475" [ref=e230]
          - 'link "View on GitHub: Shrike" [ref=e231] [cursor=pointer]':
            - /url: https://github.com/nocoo/shrike
            - text: GitHub
        - article [ref=e234]:
          - 'link "View logo: Neo" [ref=e235] [cursor=pointer]':
            - /url: /logos/neo
            - generic [ref=e241]:
              - heading "Neo" [level=3] [ref=e242]
              - paragraph [ref=e243]: Your two-factor codes, together. Encrypted storage, easy imports, and offline access.
            - generic [ref=e244]:
              - generic [ref=e245]: Everyday life
              - 'img "Color palette: #5c7eaa, #f4be7e, #ffdebb, #b17158, #e88089, #322a37" [ref=e246]':
                - generic "#5c7eaa" [ref=e247]
                - generic "#f4be7e" [ref=e248]
                - generic "#ffdebb" [ref=e249]
                - generic "#b17158" [ref=e250]
                - generic "#e88089" [ref=e251]
                - generic "#322a37" [ref=e252]
          - 'link "View on GitHub: Neo" [ref=e253] [cursor=pointer]':
            - /url: https://github.com/nocoo/neo
            - text: GitHub
        - article [ref=e256]:
          - 'link "View logo: Backy" [ref=e257] [cursor=pointer]':
            - /url: /logos/backy
            - generic [ref=e263]:
              - heading "Backy" [level=3] [ref=e264]
              - paragraph [ref=e265]: A dependable home for AI-agent backups. Store, inspect, and restore with confidence.
            - generic [ref=e266]:
              - generic [ref=e267]: Developer tools
              - 'img "Color palette: #829178, #818a45, #344b2f, #d5b455, #d77656, #518c99" [ref=e268]':
                - generic "#829178" [ref=e269]
                - generic "#818a45" [ref=e270]
                - generic "#344b2f" [ref=e271]
                - generic "#d5b455" [ref=e272]
                - generic "#d77656" [ref=e273]
                - generic "#518c99" [ref=e274]
          - 'link "View on GitHub: Backy" [ref=e275] [cursor=pointer]':
            - /url: https://github.com/nocoo/backy
            - text: GitHub
        - article [ref=e278]:
          - 'link "View logo: Otter" [ref=e279] [cursor=pointer]':
            - /url: /logos/otter
            - generic [ref=e285]:
              - heading "Otter" [level=3] [ref=e286]
              - paragraph [ref=e287]: Keep your Mac development setup safe with snapshots, diffs, and cloud backups.
            - generic [ref=e288]:
              - generic [ref=e289]: Developer tools
              - 'img "Color palette: #648691, #a97542, #61462f, #ead0a5, #409999, #e99178" [ref=e290]':
                - generic "#648691" [ref=e291]
                - generic "#a97542" [ref=e292]
                - generic "#61462f" [ref=e293]
                - generic "#ead0a5" [ref=e294]
                - generic "#409999" [ref=e295]
                - generic "#e99178" [ref=e296]
          - 'link "View on GitHub: Otter" [ref=e297] [cursor=pointer]':
            - /url: https://github.com/nocoo/otter
            - text: GitHub
        - article [ref=e300]:
          - 'link "View logo: Gecko" [ref=e301] [cursor=pointer]':
            - /url: /logos/gecko
            - generic [ref=e307]:
              - heading "Gecko" [level=3] [ref=e308]
              - paragraph [ref=e309]: A little perspective on your screen time, with a Mac tracker and a synced dashboard.
            - generic [ref=e310]:
              - generic [ref=e311]: Everyday life
              - 'img "Color palette: #926d60, #c4a576, #bd9f6d, #bd9f6d, #e4d4b0, #bd9f6d" [ref=e312]':
                - generic "#926d60" [ref=e313]
                - generic "#c4a576" [ref=e314]
                - generic "#bd9f6d" [ref=e315]
                - generic "#bd9f6d" [ref=e316]
                - generic "#e4d4b0" [ref=e317]
                - generic "#bd9f6d" [ref=e318]
          - 'link "View on GitHub: Gecko" [ref=e319] [cursor=pointer]':
            - /url: https://github.com/nocoo/gecko
            - text: GitHub
        - article [ref=e322]:
          - 'link "View logo: Dove" [ref=e323] [cursor=pointer]':
            - /url: /logos/dove
            - generic [ref=e329]:
              - heading "Dove" [level=3] [ref=e330]
              - paragraph [ref=e331]: A self-hosted email relay with webhooks, reusable templates, and delivery insights.
            - generic [ref=e332]:
              - generic [ref=e333]: Developer tools
              - 'img "Color palette: #83759b, #8079a5, #4c5777, #fbccc6, #65c8b6, #d4b7a9" [ref=e334]':
                - generic "#83759b" [ref=e335]
                - generic "#8079a5" [ref=e336]
                - generic "#4c5777" [ref=e337]
                - generic "#fbccc6" [ref=e338]
                - generic "#65c8b6" [ref=e339]
                - generic "#d4b7a9" [ref=e340]
          - 'link "View on GitHub: Dove" [ref=e341] [cursor=pointer]':
            - /url: https://github.com/nocoo/dove
            - text: GitHub
        - article [ref=e344]:
          - 'link "View logo: Pika" [ref=e345] [cursor=pointer]':
            - /url: /logos/pika
            - generic [ref=e351]:
              - heading "Pika" [level=3] [ref=e352]
              - paragraph [ref=e353]: Replay, search, and rediscover your AI coding conversations.
            - generic [ref=e354]:
              - generic [ref=e355]: AI & agents
              - 'img "Color palette: #918451, #fdc904, #fdc904, #fdc904, #fdc904, #fdc904" [ref=e356]':
                - generic "#918451" [ref=e357]
                - generic "#fdc904" [ref=e358]
                - generic "#fdc904" [ref=e359]
                - generic "#fdc904" [ref=e360]
                - generic "#fdc904" [ref=e361]
                - generic "#fdc904" [ref=e362]
          - 'link "View on GitHub: Pika" [ref=e363] [cursor=pointer]':
            - /url: https://github.com/nocoo/pika
            - text: GitHub
        - article [ref=e366]:
          - 'link "View logo: Lyre" [ref=e367] [cursor=pointer]':
            - /url: /logos/lyre
            - generic [ref=e373]:
              - heading "Lyre" [level=3] [ref=e374]
              - paragraph [ref=e375]: Recordings, transcripts, and word-by-word playback, beautifully in sync.
            - generic [ref=e376]:
              - generic [ref=e377]: Everyday life
              - 'img "Color palette: #a16850, #a35d3b, #d7884d, #dfc39e, #5d2e24, #f2a965" [ref=e378]':
                - generic "#a16850" [ref=e379]
                - generic "#a35d3b" [ref=e380]
                - generic "#d7884d" [ref=e381]
                - generic "#dfc39e" [ref=e382]
                - generic "#5d2e24" [ref=e383]
                - generic "#f2a965" [ref=e384]
          - 'link "View on GitHub: Lyre" [ref=e385] [cursor=pointer]':
            - /url: https://github.com/nocoo/lyre
            - text: GitHub
        - article [ref=e388]:
          - 'link "View logo: Codo" [ref=e389] [cursor=pointer]':
            - /url: /logos/codo
            - generic [ref=e395]:
              - heading "Codo" [level=3] [ref=e396]
              - paragraph [ref=e397]: A quiet macOS notification bridge between your AI agents and your desktop.
            - generic [ref=e398]:
              - generic [ref=e399]: Developer tools
              - 'img "Color palette: #5f8988, #349078, #247185, #764395, #e8675e, #ddb048" [ref=e400]':
                - generic "#5f8988" [ref=e401]
                - generic "#349078" [ref=e402]
                - generic "#247185" [ref=e403]
                - generic "#764395" [ref=e404]
                - generic "#e8675e" [ref=e405]
                - generic "#ddb048" [ref=e406]
          - 'link "View on GitHub: Codo" [ref=e407] [cursor=pointer]':
            - /url: https://github.com/nocoo/codo
            - text: GitHub
        - article [ref=e410]:
          - 'link "View logo: Wooly" [ref=e411] [cursor=pointer]':
            - /url: /logos/wooly
            - generic [ref=e417]:
              - heading "Wooly" [level=3] [ref=e418]
              - paragraph [ref=e419]: "Keep family perks in sight: card rewards, memberships, insurance, and expiry dates."
            - generic [ref=e420]:
              - generic [ref=e421]: Everyday life
              - 'img "Color palette: #ad8093, #f3e6c4, #d4bc98, #ac806c, #ef9790, #2c3441" [ref=e422]':
                - generic "#ad8093" [ref=e423]
                - generic "#f3e6c4" [ref=e424]
                - generic "#d4bc98" [ref=e425]
                - generic "#ac806c" [ref=e426]
                - generic "#ef9790" [ref=e427]
                - generic "#2c3441" [ref=e428]
          - 'link "View on GitHub: Wooly" [ref=e429] [cursor=pointer]':
            - /url: https://github.com/nocoo/wooly
            - text: GitHub
        - article [ref=e432]:
          - 'link "View logo: Surety" [ref=e433] [cursor=pointer]':
            - /url: /logos/surety
            - generic [ref=e439]:
              - heading "Surety" [level=3] [ref=e440]
              - paragraph [ref=e441]: A private, local-first home for your family insurance policies.
            - generic [ref=e442]:
              - generic [ref=e443]: Everyday life
              - 'img "Color palette: #9b865c, #cc8330, #754321, #edcfa7, #19989b, #6f4584" [ref=e444]':
                - generic "#9b865c" [ref=e445]
                - generic "#cc8330" [ref=e446]
                - generic "#754321" [ref=e447]
                - generic "#edcfa7" [ref=e448]
                - generic "#19989b" [ref=e449]
                - generic "#6f4584" [ref=e450]
          - 'link "View on GitHub: Surety" [ref=e451] [cursor=pointer]':
            - /url: https://github.com/nocoo/surety
            - text: GitHub
        - article [ref=e454]:
          - 'link "View logo: Life.ai" [ref=e455] [cursor=pointer]':
            - /url: /logos/life-ai
            - generic [ref=e461]:
              - heading "Life.ai" [level=3] [ref=e462]
              - paragraph [ref=e463]: Bring health, places, and spending into one personal picture.
            - generic [ref=e464]:
              - generic [ref=e465]: Everyday life
              - 'img "Color palette: #b7aa8e, #c18d57, #694936, #e1412e, #77a848, #276da5, #793ca6" [ref=e466]':
                - generic "#b7aa8e" [ref=e467]
                - generic "#c18d57" [ref=e468]
                - generic "#694936" [ref=e469]
                - generic "#e1412e" [ref=e470]
                - generic "#77a848" [ref=e471]
                - generic "#276da5" [ref=e472]
                - generic "#793ca6" [ref=e473]
          - 'link "View on GitHub: Life.ai" [ref=e474] [cursor=pointer]':
            - /url: https://github.com/nocoo/life.ai
            - text: GitHub
        - article [ref=e477]:
          - 'link "View logo: Zhe" [ref=e478] [cursor=pointer]':
            - /url: /logos/zhe
            - generic [ref=e484]:
              - heading "Zhe" [level=3] [ref=e485]
              - paragraph [ref=e486]: Short links, clean URLs, and a little less friction when sharing things.
            - generic [ref=e487]:
              - generic [ref=e488]: Developer tools
              - 'img "Color palette: #bb914f, #f0b724, #e48f2a, #47260c, #86cddf, #fac7e2, #e57863" [ref=e489]':
                - generic "#bb914f" [ref=e490]
                - generic "#f0b724" [ref=e491]
                - generic "#e48f2a" [ref=e492]
                - generic "#47260c" [ref=e493]
                - generic "#86cddf" [ref=e494]
                - generic "#fac7e2" [ref=e495]
                - generic "#e57863" [ref=e496]
          - 'link "View on GitHub: Zhe" [ref=e497] [cursor=pointer]':
            - /url: https://github.com/nocoo/zhe
            - text: GitHub
        - article [ref=e500]:
          - 'link "View logo: Noheir" [ref=e501] [cursor=pointer]':
            - /url: /logos/noheir
            - generic [ref=e507]:
              - heading "Noheir" [level=3] [ref=e508]
              - paragraph [ref=e509]: "A clear view of your money: income, spending, assets, and the bigger picture."
            - generic [ref=e510]:
              - generic [ref=e511]: Everyday life
              - 'img "Color palette: #638783, #b4642e, #f1ddc3, #f29b8a, #586b7b, #713b28" [ref=e512]':
                - generic "#638783" [ref=e513]
                - generic "#b4642e" [ref=e514]
                - generic "#f1ddc3" [ref=e515]
                - generic "#f29b8a" [ref=e516]
                - generic "#586b7b" [ref=e517]
                - generic "#713b28" [ref=e518]
          - 'link "View on GitHub: Noheir" [ref=e519] [cursor=pointer]':
            - /url: https://github.com/nocoo/noheir
            - text: GitHub
        - article [ref=e522]:
          - 'link "View logo: Ellie" [ref=e523] [cursor=pointer]':
            - /url: /logos/ellie
            - generic [ref=e529]:
              - heading "Ellie" [level=3] [ref=e530]
              - paragraph [ref=e531]: A modern forum for thoughtful conversations, with a companion terminal client.
            - generic [ref=e532]:
              - generic [ref=e533]: Everyday life
              - 'img "Color palette: #537b93, #9dabb7, #395970, #e9dac5, #248aa0, #9379a2" [ref=e534]':
                - generic "#537b93" [ref=e535]
                - generic "#9dabb7" [ref=e536]
                - generic "#395970" [ref=e537]
                - generic "#e9dac5" [ref=e538]
                - generic "#248aa0" [ref=e539]
                - generic "#9379a2" [ref=e540]
          - 'link "View on GitHub: Ellie" [ref=e541] [cursor=pointer]':
            - /url: https://github.com/nocoo/ellie
            - text: GitHub
        - article [ref=e544]:
          - 'link "View logo: Owl" [ref=e545] [cursor=pointer]':
            - /url: /logos/owl
            - generic [ref=e551]:
              - heading "Owl" [level=3] [ref=e552]
              - paragraph [ref=e553]: A macOS menu bar lookout that spots unusual patterns in your system logs.
            - generic [ref=e554]:
              - generic [ref=e555]: Developer tools
              - 'img "Color palette: #5f6684, #93816a, #e5cfab, #cd8523, #dc8470, #844c6e" [ref=e556]':
                - generic "#5f6684" [ref=e557]
                - generic "#93816a" [ref=e558]
                - generic "#e5cfab" [ref=e559]
                - generic "#cd8523" [ref=e560]
                - generic "#dc8470" [ref=e561]
                - generic "#844c6e" [ref=e562]
          - 'link "View on GitHub: Owl" [ref=e563] [cursor=pointer]':
            - /url: https://github.com/nocoo/owl
            - text: GitHub
        - article [ref=e566]:
          - 'link "View logo: R2Shot" [ref=e567] [cursor=pointer]':
            - /url: /logos/r2shot
            - generic [ref=e573]:
              - heading "R2Shot" [level=3] [ref=e574]
              - paragraph [ref=e575]: Capture a screenshot, upload it to R2, and have a shareable link on your clipboard.
            - generic [ref=e576]:
              - generic [ref=e577]: Developer tools
              - 'img "Color palette: #4d818c, #3fc2d0, #198eba, #dbffff, #143361, #2ebad5" [ref=e578]':
                - generic "#4d818c" [ref=e579]
                - generic "#3fc2d0" [ref=e580]
                - generic "#198eba" [ref=e581]
                - generic "#dbffff" [ref=e582]
                - generic "#143361" [ref=e583]
                - generic "#2ebad5" [ref=e584]
          - 'link "View on GitHub: R2Shot" [ref=e585] [cursor=pointer]':
            - /url: https://github.com/nocoo/r2shot
            - text: GitHub
        - article [ref=e588]:
          - 'link "View logo: Hooky" [ref=e589] [cursor=pointer]':
            - /url: /logos/hooky
            - generic [ref=e595]:
              - heading "Hooky" [level=3] [ref=e596]
              - paragraph [ref=e597]: Send webhooks from your browser toolbar, context menu, or a quick message.
            - generic [ref=e598]:
              - generic [ref=e599]: Developer tools
              - 'img "Color palette: #9d7097, #e9a5bf, #b771af, #fedced, #8b4e93, #42274d" [ref=e600]':
                - generic "#9d7097" [ref=e601]
                - generic "#e9a5bf" [ref=e602]
                - generic "#b771af" [ref=e603]
                - generic "#fedced" [ref=e604]
                - generic "#8b4e93" [ref=e605]
                - generic "#42274d" [ref=e606]
          - 'link "View on GitHub: Hooky" [ref=e607] [cursor=pointer]':
            - /url: https://github.com/nocoo/hooky
            - text: GitHub
        - article [ref=e610]:
          - 'link "View logo: Meowth" [ref=e611] [cursor=pointer]':
            - /url: /logos/meowth
            - generic [ref=e617]:
              - heading "Meowth" [level=3] [ref=e618]
              - paragraph [ref=e619]: Local bridge for five coding-agent CLIs with HTTP control and a web dashboard
            - generic [ref=e620]:
              - generic [ref=e621]: AI & agents
              - 'img "Color palette: #b5a6bb, #4c6073, #bdc2cc, #e8ded4, #e3b265, #2badb8, #f1958d" [ref=e622]':
                - generic "#b5a6bb" [ref=e623]
                - generic "#4c6073" [ref=e624]
                - generic "#bdc2cc" [ref=e625]
                - generic "#e8ded4" [ref=e626]
                - generic "#e3b265" [ref=e627]
                - generic "#2badb8" [ref=e628]
                - generic "#f1958d" [ref=e629]
          - 'link "View on GitHub: Meowth" [ref=e630] [cursor=pointer]':
            - /url: https://github.com/nocoo/meowth
            - text: GitHub
        - article [ref=e633]:
          - 'link "View logo: Frogie" [ref=e634] [cursor=pointer]':
            - /url: /logos/frogie
            - generic [ref=e640]:
              - heading "Frogie" [level=3] [ref=e641]
              - paragraph [ref=e642]: A local-first home for your AI agents. Chat, tools, and sessions in one place.
            - generic [ref=e643]:
              - generic [ref=e644]: AI & agents
              - 'img "Color palette: #bbcb9e, #86c32c, #fbf4a8, #3b1220, #f78571, #56c8ee, #9a4fbd" [ref=e645]':
                - generic "#bbcb9e" [ref=e646]
                - generic "#86c32c" [ref=e647]
                - generic "#fbf4a8" [ref=e648]
                - generic "#3b1220" [ref=e649]
                - generic "#f78571" [ref=e650]
                - generic "#56c8ee" [ref=e651]
                - generic "#9a4fbd" [ref=e652]
          - 'link "View on GitHub: Frogie" [ref=e653] [cursor=pointer]':
            - /url: https://github.com/nocoo/frogie
            - text: GitHub
        - article [ref=e656]:
          - 'link "View logo: Bogo" [ref=e657] [cursor=pointer]':
            - /url: /logos/bogo
            - generic [ref=e663]:
              - heading "Bogo" [level=3] [ref=e664]
              - paragraph [ref=e665]: A personal knowledge home for documents, people, and the connections between them.
            - generic [ref=e666]:
              - generic [ref=e667]: Everyday life
              - 'img "Color palette: #b7a186, #6d4c3c, #fac15e, #4d3529, #e43e3e, #81b64f, #0c7b6b, #0e8eb1, #863a9a" [ref=e668]':
                - generic "#b7a186" [ref=e669]
                - generic "#6d4c3c" [ref=e670]
                - generic "#fac15e" [ref=e671]
                - generic "#4d3529" [ref=e672]
                - generic "#e43e3e" [ref=e673]
                - generic "#81b64f" [ref=e674]
                - generic "#0c7b6b" [ref=e675]
                - generic "#0e8eb1" [ref=e676]
                - generic "#863a9a" [ref=e677]
          - 'link "View on GitHub: Bogo" [ref=e678] [cursor=pointer]':
            - /url: https://github.com/nocoo/bogo
            - text: GitHub
        - article [ref=e681]:
          - 'link "View logo: Steed" [ref=e682] [cursor=pointer]':
            - /url: /logos/steed
            - generic [ref=e688]:
              - heading "Steed" [level=3] [ref=e689]
              - paragraph [ref=e690]: A shared home for AI agents, their assets, and the relationships between them.
            - generic [ref=e691]:
              - generic [ref=e692]: AI & agents
              - 'img "Color palette: #53817c, #ba7135, #4d3428, #f3d2a9, #309eaf, #eb8361" [ref=e693]':
                - generic "#53817c" [ref=e694]
                - generic "#ba7135" [ref=e695]
                - generic "#4d3428" [ref=e696]
                - generic "#f3d2a9" [ref=e697]
                - generic "#309eaf" [ref=e698]
                - generic "#eb8361" [ref=e699]
          - 'link "View on GitHub: Steed" [ref=e700] [cursor=pointer]':
            - /url: https://github.com/nocoo/steed
            - text: GitHub
        - article [ref=e703]:
          - 'link "View logo: Fundly" [ref=e704] [cursor=pointer]':
            - /url: /logos/fundly
            - generic [ref=e710]:
              - heading "Fundly" [level=3] [ref=e711]
              - paragraph [ref=e712]: China mutual-fund browser and ranking tool with local SQLite and Railway
            - generic [ref=e713]:
              - generic [ref=e714]: Everyday life
              - 'img "Color palette: #9aafbb, #192541, #27365c, #dfd2b8, #80682e, #335866, #cb615f" [ref=e715]':
                - generic "#9aafbb" [ref=e716]
                - generic "#192541" [ref=e717]
                - generic "#27365c" [ref=e718]
                - generic "#dfd2b8" [ref=e719]
                - generic "#80682e" [ref=e720]
                - generic "#335866" [ref=e721]
                - generic "#cb615f" [ref=e722]
          - 'link "View on GitHub: Fundly" [ref=e723] [cursor=pointer]':
            - /url: https://github.com/nocoo/fundly
            - text: GitHub
        - article [ref=e726]:
          - 'link "View logo: clip" [ref=e727] [cursor=pointer]':
            - /url: /logos/clip
            - generic [ref=e733]:
              - heading "clip" [level=3] [ref=e734]
              - paragraph [ref=e735]: Generate fully working CLIs from a clip.yaml schema, with built-in credential management
            - generic [ref=e736]:
              - generic [ref=e737]: Developer tools
              - 'img "Color palette: #baae91, #df9457, #b3977a, #542c1c, #67b8db, #ec3536, #aa438c" [ref=e738]':
                - generic "#baae91" [ref=e739]
                - generic "#df9457" [ref=e740]
                - generic "#b3977a" [ref=e741]
                - generic "#542c1c" [ref=e742]
                - generic "#67b8db" [ref=e743]
                - generic "#ec3536" [ref=e744]
                - generic "#aa438c" [ref=e745]
          - 'link "View on GitHub: clip" [ref=e746] [cursor=pointer]':
            - /url: https://github.com/nocoo/clip
            - text: GitHub
        - article [ref=e749]:
          - 'link "View logo: Giraffe" [ref=e750] [cursor=pointer]':
            - /url: /logos/giraffe
            - generic [ref=e756]:
              - heading "Giraffe" [level=3] [ref=e757]
              - paragraph [ref=e758]: A personal GitHub observatory for repositories, workflows, and encrypted snapshots.
            - generic [ref=e759]:
              - generic [ref=e760]: Developer tools
              - 'img "Color palette: #79865b, #e6a328, #884812, #f3d49e, #828731, #c76036" [ref=e761]':
                - generic "#79865b" [ref=e762]
                - generic "#e6a328" [ref=e763]
                - generic "#884812" [ref=e764]
                - generic "#f3d49e" [ref=e765]
                - generic "#828731" [ref=e766]
                - generic "#c76036" [ref=e767]
          - 'link "View on GitHub: Giraffe" [ref=e768] [cursor=pointer]':
            - /url: https://github.com/nocoo/giraffe
            - text: GitHub
        - article [ref=e771]:
          - 'link "View logo: Snaky" [ref=e772] [cursor=pointer]':
            - /url: /logos/snaky
            - generic [ref=e778]:
              - heading "Snaky" [level=3] [ref=e779]
              - paragraph [ref=e780]: Know where your traffic goes. Inspect VPN routes, exit IPs, latency, and proxy rules.
            - generic [ref=e781]:
              - generic [ref=e782]: Developer tools
              - 'img "Color palette: #778e57, #8bbc3f, #c6dc5b, #e6c88f, #d96e6b, #8779b3" [ref=e783]':
                - generic "#778e57" [ref=e784]
                - generic "#8bbc3f" [ref=e785]
                - generic "#c6dc5b" [ref=e786]
                - generic "#e6c88f" [ref=e787]
                - generic "#d96e6b" [ref=e788]
                - generic "#8779b3" [ref=e789]
          - 'link "View on GitHub: Snaky" [ref=e790] [cursor=pointer]':
            - /url: https://github.com/nocoo/snaky
            - text: GitHub
        - article [ref=e793]:
          - 'link "View logo: Rooster" [ref=e794] [cursor=pointer]':
            - /url: /logos/rooster
            - generic [ref=e800]:
              - heading "Rooster" [level=3] [ref=e801]
              - paragraph [ref=e802]: A web control panel for Hermes Agent, from conversations to models and profiles.
            - generic [ref=e803]:
              - generic [ref=e804]: AI & agents
              - 'img "Color palette: #9c8460, #ba7522, #f0cf8d, #274e3c, #dc777d, #786a9f" [ref=e805]':
                - generic "#9c8460" [ref=e806]
                - generic "#ba7522" [ref=e807]
                - generic "#f0cf8d" [ref=e808]
                - generic "#274e3c" [ref=e809]
                - generic "#dc777d" [ref=e810]
                - generic "#786a9f" [ref=e811]
          - 'link "View on GitHub: Rooster" [ref=e812] [cursor=pointer]':
            - /url: https://github.com/nocoo/rooster
            - text: GitHub
        - article [ref=e815]:
          - 'link "View logo: Gaga" [ref=e816] [cursor=pointer]':
            - /url: /logos/gaga
            - generic [ref=e822]:
              - heading "Gaga" [level=3] [ref=e823]
              - paragraph [ref=e824]: A tiny 3D playroom where Taotao can explore, wander, and discover toys.
            - generic [ref=e825]:
              - generic [ref=e826]: Play
              - 'img "Color palette: #b38c77, #c39c65, #ecd3a5, #997040, #ed7520, #418e8c" [ref=e827]':
                - generic "#b38c77" [ref=e828]
                - generic "#c39c65" [ref=e829]
                - generic "#ecd3a5" [ref=e830]
                - generic "#997040" [ref=e831]
                - generic "#ed7520" [ref=e832]
                - generic "#418e8c" [ref=e833]
          - 'link "View on GitHub: Gaga" [ref=e834] [cursor=pointer]':
            - /url: https://github.com/nocoo/gaga
            - text: GitHub
        - article [ref=e837]:
          - 'link "View logo: Dotty" [ref=e838] [cursor=pointer]':
            - /url: /logos/dotty
            - generic [ref=e844]:
              - heading "Dotty" [level=3] [ref=e845]
              - paragraph [ref=e846]: A pixel-brutalist dashboard kit with monochrome geometry and stacked charts.
            - generic [ref=e847]:
              - generic [ref=e848]: Design
              - 'img "Color palette: #e5eaf1, #1a1c1d, #fbfbfb, #919699" [ref=e849]':
                - generic "#e5eaf1" [ref=e850]
                - generic "#1a1c1d" [ref=e851]
                - generic "#fbfbfb" [ref=e852]
                - generic "#919699" [ref=e853]
          - 'link "View on GitHub: Dotty" [ref=e854] [cursor=pointer]':
            - /url: https://github.com/nocoo/dotty
            - text: GitHub
        - article [ref=e857]:
          - 'link "View logo: Matrix" [ref=e858] [cursor=pointer]':
            - /url: /logos/matrix
            - generic [ref=e864]:
              - heading "Matrix" [level=3] [ref=e865]
              - paragraph [ref=e866]: A sci-fi dashboard kit for interfaces that feel like a glimpse into the digital world.
            - generic [ref=e867]:
              - generic [ref=e868]: Design
              - 'img "Color palette: #e2eee7, #1d2222, #29bf5a, #a79667, #b2f6cb" [ref=e869]':
                - generic "#e2eee7" [ref=e870]
                - generic "#1d2222" [ref=e871]
                - generic "#29bf5a" [ref=e872]
                - generic "#a79667" [ref=e873]
                - generic "#b2f6cb" [ref=e874]
          - 'link "View on GitHub: Matrix" [ref=e875] [cursor=pointer]':
            - /url: https://github.com/nocoo/matrix
            - text: GitHub
        - article [ref=e878]:
          - 'link "View logo: Basalt" [ref=e879] [cursor=pointer]':
            - /url: /logos/basalt
            - generic [ref=e885]:
              - heading "Basalt" [level=3] [ref=e886]
              - paragraph [ref=e887]: Dense, dark, durable. A matte design system for information-rich software.
            - generic [ref=e888]:
              - generic [ref=e889]: Design
              - 'img "Color palette: #ede6d8, #5ac2f6, #8dd35a, #f694b2, #eec14b, #edeeeb, #d3d7d8" [ref=e890]':
                - generic "#ede6d8" [ref=e891]
                - generic "#5ac2f6" [ref=e892]
                - generic "#8dd35a" [ref=e893]
                - generic "#f694b2" [ref=e894]
                - generic "#eec14b" [ref=e895]
                - generic "#edeeeb" [ref=e896]
                - generic "#d3d7d8" [ref=e897]
          - 'link "View on GitHub: Basalt" [ref=e898] [cursor=pointer]':
            - /url: https://github.com/nocoo/basalt
            - text: GitHub
        - article [ref=e901]:
          - 'link "View logo: Poké Pocket" [ref=e902] [cursor=pointer]':
            - /url: /logos/pokepocket
            - generic [ref=e908]:
              - heading "Poké Pocket" [level=3] [ref=e909]
              - paragraph [ref=e910]: GB / GBC / GBA collection with browser play and local saves
            - generic [ref=e911]:
              - generic [ref=e912]: Play
              - 'img "Color palette: #af4b4a, #f55d5c, #2e2836, #fafafa, #fae6cd" [ref=e913]':
                - generic "#af4b4a" [ref=e914]
                - generic "#f55d5c" [ref=e915]
                - generic "#2e2836" [ref=e916]
                - generic "#fafafa" [ref=e917]
                - generic "#fae6cd" [ref=e918]
          - 'link "View on GitHub: Poké Pocket" [ref=e919] [cursor=pointer]':
            - /url: https://github.com/nocoo/pokepocket
            - text: GitHub
        - article [ref=e922]:
          - 'link "View logo: Dogfight" [ref=e923] [cursor=pointer]':
            - /url: /logos/dogfight
            - generic [ref=e929]:
              - heading "Dogfight" [level=3] [ref=e930]
              - paragraph [ref=e931]: An arcade dogfight in the browser. Take an F-22 into a sky full of Su-35s.
            - generic [ref=e932]:
              - generic [ref=e933]: Play
              - 'img "Color palette: #d0dfe9, #878f95, #694d2c, #bcbfbd" [ref=e934]':
                - generic "#d0dfe9" [ref=e935]
                - generic "#878f95" [ref=e936]
                - generic "#694d2c" [ref=e937]
                - generic "#bcbfbd" [ref=e938]
          - 'link "View on GitHub: Dogfight" [ref=e939] [cursor=pointer]':
            - /url: https://github.com/nocoo/dogfight
            - text: GitHub
        - article [ref=e942]:
          - 'link "View logo: Pew Game" [ref=e943] [cursor=pointer]':
            - /url: /logos/pew-game
            - generic [ref=e949]:
              - heading "Pew Game" [level=3] [ref=e950]
              - paragraph [ref=e951]: A pixel-art prairie shooter with twin-stick action and a high-score leaderboard.
            - generic [ref=e952]:
              - generic [ref=e953]: Play
              - 'img "Color palette: #d6bb8a, #583b2c, #651b19, #836b42, #da9438, #506866" [ref=e954]':
                - generic "#d6bb8a" [ref=e955]
                - generic "#583b2c" [ref=e956]
                - generic "#651b19" [ref=e957]
                - generic "#836b42" [ref=e958]
                - generic "#da9438" [ref=e959]
                - generic "#506866" [ref=e960]
          - 'link "View on GitHub: Pew Game" [ref=e961] [cursor=pointer]':
            - /url: https://github.com/nocoo/pew-game
            - text: GitHub
        - article [ref=e964]:
          - 'link "View logo: DreamRO" [ref=e965] [cursor=pointer]':
            - /url: /logos/dreamro
            - generic [ref=e971]:
              - heading "DreamRO" [level=3] [ref=e972]
              - paragraph [ref=e973]: Nostalgic 3D browser RPG with 20 classes, three realms, and local saves
            - generic [ref=e974]:
              - generic [ref=e975]: Play
              - 'img "Color palette: #dccfad, #5c6456, #e3be8e, #e2dfdb, #29170b, #382cbe, #31221e" [ref=e976]':
                - generic "#dccfad" [ref=e977]
                - generic "#5c6456" [ref=e978]
                - generic "#e3be8e" [ref=e979]
                - generic "#e2dfdb" [ref=e980]
                - generic "#29170b" [ref=e981]
                - generic "#382cbe" [ref=e982]
                - generic "#31221e" [ref=e983]
          - 'link "View on GitHub: DreamRO" [ref=e984] [cursor=pointer]':
            - /url: https://github.com/nocoo/dreamro
            - text: GitHub
        - article [ref=e987]:
          - 'link "View logo: Info Space" [ref=e988] [cursor=pointer]':
            - /url: /logos/infospace
            - generic [ref=e994]:
              - heading "Info Space" [level=3] [ref=e995]
              - paragraph [ref=e996]: Native SwiftUI workspace SDK with resizable grids and customizable information panels
            - generic [ref=e997]:
              - generic [ref=e998]: Developer tools
              - 'img "Color palette: #c6cddd, #373e55, #c1b6b1, #5f6da3, #689088, #d8815c, #9d7ca8" [ref=e999]':
                - generic "#c6cddd" [ref=e1000]
                - generic "#373e55" [ref=e1001]
                - generic "#c1b6b1" [ref=e1002]
                - generic "#5f6da3" [ref=e1003]
                - generic "#689088" [ref=e1004]
                - generic "#d8815c" [ref=e1005]
                - generic "#9d7ca8" [ref=e1006]
          - 'link "View on GitHub: Info Space" [ref=e1007] [cursor=pointer]':
            - /url: https://github.com/nocoo/infospace
            - text: GitHub
        - article [ref=e1010]:
          - 'link "View logo: signoff.now" [ref=e1011] [cursor=pointer]':
            - /url: /logos/signoff-now
            - generic [ref=e1017]:
              - heading "signoff.now" [level=3] [ref=e1018]
              - paragraph [ref=e1019]: Developer and Git activity analytics
            - generic [ref=e1020]:
              - generic [ref=e1021]: Developer tools
              - 'img "Color palette: #c4d2da, #2d506f, #9a825a, #d8cdb1" [ref=e1022]':
                - generic "#c4d2da" [ref=e1023]
                - generic "#2d506f" [ref=e1024]
                - generic "#9a825a" [ref=e1025]
                - generic "#d8cdb1" [ref=e1026]
          - 'link "View on GitHub: signoff.now" [ref=e1027] [cursor=pointer]':
            - /url: https://github.com/nocoo/signoff.now
            - text: GitHub
        - article [ref=e1030]:
          - 'link "View logo: Unseal" [ref=e1031] [cursor=pointer]':
            - /url: /logos/unseal
            - generic [ref=e1037]:
              - heading "Unseal" [level=3] [ref=e1038]
              - paragraph [ref=e1039]: Find quarantined macOS apps and interactively remove their quarantine flags.
            - generic [ref=e1040]:
              - generic [ref=e1041]: Developer tools
              - 'img "Color palette: #bdcebd, #4e5b4b, #97793d, #d85238" [ref=e1042]':
                - generic "#bdcebd" [ref=e1043]
                - generic "#4e5b4b" [ref=e1044]
                - generic "#97793d" [ref=e1045]
                - generic "#d85238" [ref=e1046]
          - 'link "View on GitHub: Unseal" [ref=e1047] [cursor=pointer]':
            - /url: https://github.com/nocoo/unseal
            - text: GitHub
        - article [ref=e1050]:
          - 'link "View logo: Flow" [ref=e1051] [cursor=pointer]':
            - /url: /logos/flow
            - generic [ref=e1057]:
              - heading "Flow" [level=3] [ref=e1058]
              - paragraph [ref=e1059]: A Chinese pinyin input engine that brings language models into everyday typing.
            - generic [ref=e1060]:
              - generic [ref=e1061]: Everyday life
              - 'img "Color palette: #c4d8cf, #8ba48c, #e2d7b7, #2c2d27, #866540" [ref=e1062]':
                - generic "#c4d8cf" [ref=e1063]
                - generic "#8ba48c" [ref=e1064]
                - generic "#e2d7b7" [ref=e1065]
                - generic "#2c2d27" [ref=e1066]
                - generic "#866540" [ref=e1067]
          - 'link "View on GitHub: Flow" [ref=e1068] [cursor=pointer]':
            - /url: https://github.com/nocoo/flow
            - text: GitHub
        - article [ref=e1071]:
          - 'link "View logo: Arena" [ref=e1072] [cursor=pointer]':
            - /url: /logos/arena
            - generic [ref=e1078]:
              - heading "Arena" [level=3] [ref=e1079]
              - paragraph [ref=e1080]: Let coding agents debate solutions while you review, compare, and decide.
            - generic [ref=e1081]:
              - generic [ref=e1082]: AI & agents
              - 'img "Color palette: #d4c1a7, #67442b, #dcccaa, #947544" [ref=e1083]':
                - generic "#d4c1a7" [ref=e1084]
                - generic "#67442b" [ref=e1085]
                - generic "#dcccaa" [ref=e1086]
                - generic "#947544" [ref=e1087]
          - 'link "View on GitHub: Arena" [ref=e1088] [cursor=pointer]':
            - /url: https://github.com/nocoo/arena
            - text: GitHub
        - article [ref=e1091]:
          - 'link "View logo: Echo" [ref=e1092] [cursor=pointer]':
            - /url: /logos/echo
            - generic [ref=e1098]:
              - heading "Echo" [level=3] [ref=e1099]
              - paragraph [ref=e1100]: A small, fast IP lookup service, built with Bun and TypeScript.
            - generic [ref=e1101]:
              - generic [ref=e1102]: Developer tools
              - 'img "Color palette: #bfd4d7, #192d3e, #b19254, #a42f1e, #e2cfa2" [ref=e1103]':
                - generic "#bfd4d7" [ref=e1104]
                - generic "#192d3e" [ref=e1105]
                - generic "#b19254" [ref=e1106]
                - generic "#a42f1e" [ref=e1107]
                - generic "#e2cfa2" [ref=e1108]
          - 'link "View on GitHub: Echo" [ref=e1109] [cursor=pointer]':
            - /url: https://github.com/nocoo/echo
            - text: GitHub
        - article [ref=e1112]:
          - 'link "View logo: Deca" [ref=e1113] [cursor=pointer]':
            - /url: /logos/deca
            - generic [ref=e1119]:
              - heading "Deca" [level=3] [ref=e1120]
              - paragraph [ref=e1121]: A local-first Mac gateway that brings AI agents to Discord, the terminal, and HTTP.
            - generic [ref=e1122]:
              - generic [ref=e1123]: AI & agents
              - 'img "Color palette: #c2ced6, #1c323c, #decca0, #827159" [ref=e1124]':
                - generic "#c2ced6" [ref=e1125]
                - generic "#1c323c" [ref=e1126]
                - generic "#decca0" [ref=e1127]
                - generic "#827159" [ref=e1128]
          - 'link "View on GitHub: Deca" [ref=e1129] [cursor=pointer]':
            - /url: https://github.com/nocoo/deca
            - text: GitHub
        - article [ref=e1132]:
          - 'link "View logo: Runner" [ref=e1133] [cursor=pointer]':
            - /url: /logos/runner
            - generic [ref=e1139]:
              - heading "Runner" [level=3] [ref=e1140]
              - paragraph [ref=e1141]: Declare a schedule and let your Mac run your AI jobs through launchd.
            - generic [ref=e1142]:
              - generic [ref=e1143]: Developer tools
              - 'img "Color palette: #c2ceb4, #0e442f, #8b8d83, #ad874a, #dfd1ab" [ref=e1144]':
                - generic "#c2ceb4" [ref=e1145]
                - generic "#0e442f" [ref=e1146]
                - generic "#8b8d83" [ref=e1147]
                - generic "#ad874a" [ref=e1148]
                - generic "#dfd1ab" [ref=e1149]
          - 'link "View on GitHub: Runner" [ref=e1150] [cursor=pointer]':
            - /url: https://github.com/nocoo/runner
            - text: GitHub
        - article [ref=e1153]:
          - 'link "View logo: GeekHub" [ref=e1154] [cursor=pointer]':
            - /url: /logos/geekhub
            - generic [ref=e1160]:
              - heading "GeekHub" [level=3] [ref=e1161]
              - paragraph [ref=e1162]: A self-hosted RSS reader with AI summaries and translation.
            - generic [ref=e1163]:
              - generic [ref=e1164]: Everyday life
              - 'img "Color palette: #d0d3bb, #1e3a2c, #dacdb1, #b37d58" [ref=e1165]':
                - generic "#d0d3bb" [ref=e1166]
                - generic "#1e3a2c" [ref=e1167]
                - generic "#dacdb1" [ref=e1168]
                - generic "#b37d58" [ref=e1169]
          - 'link "View on GitHub: GeekHub" [ref=e1170] [cursor=pointer]':
            - /url: https://github.com/nocoo/geekhub
            - text: GitHub
        - article [ref=e1173]:
          - 'link "View logo: IPSafe" [ref=e1174] [cursor=pointer]':
            - /url: /logos/ipsafe
            - generic [ref=e1180]:
              - heading "IPSafe" [level=3] [ref=e1181]
              - paragraph [ref=e1182]: Check your network connection before letting a command run.
            - generic [ref=e1183]:
              - generic [ref=e1184]: Developer tools
              - 'img "Color palette: #bbd2c7, #315040, #424646, #dcd1ba, #64de0f" [ref=e1185]':
                - generic "#bbd2c7" [ref=e1186]
                - generic "#315040" [ref=e1187]
                - generic "#424646" [ref=e1188]
                - generic "#dcd1ba" [ref=e1189]
                - generic "#64de0f" [ref=e1190]
          - 'link "View on GitHub: IPSafe" [ref=e1191] [cursor=pointer]':
            - /url: https://github.com/nocoo/ipsafe
            - text: GitHub
  - contentinfo [ref=e1194]:
    - generic [ref=e1196]:
      - generic [ref=e1197]:
        - link "zheng li." [ref=e1198] [cursor=pointer]:
          - /url: https://lizheng.me/en/
          - text: zheng li
          - generic [ref=e1204]: .
        - paragraph [ref=e1205]:
          - text: © 2026 Zheng Li. All rights reserved. ·
          - generic [ref=e1206]: v0.5.0
          - text: ·
          - link "llms.txt" [ref=e1207] [cursor=pointer]:
            - /url: /llms.txt
      - navigation "Footer surfaces" [ref=e1208]:
        - link "Play" [ref=e1209] [cursor=pointer]:
          - /url: https://lizheng.me/en/
        - link "Journal" [ref=e1210] [cursor=pointer]:
          - /url: https://lizheng.blog/
        - link "Résumé" [ref=e1211] [cursor=pointer]:
          - /url: https://lizheng.dev/en/
        - link "Portfolio" [ref=e1212] [cursor=pointer]:
          - /url: /
    - generic [ref=e1214]:
      - generic [ref=e1215]: MADE IN BEIJING
      - link "Back to top" [ref=e1217] [cursor=pointer]:
        - /url: "#main-content"
        - text: Back to top
        - generic [aria-hidden] [ref=e1218]: ↑
  - status
```

# Test source

```ts
  167 | 	await page.getByRole("searchbox", { name: "Search projects" }).fill("pew");
  168 | 	await page
  169 | 		.locator('[data-project="pew"]')
  170 | 		.getByRole("link", { name: "View logo: Pew", exact: true })
  171 | 		.click({ position: { x: 8, y: 8 } });
  172 | 	await expect(page).toHaveURL(/\/logos\/pew$/);
  173 | 	await expect(page.locator("#identity-title")).toContainText("Pew");
  174 | 	await page.reload();
  175 | 	await expect(page.locator("#identity-title")).toContainText("Pew");
  176 | 	await page.goBack();
  177 | 	await expect(
  178 | 		page.getByRole("searchbox", { name: "Search projects" }),
  179 | 	).toHaveValue("pew");
  180 | 	await expect(page.locator(".project-card")).toHaveCount(2);
  181 | 	await page
  182 | 		.getByRole("navigation", { name: "Main navigation" })
  183 | 		.getByRole("button", { name: "Logo gallery" })
  184 | 		.click();
  185 | 	await expect(page.locator(".picker-item")).toHaveCount(active.length);
  186 | 	await page
  187 | 		.locator(".site-header")
  188 | 		.getByRole("link", { name: "hexly.ai", exact: true })
  189 | 		.click();
  190 | 	await expect(page.locator(".project-card")).toHaveCount(active.length);
  191 | });
  192 |
  193 | test("hides the header preference rule when the surface menu wraps", async ({
  194 | 	page,
  195 | }) => {
  196 | 	await page.goto("/");
  197 | 	const width = page.viewportSize()?.width ?? 0;
  198 | 	await expect(page.locator(".site-header .preferences")).toHaveCSS(
  199 | 		"border-left-width",
  200 | 		width <= 640 ? "0px" : "1px",
  201 | 	);
  202 | });
  203 |
  204 | test("keeps archived projects accessible through their category and direct logo paths", async ({
  205 | 	page,
  206 | }) => {
  207 | 	await page.goto("/");
  208 | 	await expect(page.locator('[data-project="uptime-kuma-skill"]')).toHaveCount(
  209 | 		0,
  210 | 	);
  211 | 	await page.getByRole("button", { name: /^Archived/ }).click();
  212 | 	await expect(page.locator(".project-card")).toHaveCount(archived.length);
  213 | 	await page
  214 | 		.locator('[data-project="uptime-kuma-skill"]')
  215 | 		.getByRole("link", { name: "View logo: Uptime Kuma Skill" })
  216 | 		.click();
  217 | 	await expect(page.locator("#identity-title")).toContainText(
  218 | 		"Uptime Kuma Skill",
  219 | 	);
  220 | 	await expect(page).toHaveURL(/\/logos\/uptime-kuma-skill\?category=archive$/);
  221 | 	await page.goto("/logos/uptime-kuma-skill");
  222 | 	await page.reload();
  223 | 	await expect(page.locator("#identity-title")).toContainText(
  224 | 		"Uptime Kuma Skill",
  225 | 	);
  226 | 	await expect(
  227 | 		page.getByRole("combobox", { name: "Project categories" }),
  228 | 	).toHaveValue("archive");
  229 | 	await expect(page.locator(".picker-item")).toHaveCount(archived.length);
  230 | 	await page
  231 | 		.getByRole("combobox", { name: "Project categories" })
  232 | 		.selectOption("all");
  233 | 	await expect(page.locator(".picker-item")).toHaveCount(active.length);
  234 | 	await expect(page.locator("#identity-title")).toContainText(
  235 | 		firstVisible?.title ?? "",
  236 | 	);
  237 | 	await page.goBack();
  238 | 	await expect(page.locator("#identity-title")).toContainText(
  239 | 		"Uptime Kuma Skill",
  240 | 	);
  241 | });
  242 |
  243 | test("keeps repository clicks separate and supports card links in another tab", async ({
  244 | 	page,
  245 | 	context,
  246 | }) => {
  247 | 	await context.route("https://github.com/nocoo/pew", (route) =>
  248 | 		route.fulfill({
  249 | 			contentType: "text/html",
  250 | 			body: "<title>Pew repository</title>",
  251 | 		}),
  252 | 	);
  253 | 	await page.goto("/");
  254 | 	const card = page.locator('[data-project="pew"]');
  255 | 	await card.scrollIntoViewIfNeeded();
  256 | 	const repositoryPage = page.waitForEvent("popup");
  257 | 	await card.getByRole("link", { name: "View on GitHub: Pew" }).click();
  258 | 	const repository = await repositoryPage;
  259 | 	await expect(repository).toHaveURL("https://github.com/nocoo/pew");
  260 | 	await expect(page).toHaveURL(/\/$/);
  261 | 	await repository.close();
  262 | 	const detailPage = context.waitForEvent("page");
  263 | 	await card
  264 | 		.getByRole("link", { name: "View logo: Pew" })
  265 | 		.click({ button: "middle" });
  266 | 	const detail = await detailPage;
> 267 | 	await detail.waitForURL(/\/logos\/pew\/?$/, {
      |               ^ TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
  268 | 		waitUntil: "domcontentloaded",
  269 | 		timeout: 15_000,
  270 | 	});
  271 | 	await expect(detail.locator("#identity-title")).toContainText("Pew");
  272 | 	await expect(page).toHaveURL(/\/$/);
  273 | 	await detail.close();
  274 | });
  275 |
  276 | test.describe("system preferences", () => {
  277 | 	test.use({ locale: "zh-CN", colorScheme: "dark" });
  278 | 	test("uses the browser language and theme for a new visitor", async ({
  279 | 		page,
  280 | 	}) => {
  281 | 		await page.goto("/");
  282 | 		await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  283 | 		await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  284 | 		await expect(
  285 | 			page.getByRole("button", { name: "主题：深色；切换为浅色" }),
  286 | 		).toBeVisible();
  287 | 	});
  288 | });
  289 |
```
