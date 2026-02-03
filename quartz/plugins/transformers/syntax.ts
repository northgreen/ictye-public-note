import { QuartzTransformerPlugin } from "../types"
import rehypePrettyCode, { Options as CodeOptions, Theme as CodeTheme } from "rehype-pretty-code"

interface Theme extends Record<string, CodeTheme> {
  light: CodeTheme
  dark: CodeTheme
}

interface Options {
  theme?: Theme
  keepBackground?: boolean
}

const defaultOptions: Options = {
  theme: {
    light: "catppuccin-latte",
    dark: "catppuccin-frappe",
  },
  keepBackground: false,
}

export const SyntaxHighlighting: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts: CodeOptions = { ...defaultOptions, ...userOpts }

  return {
    name: "SyntaxHighlighting",
    htmlPlugins() {
      return [[rehypePrettyCode, opts]]
    },
  }
}
