param (
    [Parameter(Position=0, Mandatory=$true)]
    [string]$Selector,

    [Parameter(Mandatory=$false)]
    [ValidateSet("Auto", "PipelineToCss", "CssToPipeline")]
    [string]$Mode = "Auto"
)

# ---------------------------------------------------------------------------
# Bidirectional Selector Converter
# ---------------------------------------------------------------------------

function Convert-PipelineToCss ([string]$pipeStr) {
    $parts = $pipeStr.Split('|').ForEach({ $_.Trim() })
    if ($parts.Count -lt 1) { return "" }

    $css = $parts[0]

    for ($i = 1; $i -lt $parts.Count; $i++) {
        $part = $parts[$i]
        $colonIdx = $part.IndexOf(':')
        
        $cmd = if ($colonIdx -gt -1) { $part.Substring(0, $colonIdx).Trim() } else { $part.Trim() }
        $val = if ($colonIdx -gt -1) { $part.Substring($colonIdx + 1).Trim() } else { "" }

        switch ($cmd) {
            "has" {
                $css = "${css}:has($val)"
            }
            "not-has" {
                $css = "${css}:not(:has($val))"
            }
            "find" {
                if ($val.StartsWith(">")) {
                    $css = "${css} ${val}"
                } else {
                    $css = "${css} ${val}"
                }
            }
            "up" {
                $steps = if ($val) { [int]$val } else { 1 }
                for ($j = 0; $j -lt $steps; $j++) {
                    $css = "*:has(> ${css})"
                }
            }
            "closest" {
                $css = "${val}:has(${css})"
            }
            default {
                Write-Warning "Unknown pipeline command: $cmd"
            }
        }
    }
    return $css
}

function Convert-CssToPipeline ([string]$cssStr) {
    $css = $cssStr.Trim()
    $script:commands = @()
    $script:baseSelector = ""

    # Helper function to recursively parse the CSS string
    function Parse-CssSegment ([string]$segment, [bool]$isFirst) {
        $segment = $segment.Trim()
        if ($segment -eq "") { return }

        # Match either :not(:has(...)) or :has(...) anywhere in the string
        # We look for the first occurrence of either pattern.
        # :not(:has(...)) pattern:
        $notHasRegex = ':not\(:has\(\s*(.*?)\s*\)\)'
        # :has(...) pattern:
        $hasRegex = ':has\(\s*(.*?)\s*\)'

        $firstIndex = -1
        $matchedPattern = "" # "has" or "nothas"
        $matchObj = $null

        if ($segment -match $notHasRegex) {
            $firstIndex = $segment.IndexOf($matches[0])
            $matchedPattern = "nothas"
            $matchObj = $matches
        }

        if ($segment -match $hasRegex) {
            $hasIndex = $segment.IndexOf($matches[0])
            if ($firstIndex -eq -1 -or $hasIndex -lt $firstIndex) {
                $firstIndex = $hasIndex
                $matchedPattern = "has"
                $matchObj = $matches
            }
        }

        if ($firstIndex -eq -1) {
            # No :has or :not(:has) found in this segment.
            # If it's the first segment, it's the base selector. Otherwise, it's a find target.
            if ($isFirst) {
                $script:baseSelector = $segment
            } else {
                $trimmedVal = $segment.Trim()
                # Clean up leading combinators like '> ' for the find command
                if ($trimmedVal -match '^>\s*(.*)$') {
                    $script:commands += "find:> $($matches[1].Trim())"
                } else {
                    $script:commands += "find:$trimmedVal"
                }
            }
            return
        }

        # We found a match. Split the segment into: Before, Match (Inside), and After
        $before = $segment.Substring(0, $firstIndex).Trim()
        $inside = $matchObj[1].Trim()
        
        # Calculate start index of the 'after' string
        $matchLength = $matchObj[0].Length
        $after = $segment.Substring($firstIndex + $matchLength).Trim()

        # 1. Process the 'before' part
        if ($before -ne "") {
            if ($isFirst) {
                $script:baseSelector = $before
                $isFirst = $false
            } else {
                if ($before -match '^>\s*(.*)$') {
                    $script:commands += "find:> $($matches[1].Trim())"
                } else {
                    $script:commands += "find:$before"
                }
            }
        }

        # 2. Process the 'inside' (the :has / :not(:has) filter)
        if ($matchedPattern -eq "nothas") {
            $script:commands += "not-has:$inside"
        } else {
            $script:commands += "has:$inside"
        }

        # 3. Recursively process the 'after' part
        if ($after -ne "") {
            Parse-CssSegment $after $false
        }
    }

    Parse-CssSegment $css $true

    if ($script:commands.Count -gt 0) {
        return "$script:baseSelector | " + ($script:commands -join ' | ')
    }
    return $script:baseSelector
}

# Determine conversion mode
$determinedMode = $Mode
if ($Mode -eq "Auto") {
    if ($Selector.Contains("|")) {
        $determinedMode = "PipelineToCss"
    } else {
        $determinedMode = "CssToPipeline"
    }
}

# Execute conversion
if ($determinedMode -eq "PipelineToCss") {
    $result = Convert-PipelineToCss $Selector
    Write-Output "CSS Output:"
    Write-Output $result
} else {
    $result = Convert-CssToPipeline $Selector
    Write-Output "Pipeline Output:"
    Write-Output $result
}
