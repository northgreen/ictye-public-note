应该涉及到以下函数：

| 旧 API (失效或已变更)                              | 新的替代方案                                      | 关键变更说明                                                       |
| :------------------------------------------ | :------------------------------------------ | :----------------------------------------------------------- |
| `node:range()` (节点方法)                       | `vim.treesitter.get_range(node, bufnr)`     | **这是你遇到的核心问题**。`node:range()` 方法已被弃用，需改用新函数。                 |
| `vim.treesitter.get_node_text(node, bufnr)` | `vim.treesitter.get_node_text(node, bufnr)` | 函数签名和使用方式保持不变，但其内部的 `get_range` 实现已被更新。                      |
| `get_node_range` (私有函数)                     | `vim.treesitter.get_range()`                | 私有函数 `get_node_range` 已被移除，应使用新函数[reference:3][reference:4]。 |

暂时插件适配不是很好的时候可以使用以下猴子补丁修复（在init插件管理器之前加载）

``` lua
local function patch_treesitter_range()
    local original_get_node_text = vim.treesitter.get_node_text
    vim.treesitter.get_node_text = function(node, buf, opts)
        local ok, result = pcall(original_get_node_text, node, buf, opts)
        if not ok then
            return ""
        end
        return result
    end
    
    -- Patch nvim-treesitter query predicates if available
    local ok, predicates = pcall(require, 'nvim-treesitter.query_predicates')
    if ok and type(predicates) == "table" and predicates.handler then
        local original_handler = predicates.handler
        predicates.handler = function(...)
            local success, result = pcall(original_handler, ...)
            if not success then
                return false
            end
            return result
        end
    end
end
vim.defer_fn(patch_treesitter_range, 100)

```