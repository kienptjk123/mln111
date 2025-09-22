# PowerShell script để tạo file audio demo
# Sử dụng Windows Text-to-Speech

$audioDir = "./public/audio"

# Tạo thư mục nếu chưa có
if (!(Test-Path $audioDir)) {
    New-Item -ItemType Directory -Force -Path $audioDir
}

# Load System.Speech assembly
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

# Danh sách các mô tả tranh
$descriptions = @{
    "abstract-art-1" = "Một tác phẩm trừu tượng đầy màu sắc khám phá sự tương tác giữa màu sắc và hình khối, thể hiện sự hỗn loạn và vẻ đẹp của cuộc sống hiện đại."
    "portrait-1" = "Một chân dung thân mật nắm bắt được bản chất của cảm xúc con người thông qua nét vẽ tinh tế và ánh sáng khéo léo."
    "landscape-1" = "Một bức tranh phong cảnh thanh bình mô tả vẻ đẹp yên tĩnh của thiên nhiên với những ngọn đồi thoai thoải và ánh nắng vàng."
    "modern-art" = "Một tác phẩm đương đại thách thức những ranh giới nghệ thuật truyền thống với những hình khối hình học táo bạo và màu sắc tương phản mạnh mẽ."
    "classical-portrait" = "Một chân dung vượt thời gian theo truyền thống cổ điển thể hiện kỹ thuật tinh tế và chủ đề trang nghiêm."
    "mountain-landscape" = "Những đỉnh núi hùng vĩ vươn lên trên bầu trời kịch tính nắm bắt sức mạnh nguyên sơ và vẻ đẹp của thiên nhiên hoang dã."
    "masterpiece" = "Báu vật của bộ sưu tập chúng tôi, một kiệt tác đại diện cho đỉnh cao của thành tựu nghệ thuật và ý nghĩa văn hóa."
}

Write-Host "Đang tạo file audio demo cho gallery..." -ForegroundColor Green

foreach ($key in $descriptions.Keys) {
    Write-Host "Tạo $key.wav..." -ForegroundColor Yellow
    
    # Set output to file
    $synth.SetOutputToWaveFile("$audioDir/$key.wav")
    
    # Speak the text
    $synth.Speak($descriptions[$key])
    
    Write-Host "Hoàn thành $key.wav" -ForegroundColor Green
}

# Reset output to default (speakers)
$synth.SetOutputToDefaultAudioDevice()
$synth.Dispose()

Write-Host "Hoàn thành tất cả file audio!" -ForegroundColor Green
Write-Host "Lưu ý: File được tạo ở định dạng .wav" -ForegroundColor Yellow
Write-Host "Bạn có thể convert sang .mp3 bằng ffmpeg hoặc online converter" -ForegroundColor Yellow