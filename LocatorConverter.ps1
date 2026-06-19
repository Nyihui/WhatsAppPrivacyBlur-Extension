param (
    [Parameter(Mandatory=$true)]
    [string]$selector
)

# ---------------------------------------------------------------------------
# CSS -> Pipeline Converter
#
# Pipeline grammar (from evaluatePipeline in content.js):
#   triggerSelector | command:value | command:value | ...
#
# Supported commands: closest, up, find, has, not-has
#
# Conversion rules:
#   base:has(> child)                   -> base | has:> child
#   base:has(child)                     -> base | has:child
#   base:not(:has(> child))             -> base | not-has:> child
#   base:not(:has(child))               -> base | not-has:child
#   Multiple :has / :not(:has) chains   -> multiple pipe commands
# ---------------------------------------------------------------------------

$css = $selector.Trim()
$baseSelector = ''
$pipeCommands = @()

# Repeatedly strip :not(:has(...)) and :has(...) from the END of the selector.
# We process from the outside-in, right-to-left, to handle chained pseudo-classes.

while ($true) {
    # Try :not(:has(> ...)) with direct child combinator
    if ($css -match '^(.*):not\(:has\(\s*>\s*(.*?)\s*\)\)$') {
        $css = $matches[1].Trim()
        $pipeCommands = @("not-has:> $($matches[2].Trim())") + $pipeCommands
        continue
    }
    # Try :not(:has(...)) without direct child combinator
    if ($css -match '^(.*):not\(:has\(\s*(.*?)\s*\)\)$') {
        $css = $matches[1].Trim()
        $pipeCommands = @("not-has:$($matches[2].Trim())") + $pipeCommands
        continue
    }
    # Try :has(> ...) with direct child combinator
    if ($css -match '^(.*):has\(\s*>\s*(.*?)\s*\)$') {
        $css = $matches[1].Trim()
        $pipeCommands = @("has:> $($matches[2].Trim())") + $pipeCommands
        continue
    }
    # Try :has(...) without direct child combinator
    if ($css -match '^(.*):has\(\s*(.*?)\s*\)$') {
        $css = $matches[1].Trim()
        $pipeCommands = @("has:$($matches[2].Trim())") + $pipeCommands
        continue
    }
    break
}

$baseSelector = $css

if ($pipeCommands.Count -gt 0) {
    $pipeline = ($pipeCommands -join ' | ')
    Write-Host "$baseSelector | $pipeline"
} else {
    Write-Host "$baseSelector"
}
