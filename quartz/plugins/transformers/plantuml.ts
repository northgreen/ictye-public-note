import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Root } from "mdast"
import { deflateRawSync } from "zlib"

interface Options {
  server?: string
  format?: "svg" | "png" | "txt"
  theme?: "default" | "dark" | "neutral" | "plain"
  classes?: string
}

const defaultOptions: Options = {
  server: "https://www.plantuml.com/plantuml",
  format: "svg",
  theme: "default",
  classes: "plantuml-diagram",
}

function encodePlantUML(plantumlText: string): string {
  // PlantUML encoding using deflate + custom Base64
  const deflated = deflateRawSync(Buffer.from(plantumlText))
  const base64Standard = deflated.toString("base64")

  // PlantUML custom Base64 mapping
  // 0-9: 48-57
  // A-Z: 65-90
  // a-z: 97-122
  // -: 45, _: 95
  const plantUmlAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"
  const standardAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

  let encoded = ""
  for (let i = 0; i < base64Standard.length; i++) {
    const char = base64Standard[i]
    if (char === "=") break // Skip padding

    const index = standardAlphabet.indexOf(char)
    if (index !== -1) {
      encoded += plantUmlAlphabet[index]
    } else {
      encoded += char // Keep any unexpected characters
    }
  }

  return encoded
}

export const PlantUML: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "PlantUML",
    markdownPlugins() {
      return [
        () => {
          return (tree: Root) => {
            visit(tree, "code", (node: any, index: number | undefined, parent: any) => {
              if (
                typeof index === "number" &&
                parent &&
                typeof parent === "object" &&
                "children" in parent &&
                Array.isArray(parent.children) &&
                node.lang === "plantuml"
              ) {
                const content = node.value
                if (content && typeof content === "string") {
                  const encoded = encodePlantUML(content)
                  const url = `${opts.server}/${opts.format}/${encoded}`

                  // Replace code node with HTML node containing PlantUML image
                  parent.children[index] = {
                    type: "html",
                    value: `<img class="${opts.classes}" src="${url}" alt="PlantUML Diagram" style="max-width: 100%; height: auto; border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);" />`,
                  }
                }
              }
            })
          }
        },
      ]
    },
    externalResources() {
      return {
        css: [
          {
            content: `.plantuml-diagram {
  display: block;
  margin: 1rem 0;
  text-align: center;
}`,
          },
        ],
      }
    },
  }
}
