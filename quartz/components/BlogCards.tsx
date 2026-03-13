import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import { Date, getDate } from "./Date"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"
import style from "./styles/blogCards.scss"

interface Options {
  title?: string
  limit: number
  filter: (f: QuartzPluginData) => boolean
}

const defaultOptions: Options = {
  limit: 6,
  filter: (f) => f.slug !== "index",
}

export default ((userOpts?: Partial<Options>) => {
  const BlogCards: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions, ...userOpts }
    const sortFn = byDateAndAlphabetical(cfg)
    const pages = allFiles.filter(opts.filter).sort(sortFn).slice(0, opts.limit)

    return (
      <div class={classNames(displayClass, "blog-cards")}>
        <h3>{opts.title ?? "最近更新"}</h3>
        <div class="cards-grid">
          {pages.map((page) => {
            const title = page.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
            const description = page.frontmatter?.description ?? ""
            const tags = page.frontmatter?.tags ?? []

            return (
              <a href={resolveRelative(fileData.slug!, page.slug!)} class="card">
                <div class="card-content">
                  <h4>{title}</h4>
                  {description && <p class="description">{description}</p>}
                  <div class="card-footer">
                    {page.dates && (
                      <span class="date">
                        <Date date={getDate(cfg, page)!} locale={cfg.locale} />
                      </span>
                    )}
                    {tags.length > 0 && (
                      <div class="tags">
                        {tags.slice(0, 3).map((tag) => (
                          <span class="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    )
  }

  BlogCards.css = style
  return BlogCards
}) satisfies QuartzComponentConstructor
