$base = "http://localhost:5175/api/chat"
function Call-Chat($message, $history) {
  $body = @{ message = $message; history = $history } | ConvertTo-Json -Depth 10
  try {
    $resp = Invoke-RestMethod -Uri $base -Method Post -ContentType "application/json" -Body $body
    return $resp
  } catch {
    Write-Output "ERROR::$($_.Exception.Message)"
    return $null
  }
}

$tests = @()
$history = @()

$r1 = Call-Chat "cpu potente" $history
if ($r1) { $history += @{ role="user"; text="cpu potente" }; $history += @{ role="assistant"; text=$r1.reply } }
$tests += [pscustomobject]@{ test="1_cpu_potente"; reply=($r1.reply); recs=(if($r1.recommendations){$r1.recommendations.Count}else{0}) }

$r2 = Call-Chat "dame memorias ram para acompanar esos ryzen" $history
if ($r2) { $history += @{ role="user"; text="dame memorias ram para acompanar esos ryzen" }; $history += @{ role="assistant"; text=$r2.reply } }
$tests += [pscustomobject]@{ test="2_ram_compatible"; reply=($r2.reply); recs=(if($r2.recommendations){$r2.recommendations.Count}else{0}) }

$r3 = Call-Chat "me dijeron que mi codigo de reparacion es GF-EMAX, como va?" $history
if ($r3) { $history += @{ role="user"; text="me dijeron que mi codigo de reparacion es GF-EMAX, como va?" }; $history += @{ role="assistant"; text=$r3.reply } }
$tests += [pscustomobject]@{ test="3_reparacion"; reply=($r3.reply); recs=(if($r3.recommendations){$r3.recommendations.Count}else{0}) }

$r4 = Call-Chat "y fresas con crema?" $history
if ($r4) { $history += @{ role="user"; text="y fresas con crema?" }; $history += @{ role="assistant"; text=$r4.reply } }
$tests += [pscustomobject]@{ test="4_easter_egg"; reply=($r4.reply); recs=(if($r4.recommendations){$r4.recommendations.Count}else{0}) }

$r5 = Call-Chat "cual recomiendas calidad precio para oficina con 500?" $history
$tests += [pscustomobject]@{ test="5_contexto_presupuesto"; reply=($r5.reply); recs=(if($r5.recommendations){$r5.recommendations.Count}else{0}) }

$tests | ConvertTo-Json -Depth 6
