param (
    [Parameter(Mandatory=$true)]
    [string]$selector
)

$css = $selector

if ($css -match '^(.*?)\s*:has\(\s*>\s*(.*?)\s*\)(.*)$') {
    $ancestor = $matches[1].Trim()
    $trigger = $matches[2].Trim()
    $r = $matches[3].Trim()
    
    $r = [regex]::Replace($r, ':not\(:has\(\s*>\s*(.*?)\)\)', ' | not-has:> $1')
    $r = [regex]::Replace($r, ':not\(:has\(\s*(.*?)\)\)', ' | not-has:$1')
    $r = [regex]::Replace($r, ':has\(\s*>\s*(.*?)\)', ' | has:> $1')
    $r = [regex]::Replace($r, ':has\(\s*(.*?)\)', ' | has:$1')
    $r = $r.Trim()
    if ($r) { $r = " $r" }

    Write-Host "$ancestor | has:> $trigger$r"
} elseif ($css -match '^(.*?)\s*:has\(\s*(.*?)\s*\)(.*)$') {
    $ancestor = $matches[1].Trim()
    $trigger = $matches[2].Trim()
    $r = $matches[3].Trim()
    
    $r = [regex]::Replace($r, ':not\(:has\(\s*>\s*(.*?)\)\)', ' | not-has:> $1')
    $r = [regex]::Replace($r, ':not\(:has\(\s*(.*?)\)\)', ' | not-has:$1')
    $r = [regex]::Replace($r, ':has\(\s*>\s*(.*?)\)', ' | has:> $1')
    $r = [regex]::Replace($r, ':has\(\s*(.*?)\)', ' | has:$1')
    $r = $r.Trim()
    if ($r) { $r = " $r" }

    Write-Host "$ancestor | has:$trigger$r"
} else {
    Write-Host "$css"
}
