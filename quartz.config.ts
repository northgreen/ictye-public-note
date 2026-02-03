import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
    configuration: {
        pageTitle: "Ictye Public Documents",
        pageTitleSuffix: "",
        enableSPA: true,
        enablePopovers: true,
        analytics: {
            provider: "plausible",
        },
        locale: "zh-CN",
        baseUrl: "northgreen.github.io/ictye-public-note",
        ignorePatterns: ["private", "templates", ".obsidian"],
        defaultDateType: "modified",
        theme: {
            fontOrigin: "googleFonts",
            cdnCaching: true,
            typography: {
                header: "Schibsted Grotesk",
                body: "Source Sans Pro",
                code: "IBM Plex Mono",
            },
            colors: {
                lightMode: {
                    light: "#eff1f5",
                    lightgray: "#e5e5e5",
                    gray: "#b8b8b8",
                    darkgray: "#8c8fa1",
                    dark: "#4c4f69",
                    secondary: "#8839ef",
                    tertiary: "#d20f39",
                    highlight: "rgba(143, 159, 169, 0.15)",
                    textHighlight: "#df8e1d",
                },
                darkMode: {
                    light: "#303446",
                    lightgray: "#414559",
                    gray: "#838ba7",
                    darkgray: "#b5bfe2",
                    dark: "#c6d0f5",
                    secondary: "#ca9ee6",
                    tertiary: "#e5c890",
                    highlight: "rgba(143, 159, 169, 0.15)",
                    textHighlight: "#ea999c88",
                },
            },
        },
    },
    plugins: {
        transformers: [
            Plugin.FrontMatter(),
            Plugin.CreatedModifiedDate({
                priority: ["frontmatter", "git", "filesystem"],
            }),
            Plugin.SyntaxHighlighting({
                theme: {
                    light: "github-light",
                    dark: "github-dark",
                },
                keepBackground: false,
            }),
            Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
            Plugin.GitHubFlavoredMarkdown(),
            Plugin.TableOfContents(),
            Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
            Plugin.Description(),
            Plugin.Latex({ renderEngine: "katex" }),
            Plugin.PlantUML({
                server: "https://www.plantuml.com/plantuml",
                format: "svg",
                theme: "default",
                classes: "plantuml-diagram"
            }),
        ],
        filters: [Plugin.RemoveDrafts()],
        emitters: [
            Plugin.AliasRedirects(),
            Plugin.ComponentResources(),
            Plugin.ContentPage(),
            Plugin.FolderPage(),
            Plugin.TagPage(),
            Plugin.ContentIndex({
                enableSiteMap: true,
                enableRSS: true,
            }),
            Plugin.Assets(),
            Plugin.Static(),
            Plugin.Favicon(),
            Plugin.NotFoundPage(),
            // Comment out CustomOgImages to speed up build time
            Plugin.CustomOgImages(),
        ],
    },
}

export default config
