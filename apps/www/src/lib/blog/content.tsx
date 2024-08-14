// import { Logo } from "#/ui/icons";
import { allHelpPosts } from "content-collections"
import {
  Airplay,
  BarChart,
  Building,
  Globe,
  Import,
  Link2,
  Lock,
  QrCode,
  Settings,
  TrendingUp,
  Users,
  Webhook,
} from "lucide-react"

export const BLOG_CATEGORIES: {
  title: string
  slug: "company" | "education"
  description: string
}[] = [
  {
    title: "Selskapsnyheter",
    slug: "company",
    description: "Oppdateringer og kunngjøringer fra Propdock",
  },
  // {
  //   title: "Education",
  //   slug: "education",
  //   description: "Educational content about link management.",
  // },
  // {
]

export const POPULAR_ARTICLES = ["introduserer-propdock"]

export const HELP_CATEGORIES: {
  title: string
  slug: "oversikt" | "starter" | "eiendomsforvaltning" | "api"
  description: string
  icon: JSX.Element
}[] = [
  {
    title: "Propdock Oversikt",
    slug: "oversikt",
    description:
      "Lær om Propdock og hvordan det kan hjelpe deg med eiendomsforvaltning.",
    icon: <Settings className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Kom i Gang",
    slug: "starter",
    description: "Lær hvordan du kommer i gang med Propdock.",
    icon: <Settings className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Eiendomsforvaltning",
    slug: "eiendomsforvaltning",
    description: "Lær hvordan du administrerer dine eiendommer på Propdock.",
    icon: <Building className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "API",
    slug: "api",
    description: "Lær hvordan du bruker Propdock API.",
    icon: <Webhook className="h-6 w-6 text-gray-500" />,
  },
]

export const getPopularArticles = () => {
  const popularArticles = POPULAR_ARTICLES.map((slug) => {
    const post = allHelpPosts.find((post) => post.slug === slug)
    if (!post) {
      console.warn(`Popular article with slug "${slug}" not found`)
    }
    return post
  }).filter((post) => post != null)

  return popularArticles
}

