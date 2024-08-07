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
