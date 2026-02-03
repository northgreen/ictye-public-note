import { QuartzTransformerPlugin } from "../types"

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
  // PlantUML encoding according to official documentation
  const encoded = Buffer.from(plantumlText).toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
  return encoded
}

async function renderPlantUML(content: string, options: Options): Promise<string> {
  const url = `${options.server}/${options.format}/${encodePlantUML(content)}`
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const result = await response.text()
    
    if (options.format === "svg") {
      // Wrap SVG in div with classes
      return `<div class="${options.classes}">${result}</div>`
    } else if (options.format === "png") {
      return `<img class="${options.classes}" src="${url}" alt="PlantUML Diagram" />`
    } else {
      return `<pre class="${options.classes}"><code>${result}</code></pre>`
    }
  } catch (error) {
    console.error("Failed to render PlantUML:", error)
    return `<div class="${options.classes} error">Failed to render PlantUML diagram. Check the syntax and try again.</div>`
  }
}

export const PlantUML: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "PlantUML",
    htmlPlugins() {
      return [
        async function (tree) {
          const { visit } = await import("unist-util-visit")
          
          visit(tree, "element", (node, index, parent) => {
            if (
              node.tagName === "code" &&
              node.properties?.className &&
              Array.isArray(node.properties.className) &&
              node.properties.className.includes("language-plantuml")
            ) {
              const plantumlContent = node.children?.[0]?.value
              if (plantumlContent) {
                // Replace code block with rendered PlantUML
                const rendered = renderPlantUML(plantumlContent, opts)
                parent.children[index] = {
                  type: "raw",
                  value: rendered,
                }
              }
            }
          })
        },
      ]
    },
    externalResources() {
      if (opts.format === "svg") {
        return {
          css: [{
            content: `.plantuml-diagram {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.plantuml-diagram.error {
  color: #e11d48;
  border: 1px solid #e11d48;
  padding: 1rem;
  border-radius: 0.375rem;
  background-color: #fef2f2;
}`
          }]
        }
      }
    },
  }
}