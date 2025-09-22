# PowerShell script to create demo audio files
# Using Windows Text-to-Speech

$audioDir = "./public/audio"

# Create directory if it doesn't exist
if (!(Test-Path $audioDir)) {
    New-Item -ItemType Directory -Force -Path $audioDir
}

# Load System.Speech assembly
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

# Set voice rate (speed)
$synth.Rate = 0

# List of painting descriptions in English (for better TTS compatibility)
$descriptions = @{
    "abstract-art-1" = "A vibrant abstract composition exploring the interplay of colors and forms, representing the chaos and beauty of modern life."
    "portrait-1" = "An intimate portrait capturing the essence of human emotion through masterful brushwork and subtle lighting."
    "landscape-1" = "A serene landscape painting depicting the tranquil beauty of nature with rolling hills and golden sunlight."
    "modern-art" = "A contemporary piece that challenges traditional artistic boundaries with bold geometric shapes and striking color contrasts."
    "classical-portrait" = "A timeless portrait in the classical tradition, showcasing refined technique and dignified subject matter."
    "mountain-landscape" = "Majestic mountain peaks rise against a dramatic sky, capturing the raw power and beauty of untamed wilderness."
    "masterpiece" = "The crown jewel of our collection - a masterwork that represents the pinnacle of artistic achievement and cultural significance."
}

Write-Host "Creating demo audio files for gallery..." -ForegroundColor Green

foreach ($key in $descriptions.Keys) {
    Write-Host "Creating $key.wav..." -ForegroundColor Yellow
    
    # Set output to file
    $synth.SetOutputToWaveFile("$audioDir/$key.wav")
    
    # Speak the text
    $synth.Speak($descriptions[$key])
    
    Write-Host "Completed $key.wav" -ForegroundColor Green
}

# Reset output to default (speakers)
$synth.SetOutputToDefaultAudioDevice()
$synth.Dispose()

Write-Host "All audio files created successfully!" -ForegroundColor Green
Write-Host "Note: Files are created in .wav format" -ForegroundColor Yellow
Write-Host "You can convert to .mp3 using ffmpeg or online converter" -ForegroundColor Yellow