export const FEATURES_LIST = [
  {
    title: "Kraftig leietakeradministrasjon for moderne eiendomsforvaltere",
    shortTitle: "Leietakeradministrasjon",
    accordionTitle: "Administrasjon som betyr noe",
    description:
      "Propdock gir kraftige verktøy for leietakeradministrasjon, inkludert kontraktstyring, fakturering, og kommunikasjon.",
    icon: Users,
    slug: "leietakeradministrasjon",
    thumbnail:
      "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/de9cf569-f767-4d0c-7b3e-21605769be00/public",
    thumbnailBlurhash:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAdCAYAAADoxT9SAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE+0lEQVR4nL2Y63qiShBF5/2f8czkpjGCgoLQV+yzq6saGpVMYjznx/ok0JBa7GrQ/mWsC7fQhLE3MEEJl8eMteP51hH+L8g4e81SXUv8WhS5KFJpwlyhdSZicpGpYCf8VSgT+09EliQYPs5j3ZVIknA+41O5+9K5S6RXE0lEJZEok6Xhhwx/zaLU99L5lkguMJGOuyiiMxHnWMB/wi2py3TMF5L5skifiXQzbJTpIZJkpkQykWGBeHxJRtpLtn8s0pNILtGbcIrYSEcoJzIe53hcY2CRJCOFDxfM0xlGmVtz50EiNt79Too/dUxLn72LRBnlRWaYZPwZEsxwwf8iYpKItE+SaEWgOREu0naEx3EPoQEyQyZDBU8yudRcYrieJ9bHVr17sjOTCKWRJBpwhMShJdzIsfXY73GchIYo1Eehc5QhHOEzpP1szlh8zo9FXBQZJSBwhEDd2FAdbdgfXNhl7I8e+32o2wFSA6SGKNXrc0QRhtH2HFOb468Rkfw99U0RPpl6n+YAtc8RbVQ3VDAKr10oKhe2xF6oPPb5UNYeYgOkBqTFQi3RE2dc74zrnmNqiT4m6EdorqlR5oEiNBeohaqG7z5JfKD4zc6F91LYefztsd9HKRLaQ4YSOkhKKak2kzsJnfIjc5kHiVAaSYTSKGuWoOLXhQurrQtvwqrwYV36KEVClBClQ0KUUNVcivkoRnMrPTBOSUY5kZEX7iNExraSNCgJkqDiXz9ceNlM0N9vWwgVnFBquaJObedZiuZTQ3PKQ2x6WLCQm95PhnmoCLXVVtJYicTzuwtPxFrA9rMI0RgaG1vuou121HoHzw+JJskg/Y7/J8lwKm5M5X6RNNHH+WEhYlGcxV23SMCicBv+rG34vWJom/Y9gyhTcHrrMknxQ4KSpTblJx7fqPgoP00ieSp3iWiJs5NHL4nQY/emCAr/IxL/yOfvNQs9b0iGxxKrwkLIRpmPPQslmUpkUiozEf0TEW0zEXslskJhrxuDO29QtIFAxpr3PeHYy4eJMq+ZzPuOZPhaRWVDeZEKPVwelAh/841vdXkZHhp6CRr8Y4N+N+G9MCgMhYrMkxSfBIjnDUmALfOGc9alYZG9iNR8g/afJXKXSP4VPooYiBikYkJ9NJikkNlPMqstF5uEqHjiZaORhoasUGikwSIbnPuBa2xxU0oRqXCj6ofOkZkIf3VvSQYih0YjFR3KSk8yKGxNRVKxeeHCqmDWJbPZ6VGiwE3hNLh16Tscpc8i9gdPrdmPKjOKUCrtSSMVjVRYZldDBkLbPQpDcRsU+V5OBSfedxMbGkvngDJKGEiYmAZJHE/p54Edf7j9UMRkIjp0nQ4niDQQOSKVA2TqwyQUExKpSBKMRauRgsaCHZ2La1SQqBskjbRJohGJUWS2LpCWnr4gkiR0WnBQOvQkEmUUZBRkmCjUcEKVSEUxoYyoGbujYgE6j6B2pfl3MlMSszQmrtfSFkTGQeOqiRYRFSGRJEO0klBMqWWpQyqw4WKrRuGuK/4UahpL55yYhtpWfj4vSdwSSSyIpDRYQilIKCUy/UyIkbYDbSdyHcOFqjkYk463PUNrAGlBo8/baXEN7SsicQVRi4jK6IPqM2bHcmk90gknyEdwvItgP67fC2Oxhlcvk4ReWBi8KXJl+ImIvkSrYCI6bjPYNowai1UZ2G8meKy5zeIK51zoX56UB7vUOlYfAAAAAElFTkSuQmCC",
    videoUrl:
      "https://www.youtube.com/embed/i05FamHTn_I?si=gRnWs5Kf2n6Qyqmd&autoplay=1",
    videoLength: "2:56",
    bentoTitle: "Detaljert innsikt for hver leietaker",
    bentoDescription:
      "Propdock gir detaljert innsikt for hver leietaker i din portefølje. Se betalingshistorikk, kontraktdetaljer og kommunikasjonslogg på ett sted.",
    bentoFeatures: [
      {
        title: "Dashboard for leietakere",
        description:
          "Få en helhetlig oversikt over alle dine leietakere med et brukervennlig dashboard som viser nøkkelinformasjon og viktige varsler.",
        image:
          "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/69efda6d-922a-40a0-497d-32d12863cf00/public",
      },
      {
        title: "Fakturering og betalinger",
        description:
          "Automatiser fakturering og spor betalinger for å sikre stabil kontantstrøm.",
        image:
          "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/3f0f3069-737f-4b77-5b8c-7c527f6fc800/public",
      },
      {
        title: "Kommunikasjonslogg",
        description:
          "Hold oversikt over all kommunikasjon med leietakere for bedre service og oppfølging.",
      },
      {
        title: "Eiendomsverdsettelser",
        description:
          "Få oppdaterte verdsettelser av dine eiendommer basert på markedsdata og inntektsstrømmer for å optimalisere porteføljen din.",
      },
      {
        title: "Dokumenthåndtering",
        description:
          "Lagre og organiser alle relevante dokumenter knyttet til hver leietaker sikkert og tilgjengelig.",
      },
    ],
  },
  {
    title: "Avansert verdsettelse av næringseiendom",
    shortTitle: "Eiendomsverdsettelse",
    accordionTitle: "Presis verdsettelse for bedre beslutninger",
    description:
      "Propdock tilbyr avanserte verktøy for verdsettelse av næringseiendom, inkludert DCF-modeller, sensitivitetsanalyse og vurdering av latent skatt.",
    icon: TrendingUp,
    slug: "verdsettelse",
    thumbnail:
      "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/de9cf569-f767-4d0c-7b3e-21605769be00/public",
    thumbnailBlurhash:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAdCAYAAADoxT9SAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE+0lEQVR4nL2Y63qiShBF5/2f8czkpjGCgoLQV+yzq6saGpVMYjznx/ok0JBa7GrQ/mWsC7fQhLE3MEEJl8eMteP51hH+L8g4e81SXUv8WhS5KFJpwlyhdSZicpGpYCf8VSgT+09EliQYPs5j3ZVIknA+41O5+9K5S6RXE0lEJZEok6Xhhwx/zaLU99L5lkguMJGOuyiiMxHnWMB/wi2py3TMF5L5skifiXQzbJTpIZJkpkQykWGBeHxJRtpLtn8s0pNILtGbcIrYSEcoJzIe53hcY2CRJCOFDxfM0xlGmVtz50EiNt79Too/dUxLn72LRBnlRWaYZPwZEsxwwf8iYpKItE+SaEWgOREu0naEx3EPoQEyQyZDBU8yudRcYrieJ9bHVr17sjOTCKWRJBpwhMShJdzIsfXY73GchIYo1Eehc5QhHOEzpP1szlh8zo9FXBQZJSBwhEDd2FAdbdgfXNhl7I8e+32o2wFSA6SGKNXrc0QRhtH2HFOb468Rkfw99U0RPpl6n+YAtc8RbVQ3VDAKr10oKhe2xF6oPPb5UNYeYgOkBqTFQi3RE2dc74zrnmNqiT4m6EdorqlR5oEiNBeohaqG7z5JfKD4zc6F91LYefztsd9HKRLaQ4YSOkhKKak2kzsJnfIjc5kHiVAaSYTSKGuWoOLXhQurrQtvwqrwYV36KEVClBClQ0KUUNVcivkoRnMrPTBOSUY5kZEX7iNExraSNCgJkqDiXz9ceNlM0N9vWwgVnFBquaJObedZiuZTQ3PKQ2x6WLCQm95PhnmoCLXVVtJYicTzuwtPxFrA9rMI0RgaG1vuou121HoHzw+JJskg/Y7/J8lwKm5M5X6RNNHH+WEhYlGcxV23SMCicBv+rG34vWJom/Y9gyhTcHrrMknxQ4KSpTblJx7fqPgoP00ieSp3iWiJs5NHL4nQY/emCAr/IxL/yOfvNQs9b0iGxxKrwkLIRpmPPQslmUpkUiozEf0TEW0zEXslskJhrxuDO29QtIFAxpr3PeHYy4eJMq+ZzPuOZPhaRWVDeZEKPVwelAh/841vdXkZHhp6CRr8Y4N+N+G9MCgMhYrMkxSfBIjnDUmALfOGc9alYZG9iNR8g/afJXKXSP4VPooYiBikYkJ9NJikkNlPMqstF5uEqHjiZaORhoasUGikwSIbnPuBa2xxU0oRqXCj6ofOkZkIf3VvSQYih0YjFR3KSk8yKGxNRVKxeeHCqmDWJbPZ6VGiwE3hNLh16Tscpc8i9gdPrdmPKjOKUCrtSSMVjVRYZldDBkLbPQpDcRsU+V5OBSfedxMbGkvngDJKGEiYmAZJHE/p54Edf7j9UMRkIjp0nQ4niDQQOSKVA2TqwyQUExKpSBKMRauRgsaCHZ2La1SQqBskjbRJohGJUWS2LpCWnr4gkiR0WnBQOvQkEmUUZBRkmCjUcEKVSEUxoYyoGbujYgE6j6B2pfl3MlMSszQmrtfSFkTGQeOqiRYRFSGRJEO0klBMqWWpQyqw4WKrRuGuK/4UahpL55yYhtpWfj4vSdwSSSyIpDRYQilIKCUy/UyIkbYDbSdyHcOFqjkYk463PUNrAGlBo8/baXEN7SsicQVRi4jK6IPqM2bHcmk90gknyEdwvItgP67fC2Oxhlcvk4ReWBi8KXJl+ImIvkSrYCI6bjPYNowai1UZ2G8meKy5zeIK51zoX56UB7vUOlYfAAAAAElFTkSuQmCC",
    videoUrl:
      "https://www.youtube.com/embed/i05FamHTn_I?si=gRnWs5Kf2n6Qyqmd&autoplay=1",
    videoLength: "3:15",
    bentoTitle: "Presis verdsettelse for næringseiendom",
    bentoDescription:
      "Propdock gir deg avanserte verktøy for å verdsette næringseiendommer nøyaktig, inkludert DCF-modeller, sensitivitetsanalyse og vurdering av latent skatt.",
    bentoFeatures: [
      {
        title: "DCF-modeller",
        description:
          "Utfør detaljerte diskonterte kontantstrømanalyser for å beregne nåverdien av fremtidige kontantstrømmer fra eiendommen.",
        image:
          "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/1d4770d0-7585-4a4d-27a2-3ad7ec452800/public",
      },
      {
        title: "Sensitivitetsanalyse",
        description:
          "Vurder hvordan endringer i nøkkelvariabler som leieinntekter, driftskostnader og avkastningskrav påvirker eiendomsverdien.",
        image:
          "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/3f0f3069-737f-4b77-5b8c-7c527f6fc800/public",
      },
      {
        title: "Latent skatt",
        description:
          "Inkluder beregninger av latent skatt i verdsettelsen for å gi et mer nøyaktig bilde av eiendomsverdien.",
      },
      {
        title: "Markedssammenligninger",
        description:
          "Sammenlign eiendommen med lignende objekter i markedet for å validere verdsettelsen og identifisere potensielle muligheter.",
      },
      {
        title: "Scenarioanalyse",
        description:
          "Utforsk ulike fremtidsscenarier for eiendommen, inkludert potensielle utviklingsmuligheter og markedsendringer.",
      },
    ],
  },
  {
    title: "Gratis QR-kodegenerator",
    shortTitle: "QR-koder",
    accordionTitle: "Gratis QR-kodegenerator",
    description:
      "QR-koder og korte lenker går hånd i hånd. Propdock tilbyr gratis QR-koder for hver korte lenke du oppretter.",
    icon: QrCode,
    slug: "qr-koder",
    thumbnail:
      "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/qr-koder-thumbnail/public",
    thumbnailBlurhash:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAdCAYAAADoxT9SAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFvklEQVR4nL2Y23qaUBCF+/7v1CZpG1uTeD4jooIgCHISMb2arhnEIzbaNrmYD90aMv9ea2Y2flqnr5SsN9dFuqH1SeRrb/1t9v1XiZRjw/GL0tdftDkJWZd4PYv8Hqfx6X+AHH5nlXCk29jsIkkOoNZboC1MMUgBxJsg6eGubZMr2uU3QCTpVUrxhdhByfe3SSC5zeYyyKXEC0EOLXJppw9B1yd24uQ40ShGRCmFHOGagjBFZFde48/jmGFzoFyZ/waSx7kqR0kXAmwkQU7YD9a09BHLhLyDWC7xGdYDfJ4BZX9XBHKtla4GubT7pwpkAFnCrruixWJFjhOTvQu8x5rrJgLIsGGYweSqpFuY09r47yB7m2VFHK94Z3MAJO/GNLcjsuYhmWZIxizYRkgzvDetiGw7Fkgvh4nSE1VuK+43QHKYY7BDiEggsLs+EnM5wQDJ+6TrHk0mHmljl0YaYuSSpnk0Hi9pOvVpBqj5PBIYthrXjYAkm0KQWyAugJxHZqdcCSTiIyE3gAJLMgwXyTo0VOc0GFjU61vU7ZkIfo01xSFVXQByCZhAlHG9TJXcXoUgN0DcAMJq8D9GAiEngt21GWIBCJuUISduULutU7OpU6ORXVutGXW7FgBtUUjXfcDzJqy2IOnHgxyq4SxgFRNKTOZQgiE48QnVahpVKhq9vPB1jPdTrBsCMxw6ogrXENuLuxiDXLTW+4EkFEQxipXV8Eg3bFJHJuzDyXLiKj09KfSzjPipULk8pOdnjWrVCZQxRJXx2BN7OYtYQHimJElxsb8LyIpBYKsgjGArtgerAcsoOrU7vPNDQAzox48ePT5mUSoNAKOKQk1YrY960dAEGGTBILDWn7rWu4FIfQTsbxSt6aA7zaDGhBpNFVbqA6JD37616OGhSQ/3Lfr6tS1AZShUrWrU6Rgoeht1skTBh+hcK9xzvTuy5DC3dqvbQJI9iLNAkZtsK/a+RvW6AjW69P07AB7qdHdXoy9fanR/1wBMi36UevTyrEgNKQMTdbKgueWT50XSxnmwsnWPZ9dHgcwykE53RLU6W6gDkAbd3zNEhT5/rtAdYL5CnVKpA5CB1NFgMAOIQ5a1lM4XhitpInz/87PcO1vLEWuhnWpQpAdFGgN6eu7ARqwAlLhniAquVVitAcu1qQLrtQCiDAyA2FDEKwD5N1Wu71rbYpcasbIa6fdRyC0FBd1Fp2pClTpgqrAYIADFcOVym6qVPmbMiBQ0hyladgYS4H6x3JdnlICsPwKE268MQ+5amNRTE4lNUMQq6qSPVtsGTIMeS3UA1aj0WBe4Z6hVr/XxvRFmCUCmFkBcHCJ9nIYjKJ2pkpyp8i4gm+1A5DkSYI5gShtz1IkuqrSgSq2Gon5pU/mpKUDlclPgqtUu6mNAPdhQVXV0LYBgI3hD9iB7VZL3BsmOKDzZQyl4E/ZiVVR1CpgRrKPgaNIDUAdWY4A2XjMEq6Gg0DXMER3HGotsAVkCJJTN+WCQA3tBFdtxpXtNpjMoM5VEu70hgAZQqC/Br7tdBaAqgCcodAMDESB2BuJvQaL4HOTWoXg1yNF5SwajLxbjDjbVTdntIZIdKJoknoeijAAxRnNAfegznLXmePByL4Lkavzjo+6l2OxUiaR7ZRZjGFbGgs2M2RyFbOI8ZaA1T3ehjaeihA4IVmM+d3BE8VBrfqG1TkGuBboS5FVa475Wkp0yHtoot2Qb6lhIkhXiOtA5oBRfDQCwEvx5rsbSD6Sd74t9PxT/5mnxepCDWtk/KfJzRSzquDmQ48FyC0maleIrq8BrDLFwMzX2ttqDrNMPBDl8WsyV4QbAzyl8xOf5wEAO7MNQfOVgAFYihzhW48+2usZefwVyCYaPMKwOzxoXCfOsyIMB2E45hNTGH211/mvj+jBOQa7+uXR9+pMQQLYwfMyIomMgTpihOHwOBsB6DlE0CI8T/3UhihX6DZrKi05GV59sAAAAAElFTkSuQmCC",
    videoUrl:
      "https://www.youtube.com/embed/fcWkUZoJJ7w?si=LKNOO67aL6Q-3xN4&autoplay=1",
    videoLength: "1:07",
    bentoTitle: "Gorgeous QR codes for your links",
    bentoDescription:
      "Create beautiful flyers and posters with QR codes for your links.",
  },
]
